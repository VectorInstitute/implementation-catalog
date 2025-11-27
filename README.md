<a href="https://vectorinstitute.ai/"><img src="vector-logo-black.svg?raw=true)" width="175" align="right" /></a>

# Implementation Catalog

This catalog is a collection of repositories for various Machine Learning techniques and algorithms implemented at Vector Institute.

## 🌐 Web Interface

The catalog is available as an interactive website featuring:
- **Fast Search**: Instant client-side search powered by Pagefind
- **Filtering**: Browse by type (applied-research, bootcamp, tool)
- **Responsive Design**: Works on all devices
- **Static Deployment**: Zero backend, hosted on GitHub Pages

### Local Development

```bash
# Navigate to the catalog directory
cd catalog

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📊 Analytics Dashboard

Executive dashboard for catalog performance metrics:
- **Key Metrics**: Aggregate stats across all repositories
- **Top Performers**: Highest starred, most visited, and most cloned repos
- **Complete Overview**: Sortable table of all repositories
- **Auto-Update**: Weekly collection via GitHub Actions (Mondays at 00:00 UTC)

### GitHub Metrics
**Manual Collection**: `python scripts/collect_github_metrics.py` (requires `gh` CLI)

> **Note**: Traffic data (views/clones) requires a Personal Access Token with `repo` permissions. Add as `METRICS_GITHUB_TOKEN` secret in repository settings. Without it, traffic metrics will show "—" but basic metrics (stars, forks) still work.

### PyPI Metrics
Collects download statistics and package metadata for tools published on PyPI:
- Download counts (last day, week, month, and total)
- Package version and release date
- Historical tracking for trend analysis

**Manual Collection**: `python scripts/collect_pypi_metrics.py`

## 📋 Repository Information

Each repository in the catalog is defined by a YAML file in the `repositories/` directory with the following fields:

### Required Fields
- **name**: Repository name
- **repo_id**: GitHub repository identifier (org/repo)
- **description**: Brief introduction to the implementation
- **implementations**: List of ML algorithms and techniques with optional reference URLs
- **type**: Classification - `tool`, `bootcamp`, or `applied-research`
- **year**: Publication or release year

### Optional Fields
- **public_datasets**: Links to publicly available datasets used
- **github_url**: Custom GitHub URL (overrides repo_id)
- **paper_url**: Link to associated research paper
- **bibtex**: Citation reference for the paper
- **platform_url**: URL for deployment platform (e.g., Coder)
- **package_name**: PyPI package name for published tools
