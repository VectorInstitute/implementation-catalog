"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Star, Users, GitBranch, Download, ChevronDown } from "lucide-react";

// ── Shared types (structurally compatible with analytics-content.tsx) ─────────

interface RepoSnapshot {
  timestamp: string;
  stars: number;
  unique_visitors_14d: number | null;
  unique_cloners_14d: number | null;
}

interface RepoHistory {
  name: string;
  snapshots: RepoSnapshot[];
}

interface GitHubHistoricalData {
  repos: Record<string, RepoHistory>;
  last_updated: string | null;
}

interface PyPISnapshot {
  timestamp: string;
  downloads_last_week: number | null;
  downloads_last_month: number | null;
}

interface PyPIPackageHistory {
  name: string;
  repo_id: string;
  type: string;
  snapshots: PyPISnapshot[];
}

interface PyPIHistoricalData {
  packages: Record<string, PyPIPackageHistory>;
  last_updated: string | null;
}

type GitHubMetric = "unique_cloners_14d" | "unique_visitors_14d";
type PyPIMetric = "downloads_last_week" | "downloads_last_month";

interface TrafficPoint {
  label: string;
  raw: number | null;
  avg4w: number | null;
}

interface AggregatePoint {
  label: string;
  starsGained: number;
}

interface TopMover {
  id: string;
  name: string;
  earlyAvg: number;
  recentAvg: number;
  delta: number;
  growthPct: number | null;
}

interface TooltipEntry {
  name: string;
  value: number | null;
  color: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BRAND = {
  magenta: "#EB088A",
  cobalt: "#313CFF",
  violet: "#8A25C9",
  tangerine: "#FF9E00",
} as const;

const GITHUB_METRIC_META: Record<
  GitHubMetric,
  { label: string; shortLabel: string; color: string }
> = {
  unique_cloners_14d: {
    label: "Unique Cloners",
    shortLabel: "cloners",
    color: BRAND.cobalt,
  },
  unique_visitors_14d: {
    label: "Unique Visitors",
    shortLabel: "visitors",
    color: BRAND.violet,
  },
};

const PYPI_METRIC_META: Record<
  PyPIMetric,
  { label: string; shortLabel: string; color: string }
> = {
  downloads_last_week: {
    label: "Weekly Downloads",
    shortLabel: "weekly",
    color: BRAND.tangerine,
  },
  downloads_last_month: {
    label: "Monthly Downloads",
    shortLabel: "monthly",
    color: BRAND.cobalt,
  },
};

// ── Data helpers ──────────────────────────────────────────────────────────────

function mondayOf(timestamp: string): string {
  const d = new Date(timestamp);
  const day = d.getDay(); // 0 = Sun
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().slice(0, 10);
}

function weekLabel(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Returns one label per calendar month (first occurrence) for XAxis ticks.
function monthBoundaryTicks(data: { label: string }[]): string[] {
  const seen = new Set<string>();
  return data
    .filter(({ label }) => {
      const month = label.slice(0, 3); // "Dec", "Jan", etc.
      if (seen.has(month)) return false;
      seen.add(month);
      return true;
    })
    .map(({ label }) => label);
}

function dedupeByWeek<T extends { timestamp: string }>(snapshots: T[]): T[] {
  const map = new Map<string, T>();
  for (const snap of snapshots) {
    map.set(mondayOf(snap.timestamp), snap);
  }
  return [...map.values()].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function movingAvg(
  values: (number | null)[],
  window: number
): (number | null)[] {
  return values.map((_, i) => {
    const slice = values.slice(Math.max(0, i - window + 1), i + 1);
    const valid = slice.filter((v): v is number => v !== null);
    // require at least half the window to avoid misleading early points
    if (valid.length < Math.ceil(window / 2)) return null;
    return Math.round(valid.reduce((s, v) => s + v, 0) / valid.length);
  });
}

function computeTopMovers<T extends { timestamp: string }>(
  entries: [string, { name: string; snapshots: T[] }][],
  getValue: (s: T) => number | null,
  n = 8
): TopMover[] {
  const WINDOW = 4;
  return entries
    .map(([id, entry]) => {
      const snaps = dedupeByWeek(entry.snapshots);
      if (snaps.length < WINDOW * 2) return null;

      const vals = snaps.map((s) => getValue(s) ?? 0);
      const earlyAvg =
        vals.slice(0, WINDOW).reduce((s, v) => s + v, 0) / WINDOW;
      const recentAvg =
        vals.slice(-WINDOW).reduce((s, v) => s + v, 0) / WINDOW;
      const delta = recentAvg - earlyAvg;
      const growthPct =
        earlyAvg > 0 ? Math.round((delta / earlyAvg) * 100) : null;

      return {
        id,
        name: entry.name,
        earlyAvg: Math.round(earlyAvg),
        recentAvg: Math.round(recentAvg),
        delta: Math.round(delta),
        growthPct,
      } satisfies TopMover;
    })
    .filter((m): m is TopMover => m !== null && m.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, n);
}

// ── Shared UI primitives ──────────────────────────────────────────────────────

function ChartNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-4">
      {children}
    </p>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold" style={{ color: entry.color }}>
            {entry.name}:
          </span>{" "}
          {entry.value !== null ? entry.value.toLocaleString() : "-"}
        </p>
      ))}
    </div>
  );
}

