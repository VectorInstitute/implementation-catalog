"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  Eye,
  Download,
  TrendingUp,
  Calendar,
  Award,
  ExternalLink,
  BarChart3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Image from "next/image";
import { getAssetPath } from "@/lib/utils";

// Types
interface RepoSnapshot {
  repo_id: string;
  name: string;
  timestamp: string;
  stars: number;
  forks: number;
  watchers: number;
  open_issues: number;
  size: number;
  views_14d: number | null;
  unique_visitors_14d: number | null;
  clones_14d: number | null;
  unique_cloners_14d: number | null;
  language: string | null;
  created_at: string | null;
  updated_at: string | null;
  topics: string[];
}

interface RepoHistory {
  name: string;
  snapshots: RepoSnapshot[];
}

interface HistoricalData {
  repos: Record<string, RepoHistory>;
  last_updated: string | null;
}

interface RepoMetrics {
  repo_id: string;
  name: string;
  stars: number;
  forks: number;
  unique_visitors: number;
  unique_cloners: number;
  language: string | null;
  description?: string;
}

interface RepositoryInfo {
  repo_id: string;
  description: string;
}

type SortColumn = "name" | "language" | "stars" | "forks" | "unique_visitors" | "unique_cloners";
type SortDirection = "asc" | "desc";

