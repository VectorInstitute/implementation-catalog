"use client";

import { motion } from "framer-motion";
import { ExternalLink, FileText, BookOpen, Code2, Database, Check } from "lucide-react";
import type { Repository } from "@/types/repository";
import { useState } from "react";

interface RepositoryCardProps {
  repository: Repository;
  index?: number;
}

export default function RepositoryCard({ repository, index = 0 }: RepositoryCardProps) {
  const repoUrl = repository.github_url || `https://github.com/${repository.repo_id}`;
  const repoSlug = repository.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const [copied, setCopied] = useState(false);

  const handleCiteCopy = async () => {
    if (!repository.bibtex) return;

    try {
      // Use window.location to construct proper path that works with GitHub Pages base path
      const baseUrl = window.location.pathname.includes('/implementation-catalog')
        ? '/implementation-catalog'
        : '';
      const response = await fetch(`${baseUrl}/data/papers.bib`);
      const bibtexContent = await response.text();

      // Parse the bibtex file to find the specific entry
      const entryRegex = new RegExp(`@\\w+\\{${repository.bibtex},[\\s\\S]*?\\n\\}`, 'i');
      const match = bibtexContent.match(entryRegex);

      if (match) {
        await navigator.clipboard.writeText(match[0]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy citation:', error);
    }
  };

  const typeColors = {
    "tool": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    "bootcamp": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    "applied-research": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  };

  return (
    <motion.article
      id={repoSlug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6 overflow-hidden scroll-mt-20"
    >
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vector-teal via-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Background glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-vector-teal/5 rounded-full blur-3xl group-hover:bg-vector-teal/10 transition-colors duration-500" />
      {/* Header */}
      <div className="relative flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-vector-teal transition-colors"
          >
            {repository.name}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1 bg-vector-teal/10 text-vector-teal border border-vector-teal/30 text-xs font-semibold px-3 py-1.5 rounded-full">
            {repository.year}
          </span>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border ${typeColors[repository.type]}`}>
            {repository.type}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
        {repository.description}
      </p>

      {/* Implementations */}
      {repository.implementations && repository.implementations.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Implementations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {repository.implementations.map((impl, idx) => (
              <span key={idx}>
                {impl.url ? (
                  <a
                    href={impl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-cyan-100 dark:bg-cyan-900/30 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                  >
                    {impl.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="inline-block bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-medium px-3 py-1.5 rounded-lg">
                    {impl.name}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Datasets */}
      {repository.public_datasets && repository.public_datasets.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Datasets</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {repository.public_datasets.map((dataset, idx) => (
              <span key={idx}>
                {dataset.url ? (
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                  >
                    {dataset.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium px-3 py-1.5 rounded-lg">
                    {dataset.name}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(repository.paper_url || repository.bibtex || repository.platform_url) && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {repository.paper_url && (
            <a
              href={repository.paper_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              Paper
            </a>
          )}
          {repository.bibtex && (
            <button
              onClick={handleCiteCopy}
              className="inline-flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-all hover:scale-105"
              title={copied ? "Copied!" : "Copy citation to clipboard"}
            >
              {copied ? <Check className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              {copied ? "Copied!" : "Cite"}
            </button>
          )}
          {repository.platform_url && (
            <a
              href={repository.platform_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all hover:scale-105"
            >
              <Code2 className="w-4 h-4" />
              Open in Coder
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
}