function MetricToggle<M extends string>({
  options,
  active,
  onChange,
}: {
  options: Record<M, { label: string }>;
  active: M;
  onChange: (m: M) => void;
}) {
  return (
    <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 text-sm overflow-hidden">
      {(Object.keys(options) as M[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-3 py-1.5 transition-colors ${
            active === m
              ? "bg-vector-magenta text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          {options[m].label}
        </button>
      ))}
    </div>
  );
}

function RepoSelector({
  repos,
  value,
  onChange,
}: {
  repos: [string, string][];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vector-magenta cursor-pointer"
      >
        {repos.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// bars = raw weekly snapshot, line = 4-week moving average
function SpotlightChart({
  data,
  color,
}: {
  data: TrafficPoint[];
  color: string;
}) {
  const ticks = monthBoundaryTicks(data);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          strokeOpacity={0.6}
        />
        <XAxis
          dataKey="label"
          ticks={ticks}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          width={44}
          allowDecimals={false}
          tickFormatter={(v) =>
            v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
          }
        />
        <Tooltip content={<ChartTooltip />} />
        <Bar
          dataKey="raw"
          name="Weekly snapshot"
          fill={color}
          fillOpacity={0.2}
          radius={[2, 2, 0, 0]}
        />
        <Line
          type="monotone"
          dataKey="avg4w"
          name="4-week avg"
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function TopMoversPanel({
  movers,
  color,
  shortLabel,
}: {
  movers: TopMover[];
  color: string;
  shortLabel: string;
}) {
  const maxRecent = movers[0]?.recentAvg ?? 1;

  if (movers.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 py-4">
        Not enough historical data yet.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {movers.map((m, i) => {
          const barPct = Math.min(
            100,
            Math.round((m.recentAvg / maxRecent) * 100)
          );
          return (
            <div key={m.id} className="flex items-center gap-2.5">
              <span className="w-4 text-xs text-gray-400 text-right flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1 mb-1">
                  <a
                    href={`https://github.com/${m.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-vector-magenta truncate"
                  >
                    {m.name}
                  </a>
                  <span
                    className="text-xs flex-shrink-0 font-semibold"
                    style={{ color }}
                  >
                    +{m.delta.toLocaleString()}
                    {m.growthPct !== null && (
                      <span className="text-gray-400 font-normal ml-1">
                        ({m.growthPct > 0 ? "+" : ""}
                        {m.growthPct}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${barPct}%`,
                      backgroundColor: color,
                      opacity: 0.65,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        Δ = avg of last 4 weeks − avg of first 4 weeks ·{" "}
        <span className="italic">unique {shortLabel} / 14-day window</span>
      </p>
    </>
  );
}

// ── GitHub Trends Section ────────────────────────────────────────────────────

function buildAggregateStarsSeries(
  repos: Record<string, RepoHistory>
): AggregatePoint[] {
  const weekSet = new Set<string>();
  const repoWeekMaps = new Map<string, Map<string, number>>();

  for (const [repoId, repo] of Object.entries(repos)) {
    const deduped = dedupeByWeek(repo.snapshots);
    const weekMap = new Map<string, number>();
    for (const snap of deduped) {
      const week = mondayOf(snap.timestamp);
      weekSet.add(week);
      weekMap.set(week, snap.stars);
    }
    repoWeekMaps.set(repoId, weekMap);
  }

  const sortedWeeks = [...weekSet].sort();
  const repoLastKnown = new Map<string, number>();

  const raw = sortedWeeks.map((week) => {
    let total = 0;
    for (const [repoId, weekMap] of repoWeekMaps) {
      if (weekMap.has(week)) {
        repoLastKnown.set(repoId, weekMap.get(week)!);
      }
      total += repoLastKnown.get(repoId) ?? 0;
    }
    return { week, label: weekLabel(week), total };
  });

  const baseline = raw[0]?.total ?? 0;
  return raw.map((pt) => ({
    label: pt.label,
    starsGained: pt.total - baseline,
  }));
}

function buildGitHubSpotlightSeries(
  snapshots: RepoSnapshot[],
  metric: GitHubMetric
): TrafficPoint[] {
  const deduped = dedupeByWeek(snapshots);
  const rawValues = deduped.map((s) => s[metric] ?? null);
  const avgValues = movingAvg(rawValues, 4);
  return deduped.map((snap, i) => ({
    label: weekLabel(mondayOf(snap.timestamp)),
    raw: rawValues[i],
    avg4w: avgValues[i],
  }));
}

export function GitHubTrendsSection({
  historicalData,
}: {
  historicalData: GitHubHistoricalData | null;
}) {
  const [selectedRepoId, setSelectedRepoId] = useState("");
  const [metric, setMetric] = useState<GitHubMetric>("unique_cloners_14d");

  const repos = historicalData?.repos ?? {};

  const spotlightRepos = useMemo(
    () =>
      Object.entries(repos)
        .filter(([, r]) => dedupeByWeek(r.snapshots).length >= 4)
        .sort(([, a], [, b]) => a.name.localeCompare(b.name))
        .map(([id, r]) => [id, r.name] as [string, string]),
    [repos]
  );

  const activeRepoId = (selectedRepoId || spotlightRepos[0]?.[0]) ?? "";

  const aggregateData = useMemo(
    () => buildAggregateStarsSeries(repos),
    [repos]
  );

  const spotlightData = useMemo(
    () =>
      repos[activeRepoId]
        ? buildGitHubSpotlightSeries(repos[activeRepoId].snapshots, metric)
        : [],
    [repos, activeRepoId, metric]
  );

  const topMovers = useMemo(
    () =>
      computeTopMovers(
        Object.entries(repos),
        (s: RepoSnapshot) => s[metric] ?? null
      ),
    [repos, metric]
  );

  const gained = aggregateData.at(-1)?.starsGained ?? 0;
  const since = aggregateData[0]?.label ?? "";
  const { color, shortLabel } = GITHUB_METRIC_META[metric];

  if (!historicalData) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-vector-magenta" />
        Trends
      </h2>

      {/* Stars growth */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between mb-0.5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-vector-magenta" />
            Portfolio Stars Growth
          </h3>
          {gained > 0 && (
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              +{gained.toLocaleString()} since {since}
            </span>
          )}
        </div>
        <ChartNote>
          Cumulative new stars across all repositories. Stars are direct human
          actions, no CI/CD noise.
        </ChartNote>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={aggregateData}
            margin={{ top: 5, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="starsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BRAND.magenta} stopOpacity={0.2} />
                <stop offset="95%" stopColor={BRAND.magenta} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey="label"
              ticks={monthBoundaryTicks(aggregateData)}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              width={36}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="starsGained"
              name="Stars gained"
              stroke={BRAND.magenta}
              strokeWidth={2}
              fill="url(#starsGradient)"
              dot={false}
              activeDot={{ r: 4, fill: BRAND.magenta, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Spotlight + Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <MetricToggle
              options={{
                unique_cloners_14d: { label: "Unique Cloners" },
                unique_visitors_14d: { label: "Unique Visitors" },
              }}
              active={metric}
              onChange={setMetric}
            />
            <RepoSelector
              repos={spotlightRepos}
              value={activeRepoId}
              onChange={setSelectedRepoId}
            />
          </div>
          <ChartNote>
            Bars = raw 14-day window each week · line = 4-week moving average
            (smooths CI/CD noise)
          </ChartNote>
          {spotlightData.length >= 4 ? (
            <SpotlightChart data={spotlightData} color={color} />
          ) : (
            <p className="text-sm text-gray-400 py-10 text-center">
              Not enough data for this repository.
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5 flex items-center gap-2">
            {metric === "unique_cloners_14d" ? (
              <GitBranch className="w-4 h-4" style={{ color }} />
            ) : (
              <Users className="w-4 h-4" style={{ color }} />
            )}
            Top Movers
          </h3>
          <ChartNote>
            Repos with the highest growth in unique {shortLabel} over 7 months.
          </ChartNote>
          <TopMoversPanel
            movers={topMovers}
            color={color}
            shortLabel={shortLabel}
          />
        </div>
      </div>
    </section>
  );
}

// ── PyPI Trends Section ───────────────────────────────────────────────────────

function buildPyPISpotlightSeries(
  snapshots: PyPISnapshot[],
  metric: PyPIMetric
): TrafficPoint[] {
  const deduped = dedupeByWeek(snapshots);
  const rawValues = deduped.map((s) => s[metric] ?? null);
  const avgValues = movingAvg(rawValues, 4);
  return deduped.map((snap, i) => ({
    label: weekLabel(mondayOf(snap.timestamp)),
    raw: rawValues[i],
    avg4w: avgValues[i],
  }));
}

export function PyPITrendsSection({
  historicalData,
}: {
  historicalData: PyPIHistoricalData | null;
}) {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [metric, setMetric] = useState<PyPIMetric>("downloads_last_week");

  const packages = historicalData?.packages ?? {};

  const packageList = useMemo(
    () =>
      Object.entries(packages)
        .filter(([, p]) => dedupeByWeek(p.snapshots).length >= 4)
        .sort(([, a], [, b]) => a.name.localeCompare(b.name))
        .map(([id, p]) => [id, p.name] as [string, string]),
    [packages]
  );

  const activePackage = (selectedPackage || packageList[0]?.[0]) ?? "";

  const spotlightData = useMemo(
    () =>
      packages[activePackage]
        ? buildPyPISpotlightSeries(packages[activePackage].snapshots, metric)
        : [],
    [packages, activePackage, metric]
  );

  const topMovers = useMemo(
    () =>
      computeTopMovers(
        Object.entries(packages).map(([id, p]) => [
          id,
          { name: p.name, snapshots: p.snapshots },
        ]),
        (s: PyPISnapshot) => s[metric] ?? null
      ),
    [packages, metric]
  );

  const { color, shortLabel } = PYPI_METRIC_META[metric];

  if (!historicalData || packageList.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-vector-magenta" />
        Trends
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <MetricToggle
              options={{
                downloads_last_week: { label: "Weekly" },
                downloads_last_month: { label: "Monthly" },
              }}
              active={metric}
              onChange={setMetric}
            />
            <RepoSelector
              repos={packageList}
              value={activePackage}
              onChange={setSelectedPackage}
            />
          </div>
          <ChartNote>
            Bars = raw {shortLabel} download count each snapshot · line = 4-week
            moving average (smooths CI/CD noise)
          </ChartNote>
          {spotlightData.length >= 4 ? (
            <SpotlightChart data={spotlightData} color={color} />
          ) : (
            <p className="text-sm text-gray-400 py-10 text-center">
              Not enough data for this package.
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5 flex items-center gap-2">
            <Download className="w-4 h-4" style={{ color }} />
            Top Movers
          </h3>
          <ChartNote>
            Packages with the highest growth in {shortLabel} downloads over 7 months.
          </ChartNote>
          <TopMoversPanel
            movers={topMovers}
            color={color}
            shortLabel={shortLabel + " downloads"}
          />
        </div>
      </div>
    </section>
  );
}
