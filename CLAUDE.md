# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository maintains the Vector Institute Implementation Catalog - a curated collection of Machine Learning implementations. The catalog is maintained through YAML files in the `repositories/` directory and automatically generates documentation at https://vectorinstitute.github.io/implementation-catalog.

## Project Structure

The project has a unique architecture that separates data from presentation:

- **repositories/**: Contains individual YAML files, one per repository in the catalog. Each YAML file defines:
  - Repository metadata (name, description, year)
  - List of implementations/algorithms
  - Public datasets used
  - Type classification (tool, bootcamp, applied-research)
  - Optional: paper URLs, bibtex references, platform URLs

- **docs/**: MkDocs documentation site source
  - `docs/index.md`: Main catalog page (auto-generated from YAML files)
  - `docs/implementation_details.md`: Additional documentation
  - `docs/bibtex/`: Citation files referenced in YAML files
  - `docs/assets/`: Images and static assets

- **scripts/**: Python automation scripts
  - `sync_repositories_to_docs.py`: Syncs YAML files to docs/index.md

- **site/**: Generated documentation (not tracked in git)

## Development Commands

### Documentation Site

```bash
# Install dependencies
uv sync --group docs

# Serve documentation locally (with auto-reload)
uv run mkdocs serve

# Build documentation site
uv run mkdocs build

# Sync YAML repositories to docs/index.md
python scripts/sync_repositories_to_docs.py
```

### Code Quality

```bash
# Run all pre-commit hooks
pre-commit run --all-files

# Format and lint code
uv run ruff format .
uv run ruff check --fix .
```

### Dependencies

```bash
# Update dependencies
uv sync

# Update lock file
uv lock
```

## Adding a New Implementation

To add a new repository to the catalog:

1. Create a new YAML file in `repositories/` following the existing pattern (see `repositories/odyssey.yaml` as reference)
2. Required fields: `name`, `repo_id`, `description`, `implementations`, `type`, `year`
3. Optional fields: `public_datasets`, `paper_url`, `bibtex`, `platform_url`, `github_url`
4. Run `python scripts/sync_repositories_to_docs.py` to update docs/index.md
5. The GitHub Actions workflow will automatically sync on push to main

## Important Implementation Details

### Synchronization System

The catalog uses an automated sync system where YAML files are the source of truth:
- Edits to YAML files in `repositories/` trigger automatic updates to `docs/index.md`
- GitHub Actions workflow (`sync_repos.yml`) runs on every push to main or PR
- The sync script (`sync_repositories_to_docs.py`) generates HTML cards with proper styling
- Never manually edit the implementation cards in `docs/index.md` - they will be overwritten

### YAML File Structure

Each YAML file must follow this schema:
```yaml
name: repository-name
repo_id: VectorInstitute/repository-name  # Used to construct GitHub URL
description: "Brief description"
implementations:  # List of algorithms/techniques
  - name: Algorithm Name
    url: https://optional-link.com  # Can be null
public_datasets:  # Optional
  - name: Dataset Name
    url: https://dataset-link.com
type: tool | bootcamp | applied-research  # Must be one of these
year: 2024
github_url: https://github.com/...  # Optional, overrides repo_id URL
paper_url: https://...  # Optional, adds "Paper" link
bibtex: citation-id  # Optional, references file in docs/bibtex/
platform_url: https://...  # Optional, adds "Open in Coder" button
```

### Type Classifications

- **tool**: Production-ready tools and libraries (e.g., CyclOps, Odyssey)
- **bootcamp**: Educational implementations and demos
- **applied-research**: Research implementations with published papers

### Pre-commit Hooks

The repository uses several pre-commit hooks:
- Ruff for formatting and linting
- Standard checks (trailing whitespace, YAML validation, etc.)
- uv lock check to ensure dependencies are in sync
- Typos checker for spelling

All hooks run automatically on commit and in CI.

## Technology Stack

- **Build tool**: uv (fast Python package manager)
- **Documentation**: MkDocs with Material theme
- **Linting/Formatting**: Ruff
- **CI/CD**: GitHub Actions
- **Python version**: 3.12+

## Common Workflows

### Making Changes to the Catalog

1. Edit or add YAML file in `repositories/`
2. Run `python scripts/sync_repositories_to_docs.py` to preview changes locally
3. Run `uv run mkdocs serve` to view the updated documentation
4. Commit both the YAML file and updated `docs/index.md`

### Testing Documentation Changes

```bash
# Serve docs with live reload
uv run mkdocs serve

# Build to check for errors
uv run mkdocs build --clean
```

### Updating Statistics

The catalog homepage displays dynamic statistics (total implementations, years of research) that are automatically calculated from the YAML files by the sync script.
