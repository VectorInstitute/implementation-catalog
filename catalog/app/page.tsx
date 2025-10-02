"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Hero from "@/components/hero";
import FilterTabs from "@/components/filter-tabs";
import RepositoryCard from "@/components/repository-card";
import SearchBar from "@/components/search-bar";
import type { RepositoryType, RepositoryData } from "@/types/repository";
import { getAssetPath } from "@/lib/utils";

// Import the data at build time
import repositoryData from "@/public/data/repositories.json";

export default function Home() {
  const data = repositoryData as RepositoryData;
  const [activeFilter, setActiveFilter] = useState<RepositoryType | "all">("all");

  // Calculate counts for each filter
  const counts = useMemo(() => {
    const typeCounts: Record<string, number> = {
      all: data.repositories.length,
      "applied-research": 0,
      bootcamp: 0,
      tool: 0,
    };

    data.repositories.forEach((repo) => {
      typeCounts[repo.type] = (typeCounts[repo.type] || 0) + 1;
    });

    return typeCounts;
  }, [data.repositories]);

  // Filter repositories based on active filter
  const filteredRepositories = useMemo(() => {
    if (activeFilter === "all") {
      return data.repositories;
    }
    return data.repositories.filter((repo) => repo.type === activeFilter);
  }, [activeFilter, data.repositories]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero
        totalImplementations={data.totalImplementations}
        yearsOfResearch={data.yearsOfResearch}
      />

      {/* Main Content */}
      <div className="relative bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Browse Section */}
          <section id="browse" className="scroll-mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-vector-teal dark:from-white dark:via-gray-100 dark:to-vector-teal bg-clip-text text-transparent">
                Browse Implementations
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Discover AI implementations across various domains and techniques
              </p>
            </div>

            {/* Search Bar */}
            <SearchBar />

            {/* Filter Tabs */}
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              counts={counts}
            />

            {/* Repository Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRepositories.map((repo, index) => (
                <RepositoryCard key={repo.repo_id} repository={repo} index={index} />
              ))}
            </div>

            {/* No results message */}
            {filteredRepositories.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No repositories found for this filter.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src={getAssetPath("vector-logo.svg")}
              alt="Vector Institute"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Vector Institute. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
            Last updated: {new Date(data.lastUpdated).toISOString().split('T')[0]}
          </p>
        </div>
      </footer>
    </main>
  );
}