export default function AnalyticsPage() {
  // Load data dynamically to ensure fresh data during development
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [repoDescriptions, setRepoDescriptions] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<SortColumn>("unique_cloners");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    const loadData = async () => {
      try {
        const basePath =
          process.env.NEXT_PUBLIC_BASE_PATH === "true"
            ? "/implementation-catalog"
            : "";

        // Load historical metrics data
        const metricsResponse = await fetch(
          `${basePath}/data/github_metrics_history.json`
        );
        if (!metricsResponse.ok) throw new Error("Failed to fetch metrics data");
        const metricsData = await metricsResponse.json();
        setHistoricalData(metricsData);

        // Load repository descriptions
        try {
          const reposResponse = await fetch(`${basePath}/data/repositories.json`);
          if (reposResponse.ok) {
            const reposData = await reposResponse.json();
            const descriptions: Record<string, string> = {};
            reposData.repositories?.forEach((repo: RepositoryInfo) => {
              descriptions[repo.repo_id] = repo.description;
            });
            setRepoDescriptions(descriptions);
          }
        } catch (error) {
          console.warn("No repository descriptions found:", error);
        }
      } catch (error) {
        console.warn("No historical metrics data found:", error);
        setHistoricalData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate all repository metrics
  const allRepoMetrics = useMemo(() => {
    if (!historicalData?.repos) return [];

    return Object.entries(historicalData.repos)
      .map(([repo_id, repo]) => {
        if (repo.snapshots.length === 0) return null;
        const latest = repo.snapshots[repo.snapshots.length - 1];
        return {
          repo_id,
          name: repo.name,
          stars: latest.stars || 0,
          forks: latest.forks || 0,
          unique_visitors: latest.unique_visitors_14d || 0,
          unique_cloners: latest.unique_cloners_14d || 0,
          language: latest.language,
          description: repoDescriptions[repo_id],
        } as RepoMetrics;
      })
      .filter((r): r is RepoMetrics => r !== null);
  }, [historicalData, repoDescriptions]);

  // Calculate aggregate metrics
  const aggregateMetrics = useMemo(() => {
    const totalStars = allRepoMetrics.reduce((sum, r) => sum + r.stars, 0);
    const totalForks = allRepoMetrics.reduce((sum, r) => sum + r.forks, 0);
    const totalVisitors = allRepoMetrics.reduce(
      (sum, r) => sum + r.unique_visitors,
      0
    );
    const totalCloners = allRepoMetrics.reduce(
      (sum, r) => sum + r.unique_cloners,
      0
    );

    return {
      totalStars,
      totalForks,
      totalVisitors,
      totalCloners,
      totalRepos: allRepoMetrics.length,
      avgStarsPerRepo:
        allRepoMetrics.length > 0
          ? Math.round(totalStars / allRepoMetrics.length)
          : 0,
    };
  }, [allRepoMetrics]);

  // Get top performers
  const topPerformers = useMemo(() => {
    return {
      byStars: [...allRepoMetrics].sort((a, b) => b.stars - a.stars).slice(0, 5),
      byVisitors: [...allRepoMetrics]
        .sort((a, b) => b.unique_visitors - a.unique_visitors)
        .slice(0, 5),
      byCloners: [...allRepoMetrics]
        .sort((a, b) => b.unique_cloners - a.unique_cloners)
        .slice(0, 5),
    };
  }, [allRepoMetrics]);

  // Sort repository metrics
  const sortedRepoMetrics = useMemo(() => {
    const sorted = [...allRepoMetrics].sort((a, b) => {
      let aValue: string | number | null = a[sortColumn];
      let bValue: string | number | null = b[sortColumn];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      // For strings, use locale compare
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For numbers
      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [allRepoMetrics, sortColumn, sortDirection]);

  // Handle column header click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Get sort icon for a column
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-vector-magenta to-vector-cobalt text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/95 rounded-md px-2 py-1.5 shadow-sm flex-shrink-0">
                <Image
                  src={getAssetPath("vector-logo.webp")}
                  alt="Vector Institute"
                  width={70}
                  height={15}
                  priority
                />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Repository Analytics
                </h1>
                <p className="text-white/90 text-lg">
                  GitHub Engagement & Community Impact Metrics
                </p>
              </div>
            </div>
            {historicalData?.last_updated && (
              <div className="hidden md:flex items-center gap-2 text-white/90">
                <Calendar className="w-5 h-5" />
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide opacity-80">
                    Last Updated
                  </div>
                  <div className="text-sm font-medium">
                    {new Date(historicalData.last_updated)
                      .toISOString()
                      .split("T")[0]}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 animate-pulse">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Analytics...
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Fetching repository metrics data
            </p>
          </div>
        ) : !historicalData?.repos || allRepoMetrics.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Analytics Data Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Historical metrics data will be available after the first weekly
              collection run.
            </p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-vector-magenta" />
                Key Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricCard
                  icon={<Star className="w-5 h-5 text-vector-magenta" />}
                  label="Total Stars"
                  value={aggregateMetrics.totalStars.toLocaleString()}
                />
                <MetricCard
                  icon={<GitFork className="w-5 h-5 text-vector-magenta" />}
                  label="Total Forks"
                  value={aggregateMetrics.totalForks.toLocaleString()}
                />
                <MetricCard
                  icon={<Eye className="w-5 h-5 text-vector-magenta" />}
                  label="Unique Visitors"
                  value={aggregateMetrics.totalVisitors.toLocaleString()}
                  sublabel="14-day period"
                />
                <MetricCard
                  icon={<Download className="w-5 h-5 text-vector-magenta" />}
                  label="Unique Cloners"
                  value={aggregateMetrics.totalCloners.toLocaleString()}
                  sublabel="14-day period"
                />
                <MetricCard
                  icon={<Award className="w-5 h-5 text-vector-magenta" />}
                  label="Tracked Repos"
                  value={aggregateMetrics.totalRepos.toLocaleString()}
                />
              </div>
            </section>

            {/* Top Performers */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-vector-magenta" />
                Top Performers
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Most Cloned */}
                <TopPerformerCard
                  title="Most Cloned (14d)"
                  icon={<Download className="w-5 h-5 text-vector-magenta" />}
                  repos={topPerformers.byCloners}
                  valueKey="unique_cloners"
                  valueLabel="cloners"
                />

                {/* Most Visited */}
                <TopPerformerCard
                  title="Most Visited (14d)"
                  icon={<Eye className="w-5 h-5 text-vector-magenta" />}
                  repos={topPerformers.byVisitors}
                  valueKey="unique_visitors"
                  valueLabel="visitors"
                />

                {/* Most Starred */}
                <TopPerformerCard
                  title="Most Starred"
                  icon={<Star className="w-5 h-5 text-vector-magenta" />}
                  repos={topPerformers.byStars}
                  valueKey="stars"
                  valueLabel="stars"
                />
              </div>
            </section>

            {/* All Repositories Table */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                All Repositories
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center gap-2">
                            Repository
                            {getSortIcon("name")}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => handleSort("language")}
                        >
                          <div className="flex items-center gap-2">
                            Language
                            {getSortIcon("language")}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => handleSort("stars")}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <Star className="w-3 h-3" />
                            Stars
                            {getSortIcon("stars")}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => handleSort("forks")}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <GitFork className="w-3 h-3" />
                            Forks
                            {getSortIcon("forks")}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => handleSort("unique_visitors")}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <Eye className="w-3 h-3" />
                            Visitors (14d)
                            {getSortIcon("unique_visitors")}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => handleSort("unique_cloners")}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <Download className="w-3 h-3" />
                            Cloners (14d)
                            {getSortIcon("unique_cloners")}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {sortedRepoMetrics.map((repo, index) => (
                        <motion.tr
                          key={repo.repo_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.02 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
                        >
                          <td
                            className="px-6 py-4 whitespace-nowrap relative"
                            title={repo.description}
                          >
                            <a
                              href={`https://github.com/${repo.repo_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm font-medium text-vector-magenta hover:text-vector-cobalt dark:text-vector-magenta dark:hover:text-vector-cobalt"
                            >
                              {repo.name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            {repo.description && (
                              <div className="hidden group-hover:block absolute left-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg py-3 px-4 w-96 max-w-[calc(100vw-2rem)] shadow-xl border-2 border-gray-200 dark:border-gray-600 leading-relaxed whitespace-normal break-words">
                                {repo.description}
                                <div className="absolute -top-2 left-8 w-4 h-4 bg-white dark:bg-gray-800 border-l-2 border-t-2 border-gray-200 dark:border-gray-600 transform rotate-45"></div>
                              </div>
                            )}
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {repo.language ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                  {repo.language}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                              {repo.stars.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                              {repo.forks.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                              {repo.unique_visitors > 0
                                ? repo.unique_visitors.toLocaleString()
                                : "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                              {repo.unique_cloners > 0
                                ? repo.unique_cloners.toLocaleString()
                                : "—"}
                            </td>
                          </motion.tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Vector Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  icon,
  label,
  value,
  sublabel,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  trend?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">{icon}</div>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </div>
      {sublabel && (
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {sublabel}
        </div>
      )}
      {trend && (
        <div className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
          {trend}
        </div>
      )}
    </motion.div>
  );
}

// Top Performer Card Component
function TopPerformerCard({
  title,
  icon,
  repos,
  valueKey,
  valueLabel,
}: {
  title: string;
  icon: React.ReactNode;
  repos: RepoMetrics[];
  valueKey: keyof RepoMetrics;
  valueLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {repos.map((repo, index) => (
          <div
            key={repo.repo_id}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-vector-magenta to-vector-cobalt flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <a
                href={`https://github.com/${repo.repo_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-vector-magenta dark:hover:text-vector-magenta truncate"
                title={repo.name}
              >
                {repo.name}
              </a>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {(repo[valueKey] as number).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {valueLabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
