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
  Package,
  Github,
  Info,
} from "lucide-react";
import Image from "next/image";
import { getAssetPath } from "@/lib/utils";
import type { User } from '@vector-institute/aieng-auth-core';

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

interface CIStatus {
  repo_id: string;
  state: 'success' | 'failure' | 'pending' | 'error' | 'unknown';
  total_checks: number;
  updated_at: string;
  details?: string;
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
  package_name?: string;
}

interface PyPISnapshot {
  package_name: string;
  name: string;
  repo_id: string;
  type: string;
  timestamp: string;
  downloads_last_day: number | null;
  downloads_last_week: number | null;
  downloads_last_month: number | null;
  total_downloads: number | null;
  version: string | null;
  release_date: string | null;
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

interface PyPIMetrics {
  package_name: string;
  name: string;
  repo_id: string;
  type: string;
  downloads_last_day: number;
  downloads_last_week: number;
  downloads_last_month: number;
  version: string | null;
  description?: string;
}

type SortColumn = "name" | "language" | "stars" | "forks" | "unique_visitors" | "unique_cloners" | "ci_status";
type PyPISortColumn = "name" | "downloads_last_day" | "downloads_last_week" | "downloads_last_month" | "version";
type SortDirection = "asc" | "desc";
type ActiveTab = "github" | "pypi";
type PyPIFilter = "all" | "tool" | "bootcamp" | "applied-research";

interface AnalyticsPageProps {
  user: User | null;
}

export default function AnalyticsPage({ user }: AnalyticsPageProps) {
  // Load data dynamically to ensure fresh data during development
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [pypiData, setPypiData] = useState<PyPIHistoricalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [repoDescriptions, setRepoDescriptions] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<SortColumn>("unique_cloners");
  const [pypiSortColumn, setPypiSortColumn] = useState<PyPISortColumn>("downloads_last_month");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pypiSortDirection, setPypiSortDirection] = useState<SortDirection>("desc");
  const [templateSortColumn, setTemplateSortColumn] = useState<SortColumn>("unique_cloners");
  const [templateSortDirection, setTemplateSortDirection] = useState<SortDirection>("desc");
  const [activeTab, setActiveTab] = useState<ActiveTab>("github");
  const [pypiFilter, setPypiFilter] = useState<PyPIFilter>("all");
  const [ciStatuses, setCiStatuses] = useState<Record<string, CIStatus>>({});
  const [ciLoading, setCiLoading] = useState(false);
  const [ciCache, setCiCache] = useState<{
    data: Record<string, CIStatus>;
    timestamp: number;
  } | null>(null);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const handleLogout = async () => {
    try {
      await fetch('/analytics/api/auth/logout', { method: 'POST' });
      window.location.href = '/analytics/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // With basePath: '/analytics' in next.config.ts, use empty string for public assets
        // Next.js automatically serves public files at /analytics/*
        const basePath = "/analytics";

        // Load historical metrics data
        const metricsResponse = await fetch(
          `${basePath}/data/github_metrics_history.json`
        );
        if (!metricsResponse.ok) throw new Error("Failed to fetch metrics data");
        const metricsData = await metricsResponse.json();
        setHistoricalData(metricsData);

        // Load PyPI metrics data
        try {
          const pypiResponse = await fetch(
            `${basePath}/data/pypi_metrics_history.json`
          );
          if (pypiResponse.ok) {
            const pypiMetricsData = await pypiResponse.json();
            setPypiData(pypiMetricsData);
          }
        } catch (error) {
          console.warn("No PyPI metrics data found:", error);
        }

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

  // Separate regular repos from template repos
  const regularRepoMetrics = useMemo(() => {
    return allRepoMetrics.filter(repo => !repo.name.startsWith('aieng-template-'));
  }, [allRepoMetrics]);

  const templateRepoMetrics = useMemo(() => {
    return allRepoMetrics.filter(repo =>
      repo.name.startsWith('aieng-template-') &&
      repo.name !== 'aieng-template-poetry'
    );
  }, [allRepoMetrics]);

  // Fetch CI statuses when repo metrics are loaded
  useEffect(() => {
    const fetchCIStatuses = async () => {
      if (allRepoMetrics.length === 0) return;

      // Check cache validity
      const isCacheValid = ciCache && (Date.now() - ciCache.timestamp) < CACHE_DURATION;
      if (isCacheValid) {
        setCiStatuses(ciCache.data);
        return;
      }

      setCiLoading(true);

      try {
        const repoIds = allRepoMetrics.map(r => r.repo_id);
        const basePath = "/analytics";

        const response = await fetch(`${basePath}/api/github/ci-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ repositories: repoIds }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('CI status API error:', response.status, errorData);
          throw new Error(`Failed to fetch CI statuses: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        setCiStatuses(data);

        // Update cache
        setCiCache({
          data,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Error fetching CI statuses:', error);
        // Set empty object so we don't keep retrying
        setCiStatuses({});
      } finally {
        setCiLoading(false);
      }
    };

    fetchCIStatuses();
  }, [allRepoMetrics, ciCache, CACHE_DURATION]);

  // Calculate aggregate metrics (using regular repos only, excluding templates)
  const aggregateMetrics = useMemo(() => {
    const totalStars = regularRepoMetrics.reduce((sum, r) => sum + r.stars, 0);
    const totalForks = regularRepoMetrics.reduce((sum, r) => sum + r.forks, 0);
    const totalVisitors = regularRepoMetrics.reduce(
      (sum, r) => sum + r.unique_visitors,
      0
    );
    const totalCloners = regularRepoMetrics.reduce(
      (sum, r) => sum + r.unique_cloners,
      0
    );

    return {
      totalStars,
      totalForks,
      totalVisitors,
      totalCloners,
      totalRepos: regularRepoMetrics.length,
      avgStarsPerRepo:
        regularRepoMetrics.length > 0
          ? Math.round(totalStars / regularRepoMetrics.length)
          : 0,
    };
  }, [regularRepoMetrics]);

  // Get top performers (using regular repos only, excluding templates)
  const topPerformers = useMemo(() => {
    return {
      byStars: [...regularRepoMetrics].sort((a, b) => b.stars - a.stars).slice(0, 5),
      byVisitors: [...regularRepoMetrics]
        .sort((a, b) => b.unique_visitors - a.unique_visitors)
        .slice(0, 5),
      byCloners: [...regularRepoMetrics]
        .sort((a, b) => b.unique_cloners - a.unique_cloners)
        .slice(0, 5),
    };
  }, [regularRepoMetrics]);

  // Sort repository metrics (regular repos only, excluding templates)
  const sortedRepoMetrics = useMemo(() => {
    const sorted = [...regularRepoMetrics].sort((a, b) => {
      // Special handling for CI status column
      if (sortColumn === 'ci_status') {
        const statusA = ciStatuses[a.repo_id]?.state || 'unknown';
        const statusB = ciStatuses[b.repo_id]?.state || 'unknown';

        // Define sort order: success > pending > failure/error > unknown
        const statusOrder: Record<string, number> = {
          success: 4,
          pending: 3,
          failure: 2,
          error: 2,
          unknown: 1,
        };

        const orderA = statusOrder[statusA] || 0;
        const orderB = statusOrder[statusB] || 0;

        return sortDirection === 'asc'
          ? orderA - orderB
          : orderB - orderA;
      }

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
  }, [regularRepoMetrics, sortColumn, sortDirection, ciStatuses]);

  // Sort template repository metrics
  const sortedTemplateMetrics = useMemo(() => {
    const sorted = [...templateRepoMetrics].sort((a, b) => {
      // Special handling for CI status column
      if (templateSortColumn === 'ci_status') {
        const statusA = ciStatuses[a.repo_id]?.state || 'unknown';
        const statusB = ciStatuses[b.repo_id]?.state || 'unknown';

        // Define sort order: success > pending > failure/error > unknown
        const statusOrder: Record<string, number> = {
          success: 4,
          pending: 3,
          failure: 2,
          error: 2,
          unknown: 1,
        };

        const orderA = statusOrder[statusA] || 0;
        const orderB = statusOrder[statusB] || 0;

        return templateSortDirection === 'asc'
          ? orderA - orderB
          : orderB - orderA;
      }

      let aValue: string | number | null = a[templateSortColumn];
      let bValue: string | number | null = b[templateSortColumn];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      // For strings, use locale compare
      if (typeof aValue === "string" && typeof bValue === "string") {
        return templateSortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For numbers
      return templateSortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [templateRepoMetrics, templateSortColumn, templateSortDirection, ciStatuses]);

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

  // Handle template column header click
  const handleTemplateSort = (column: SortColumn) => {
    if (templateSortColumn === column) {
      setTemplateSortDirection(templateSortDirection === "asc" ? "desc" : "asc");
    } else {
      setTemplateSortColumn(column);
      setTemplateSortDirection("desc");
    }
  };

  // Get template sort icon for a column
  const getTemplateSortIcon = (column: SortColumn) => {
    if (templateSortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 opacity-50" />;
    }
    return templateSortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  // PyPI Metrics Calculations
  const allPypiMetrics = useMemo(() => {
    if (!pypiData?.packages) return [];

    return Object.entries(pypiData.packages)
      .map(([package_name, pkg]) => {
        if (pkg.snapshots.length === 0) return null;
        const latest = pkg.snapshots[pkg.snapshots.length - 1];
        return {
          package_name,
          name: pkg.name,
          repo_id: pkg.repo_id,
          type: pkg.type || "tool", // Default to "tool" for backward compatibility
          downloads_last_day: latest.downloads_last_day || 0,
          downloads_last_week: latest.downloads_last_week || 0,
          downloads_last_month: latest.downloads_last_month || 0,
          version: latest.version,
          description: repoDescriptions[pkg.repo_id],
        } as PyPIMetrics;
      })
      .filter((p): p is PyPIMetrics => p !== null);
  }, [pypiData, repoDescriptions]);

  // Filter PyPI metrics based on selected filter
  const filteredPypiMetrics = useMemo(() => {
    if (pypiFilter === "all") return allPypiMetrics;
    return allPypiMetrics.filter((pkg) => pkg.type === pypiFilter);
  }, [allPypiMetrics, pypiFilter]);

  // Calculate aggregate PyPI metrics (using filtered data)
  const aggregatePypiMetrics = useMemo(() => {
    const totalDownloadsDay = filteredPypiMetrics.reduce(
      (sum, p) => sum + p.downloads_last_day,
      0
    );
    const totalDownloadsWeek = filteredPypiMetrics.reduce(
      (sum, p) => sum + p.downloads_last_week,
      0
    );
    const totalDownloadsMonth = filteredPypiMetrics.reduce(
      (sum, p) => sum + p.downloads_last_month,
      0
    );

    return {
      totalDownloadsDay,
      totalDownloadsWeek,
      totalDownloadsMonth,
      totalPackages: filteredPypiMetrics.length,
      avgDownloadsPerPackage:
        filteredPypiMetrics.length > 0
          ? Math.round(totalDownloadsMonth / filteredPypiMetrics.length)
          : 0,
    };
  }, [filteredPypiMetrics]);

  // Get top PyPI performers (using filtered data)
  const topPypiPerformers = useMemo(() => {
    return {
      byDay: [...filteredPypiMetrics]
        .sort((a, b) => b.downloads_last_day - a.downloads_last_day)
        .slice(0, 5),
      byWeek: [...filteredPypiMetrics]
        .sort((a, b) => b.downloads_last_week - a.downloads_last_week)
        .slice(0, 5),
      byMonth: [...filteredPypiMetrics]
        .sort((a, b) => b.downloads_last_month - a.downloads_last_month)
        .slice(0, 5),
    };
  }, [filteredPypiMetrics]);

  // Sort PyPI metrics (using filtered data)
  const sortedPypiMetrics = useMemo(() => {
    const sorted = [...filteredPypiMetrics].sort((a, b) => {
      let aValue: string | number | null = a[pypiSortColumn];
      let bValue: string | number | null = b[pypiSortColumn];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      // For strings, use locale compare
      if (typeof aValue === "string" && typeof bValue === "string") {
        return pypiSortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For numbers
      return pypiSortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [filteredPypiMetrics, pypiSortColumn, pypiSortDirection]);

  // Handle PyPI column header click
  const handlePypiSort = (column: PyPISortColumn) => {
    if (pypiSortColumn === column) {
      setPypiSortDirection(pypiSortDirection === "asc" ? "desc" : "asc");
    } else {
      setPypiSortColumn(column);
      setPypiSortDirection("desc");
    }
  };

  // Get PyPI sort icon
  const getPypiSortIcon = (column: PyPISortColumn) => {
    if (pypiSortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 opacity-50" />;
    }
    return pypiSortDirection === "asc" ? (
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
                  Engagement & Community Impact Metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {historicalData?.last_updated && (
                <div className="hidden lg:flex items-center gap-2 text-white/90">
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
              {user && (
                <div className="text-right">
                  <p className="text-xs text-white/70 uppercase tracking-wide">Signed in as</p>
                  <p className="text-sm font-semibold bg-gradient-to-r from-vector-magenta to-vector-violet bg-clip-text text-transparent">{user.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-vector-magenta hover:to-vector-violet rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                Logout
              </button>
            </div>
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
            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("github")}
                    className={`
                      ${
                        activeTab === "github"
                          ? "border-vector-magenta text-vector-magenta"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    `}
                  >
                    <Github
                      className={`
                        ${
                          activeTab === "github"
                            ? "text-vector-magenta"
                            : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                        }
                        -ml-0.5 mr-2 h-5 w-5
                      `}
                    />
                    <span>GitHub Metrics</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("pypi")}
                    className={`
                      ${
                        activeTab === "pypi"
                          ? "border-vector-magenta text-vector-magenta"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    `}
                  >
                    <Package
                      className={`
                        ${
                          activeTab === "pypi"
                            ? "text-vector-magenta"
                            : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                        }
                        -ml-0.5 mr-2 h-5 w-5
                      `}
                    />
                    <span>PyPI Metrics</span>
                    {allPypiMetrics.length > 0 && (
                      <span className="ml-2 py-0.5 px-2 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {allPypiMetrics.length}
                      </span>
                    )}
                  </button>
                </nav>
              </div>
            </div>

            {/* GitHub Tab Content */}
            {activeTab === "github" && (
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

            {/* Repositories Table */}
            <RepositoryTable
              title="Repositories"
              repos={sortedRepoMetrics}
              ciStatuses={ciStatuses}
              ciLoading={ciLoading}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              getSortIcon={getSortIcon}
            />

            {/* Template Repositories Table */}
            {templateRepoMetrics.length > 0 && (
              <RepositoryTable
                title="Template Repositories"
                repos={sortedTemplateMetrics}
                ciStatuses={ciStatuses}
                ciLoading={ciLoading}
                sortColumn={templateSortColumn}
                sortDirection={templateSortDirection}
                onSort={handleTemplateSort}
                getSortIcon={getTemplateSortIcon}
              />
            )}
              </>
            )}

            {/* PyPI Tab Content */}
            {activeTab === "pypi" && (
              <>
                {allPypiMetrics.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No PyPI Data Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      PyPI metrics will be available once packages are added to the catalog with the package_name field.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Info Banner */}
                    <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 dark:text-blue-100">
                          <p className="font-medium mb-1">About PyPI Download Statistics</p>
                          <p className="text-blue-800 dark:text-blue-200">
                            These numbers represent package download activity (excluding CDN mirrors), not unique users.
                            Downloads include CI/CD pipelines, automated builds, dependency installations, and development environment setups.
                            A single user or organization typically generates many downloads through automation and tooling.
                          </p>
                          <ul className="text-blue-800 dark:text-blue-200 mt-2 space-y-1 list-disc list-inside">
                            <li><span className="font-medium">Tool packages</span> are production-ready libraries for use in projects.</li>
                            <li><span className="font-medium">Bootcamp packages</span> are educational utilities for tutorials and demos.</li>
                            <li><span className="font-medium">Applied-research packages</span> are implementations from applied research projects.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="mb-8 flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Filter by type:
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPypiFilter("all")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            pypiFilter === "all"
                              ? "bg-vector-magenta text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          All Packages
                          <span className="ml-2 text-xs opacity-75">
                            ({allPypiMetrics.length})
                          </span>
                        </button>
                        <button
                          onClick={() => setPypiFilter("tool")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            pypiFilter === "tool"
                              ? "bg-vector-magenta text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          Tool
                          <span className="ml-2 text-xs opacity-75">
                            ({allPypiMetrics.filter((p) => p.type === "tool").length})
                          </span>
                        </button>
                        <button
                          onClick={() => setPypiFilter("bootcamp")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            pypiFilter === "bootcamp"
                              ? "bg-vector-magenta text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          Bootcamp
                          <span className="ml-2 text-xs opacity-75">
                            ({allPypiMetrics.filter((p) => p.type === "bootcamp").length})
                          </span>
                        </button>
                        <button
                          onClick={() => setPypiFilter("applied-research")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            pypiFilter === "applied-research"
                              ? "bg-vector-magenta text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          Applied Research
                          <span className="ml-2 text-xs opacity-75">
                            ({allPypiMetrics.filter((p) => p.type === "applied-research").length})
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <section className="mb-12">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-vector-magenta" />
                        Key Metrics
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard
                          icon={<Download className="w-5 h-5 text-vector-magenta" />}
                          label="Downloads (Last Day)"
                          value={aggregatePypiMetrics.totalDownloadsDay.toLocaleString()}
                        />
                        <MetricCard
                          icon={<Download className="w-5 h-5 text-vector-magenta" />}
                          label="Downloads (Last Week)"
                          value={aggregatePypiMetrics.totalDownloadsWeek.toLocaleString()}
                        />
                        <MetricCard
                          icon={<Download className="w-5 h-5 text-vector-magenta" />}
                          label="Downloads (Last Month)"
                          value={aggregatePypiMetrics.totalDownloadsMonth.toLocaleString()}
                        />
                        <MetricCard
                          icon={<Package className="w-5 h-5 text-vector-magenta" />}
                          label="Total Packages"
                          value={aggregatePypiMetrics.totalPackages.toLocaleString()}
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
                        <TopPypiPerformerCard
                          title="Most Downloaded (Last Day)"
                          icon={<Download className="w-5 h-5 text-vector-magenta" />}
                          packages={topPypiPerformers.byDay}
                          valueKey="downloads_last_day"
                          valueLabel="downloads"
                        />
                        <TopPypiPerformerCard
                          title="Most Downloaded (Last Week)"
                          icon={<Download className="w-5 h-5 text-vector-magenta" />}
                          packages={topPypiPerformers.byWeek}
                          valueKey="downloads_last_week"
                          valueLabel="downloads"
                        />
                        <TopPypiPerformerCard
                          title="Most Downloaded (Last Month)"
                          icon={<Download className="w-5 h-5 text-vector-magenta" />}
                          packages={topPypiPerformers.byMonth}
                          valueKey="downloads_last_month"
                          valueLabel="downloads"
                        />
                      </div>
                    </section>

                    {/* All Packages Table */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        All Packages
                      </h2>
                      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                              <tr>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  onClick={() => handlePypiSort("name")}
                                >
                                  <div className="flex items-center gap-2">
                                    Package
                                    {getPypiSortIcon("name")}
                                  </div>
                                </th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  onClick={() => handlePypiSort("version")}
                                >
                                  <div className="flex items-center gap-2">
                                    Version
                                    {getPypiSortIcon("version")}
                                  </div>
                                </th>
                                <th
                                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  onClick={() => handlePypiSort("downloads_last_day")}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    <Download className="w-3 h-3" />
                                    Last Day
                                    {getPypiSortIcon("downloads_last_day")}
                                  </div>
                                </th>
                                <th
                                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  onClick={() => handlePypiSort("downloads_last_week")}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    <Download className="w-3 h-3" />
                                    Last Week
                                    {getPypiSortIcon("downloads_last_week")}
                                  </div>
                                </th>
                                <th
                                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  onClick={() => handlePypiSort("downloads_last_month")}
                                >
                                  <div className="flex items-center justify-end gap-1">
                                    <Download className="w-3 h-3" />
                                    Last Month
                                    {getPypiSortIcon("downloads_last_month")}
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {sortedPypiMetrics.map((pkg, index) => {
                                // Show tooltip below for first 3 rows, above for the rest
                                const showTooltipBelow = index < 3;
                                return (
                                <motion.tr
                                  key={pkg.package_name}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.02 }}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
                                >
                                  <td
                                    className="px-6 py-4 whitespace-nowrap relative"
                                  >
                                    <div>
                                      <a
                                        href={`https://pypi.org/project/${pkg.package_name}/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-medium text-vector-magenta hover:text-vector-cobalt dark:text-vector-magenta dark:hover:text-vector-cobalt"
                                      >
                                        {pkg.package_name}
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {pkg.type === "tool" ? "Tool" : pkg.type === "bootcamp" ? "Bootcamp" : "Applied Research"}
                                      </div>
                                    </div>
                                    {pkg.description && (
                                      <div className={`hidden group-hover:block absolute left-0 ${showTooltipBelow ? 'top-full mt-2' : 'bottom-full mb-2'} z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg py-3 px-4 w-96 max-w-[calc(100vw-2rem)] shadow-xl border-2 border-gray-200 dark:border-gray-600 leading-relaxed whitespace-normal break-words`}>
                                        {pkg.description}
                                        <div className={`absolute ${showTooltipBelow ? '-top-2 left-8 border-l-2 border-t-2' : '-bottom-2 left-8 border-r-2 border-b-2'} w-4 h-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 transform rotate-45`}></div>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {pkg.version ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                        {pkg.version}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-400">—</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                                    {pkg.downloads_last_day > 0
                                      ? pkg.downloads_last_day.toLocaleString()
                                      : "—"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                                    {pkg.downloads_last_week > 0
                                      ? pkg.downloads_last_week.toLocaleString()
                                      : "—"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                                    {pkg.downloads_last_month > 0
                                      ? pkg.downloads_last_month.toLocaleString()
                                      : "—"}
                                  </td>
                                </motion.tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
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

// Reusable Repository Table Component
function RepositoryTable({
  title,
  repos,
  ciStatuses,
  ciLoading,
  sortColumn,
  sortDirection,
  onSort,
  getSortIcon,
}: {
  title: string;
  repos: RepoMetrics[];
  ciStatuses: Record<string, CIStatus>;
  ciLoading: boolean;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  getSortIcon: (column: SortColumn) => React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Repository
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onSort("language")}
                >
                  <div className="flex items-center gap-2">
                    Language
                    {getSortIcon("language")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onSort("stars")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <Star className="w-3 h-3" />
                    Stars
                    {getSortIcon("stars")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onSort("forks")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <GitFork className="w-3 h-3" />
                    Forks
                    {getSortIcon("forks")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onSort("unique_visitors")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <Eye className="w-3 h-3" />
                    Visitors (14d)
                    {getSortIcon("unique_visitors")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onSort("unique_cloners")}
                >
                  <div className="flex items-center justify-end gap-1">
                    <Download className="w-3 h-3" />
                    Cloners (14d)
                    {getSortIcon("unique_cloners")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => onSort("ci_status")}
                >
                  <div className="flex items-center justify-center gap-1">
                    CI Status
                    {getSortIcon("ci_status")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {repos.map((repo, index) => {
                const showTooltipBelow = index < 3;
                return (
                  <motion.tr
                    key={repo.repo_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap relative">
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
                        <div className={`hidden group-hover:block absolute left-0 ${showTooltipBelow ? 'top-full mt-2' : 'bottom-full mb-2'} z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg py-3 px-4 w-96 max-w-[calc(100vw-2rem)] shadow-xl border-2 border-gray-200 dark:border-gray-600 leading-relaxed whitespace-normal break-words`}>
                          {repo.description}
                          <div className={`absolute ${showTooltipBelow ? '-top-2 left-8 border-l-2 border-t-2' : '-bottom-2 left-8 border-r-2 border-b-2'} w-4 h-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 transform rotate-45`}></div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <CIStatusBadge
                        status={ciStatuses[repo.repo_id]}
                        loading={ciLoading}
                        showTooltipBelow={showTooltipBelow}
                      />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
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

// Top PyPI Performer Card Component
function TopPypiPerformerCard({
  title,
  icon,
  packages,
  valueKey,
  valueLabel,
}: {
  title: string;
  icon: React.ReactNode;
  packages: PyPIMetrics[];
  valueKey: keyof PyPIMetrics;
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
        {packages.map((pkg, index) => (
          <div
            key={pkg.package_name}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-vector-magenta to-vector-cobalt flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <a
                href={`https://pypi.org/project/${pkg.package_name}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-vector-magenta dark:hover:text-vector-magenta truncate"
                title={pkg.package_name}
              >
                {pkg.package_name}
              </a>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {(pkg[valueKey] as number).toLocaleString()}
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

// CI Status Badge Component (Icon-only)
function CIStatusBadge({
  status,
  loading,
  showTooltipBelow,
}: {
  status: CIStatus | undefined;
  loading: boolean;
  showTooltipBelow: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-vector-magenta rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!status || status.state === 'unknown') {
    return (
      <span className="text-sm text-gray-400">—</span>
    );
  }

  const statusConfig = {
    success: {
      icon: '✓',
      color: 'text-green-600 dark:text-green-400',
      label: 'Passing',
    },
    failure: {
      icon: '✗',
      color: 'text-red-600 dark:text-red-400',
      label: 'Failed',
    },
    error: {
      icon: '✗',
      color: 'text-red-600 dark:text-red-400',
      label: 'Error',
    },
    pending: {
      icon: '⚠',
      color: 'text-yellow-600 dark:text-yellow-400',
      label: 'Pending',
    },
    unknown: {
      icon: '—',
      color: 'text-gray-400',
      label: 'Unknown',
    },
  };

  const config = statusConfig[status.state];

  return (
    <div className="relative group inline-flex items-center justify-center">
      <span className={`text-base font-semibold ${config.color}`}>
        {config.icon}
      </span>
      {/* Tooltip - right aligned to prevent cutoff */}
      <div className={`hidden group-hover:block absolute right-0 ${showTooltipBelow ? 'top-full mt-2' : 'bottom-full mb-2'} z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl border-2 border-gray-200 dark:border-gray-600`}>
        <div className="font-medium mb-1">{config.label}</div>
        <div className="text-gray-600 dark:text-gray-400">{status.details}</div>
        <div className="text-gray-500 dark:text-gray-500 text-[10px] mt-1">
          Updated: {new Date(status.updated_at).toLocaleString()}
        </div>
        <div className={`absolute right-2 ${showTooltipBelow ? '-top-2 border-l-2 border-t-2' : '-bottom-2 border-r-2 border-b-2'} w-4 h-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 transform rotate-45`}></div>
      </div>
    </div>
  );
}
