#!/usr/bin/env python3
"""Collect GitHub metrics for repositories in the catalog.

This script reads repository information from YAML files in the repositories/ directory,
fetches metrics from the GitHub API, and stores historical data in a JSON file.
"""

import datetime
import json
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List

import yaml


def run_gh_command(args: List[str]) -> Dict[str, Any] | None:
    """Run a GitHub CLI command and return parsed JSON output.

    Parameters
    ----------
    args : List[str]
        Command arguments to pass to gh.

    Returns
    -------
    Dict[str, Any] | None
        Parsed JSON response, or None if command fails.

    """
    try:
        result = subprocess.run(
            ["gh"] + args,
            capture_output=True,
            text=True,
            check=True,
        )
        return json.loads(result.stdout) if result.stdout else None
    except subprocess.CalledProcessError as e:
        print(f"Error running gh command: {e.stderr}", file=sys.stderr)
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}", file=sys.stderr)
        return None


def check_gh_installed() -> bool:
    """Check if GitHub CLI is installed and authenticated.

    Returns
    -------
    bool
        True if gh is installed and authenticated, False otherwise.

    """
    try:
        subprocess.run(
            ["gh", "auth", "status"],
            capture_output=True,
            check=True,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def get_template_repos() -> List[str]:
    """Discover template repositories in VectorInstitute org via GitHub API.

    Returns
    -------
    List[str]
        List of template repository IDs matching aieng-template-* pattern.

    """
    print("Discovering template repositories...")

    try:
        # Query GitHub API for all VectorInstitute repos
        result = subprocess.run(
            [
                "gh",
                "api",
                "orgs/VectorInstitute/repos",
                "--paginate",
                "--jq",
                '.[] | select(.name | startswith("aieng-template-")) | .full_name',
            ],
            capture_output=True,
            text=True,
            check=True,
        )

        if not result.stdout:
            print("Warning: No template repos found", file=sys.stderr)
            return []

        # Parse the result - one repo per line
        template_repos = [
            repo.strip() for repo in result.stdout.strip().split("\n") if repo.strip()
        ]

        print(f"Found {len(template_repos)} template repositories")
        return template_repos

    except subprocess.CalledProcessError as e:
        print(
            f"Warning: Could not fetch template repos from GitHub API: {e.stderr}",
            file=sys.stderr,
        )
        return []
    except Exception as e:
        print(f"Warning: Error discovering template repos: {e}", file=sys.stderr)
        return []


def get_repo_ids_from_yaml() -> List[str]:
    """Extract repo_id values from YAML files in repositories/ directory.

    Returns
    -------
    List[str]
        List of repository IDs (e.g., "VectorInstitute/cyclops").

    """
    repos_dir = Path("repositories")
    if not repos_dir.exists():
        raise FileNotFoundError(
            f"repositories/ directory not found at {repos_dir.absolute()}"
        )

    yaml_files = list(repos_dir.glob("*.yaml")) + list(repos_dir.glob("*.yml"))

    if not yaml_files:
        raise FileNotFoundError(f"No YAML files found in {repos_dir.absolute()}")

    repo_ids = []
    for yaml_file in yaml_files:
        with open(yaml_file, "r", encoding="utf-8") as f:
            repo_data = yaml.safe_load(f)

        if "repo_id" in repo_data:
            repo_ids.append(repo_data["repo_id"])
        else:
            print(f"Warning: {yaml_file.name} missing 'repo_id' field", file=sys.stderr)

    return repo_ids


def fetch_repo_metrics(repo_id: str) -> Dict[str, Any]:
    """Fetch metrics for a single repository from GitHub API.

    Parameters
    ----------
    repo_id : str
        Repository ID in format "owner/repo".

    Returns
    -------
    Dict[str, Any]
        Dictionary containing repository metrics.

    """
    print(f"Fetching metrics for {repo_id}...")

    metrics = {
        "repo_id": repo_id,
        "name": repo_id.split("/")[-1],
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "stars": 0,
        "forks": 0,
        "watchers": 0,
        "open_issues": 0,
        "size": 0,
        "views_14d": None,
        "unique_visitors_14d": None,
        "clones_14d": None,
        "unique_cloners_14d": None,
        "language": None,
        "created_at": None,
        "updated_at": None,
        "topics": [],
    }

    # Fetch basic repository info
    repo_data = run_gh_command(["api", f"repos/{repo_id}"])
    if repo_data:
        metrics.update(
            {
                "stars": repo_data.get("stargazers_count", 0),
                "forks": repo_data.get("forks_count", 0),
                "watchers": repo_data.get("subscribers_count", 0),
                "open_issues": repo_data.get("open_issues_count", 0),
                "size": repo_data.get("size", 0),
                "language": repo_data.get("language"),
                "created_at": repo_data.get("created_at"),
                "updated_at": repo_data.get("updated_at"),
                "topics": repo_data.get("topics", []),
            }
        )

    # Fetch traffic data (views)
    # Note: This requires push access to the repository
    traffic_views = run_gh_command(["api", f"repos/{repo_id}/traffic/views"])
    if traffic_views:
        metrics["views_14d"] = traffic_views.get("count")
        metrics["unique_visitors_14d"] = traffic_views.get("uniques")

    # Fetch traffic data (clones)
    traffic_clones = run_gh_command(["api", f"repos/{repo_id}/traffic/clones"])
    if traffic_clones:
        metrics["clones_14d"] = traffic_clones.get("count")
        metrics["unique_cloners_14d"] = traffic_clones.get("uniques")

    return metrics


def load_historical_data(data_path: Path) -> Dict[str, Any]:
    """Load existing historical metrics data.

    Parameters
    ----------
    data_path : Path
        Path to the historical data JSON file.

    Returns
    -------
    Dict[str, Any]
        Historical data dictionary.

    """
    if data_path.exists():
        with open(data_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"repos": {}, "last_updated": None}


def update_historical_data(
    historical_data: Dict[str, Any], metrics: Dict[str, Any]
) -> Dict[str, Any]:
    """Update historical data with new metrics.

    Parameters
    ----------
    historical_data : Dict[str, Any]
        Existing historical data.
    metrics : Dict[str, Any]
        New metrics to add.

    Returns
    -------
    Dict[str, Any]
        Updated historical data.

    """
    repo_id = metrics["repo_id"]

    if repo_id not in historical_data["repos"]:
        historical_data["repos"][repo_id] = {"name": metrics["name"], "snapshots": []}

    # Add new snapshot (keep last 400 data points, ~2 years of weekly data)
    historical_data["repos"][repo_id]["snapshots"].append(metrics)
    historical_data["repos"][repo_id]["snapshots"] = historical_data["repos"][repo_id][
        "snapshots"
    ][-400:]

    historical_data["last_updated"] = metrics["timestamp"]

    return historical_data


def save_metrics_data(
    metrics_list: List[Dict[str, Any]], historical_data: Dict[str, Any]
) -> None:
    """Save metrics data to JSON files.

    Parameters
    ----------
    metrics_list : List[Dict[str, Any]]
        List of current metrics for all repos.
    historical_data : Dict[str, Any]
        Historical data with all snapshots.

    """
    # Save current metrics (latest snapshot)
    current_metrics_path = Path("catalog/public/data/github_metrics.json")
    current_metrics_path.parent.mkdir(parents=True, exist_ok=True)

    current_data = {
        "repos": {m["repo_id"]: m for m in metrics_list},
        "last_updated": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }

    with open(current_metrics_path, "w", encoding="utf-8") as f:
        json.dump(current_data, f, indent=2, ensure_ascii=False)

    print(f"✓ Saved current metrics to {current_metrics_path}")

    # Save historical data
    historical_path = Path("catalog/public/data/github_metrics_history.json")
    with open(historical_path, "w", encoding="utf-8") as f:
        json.dump(historical_data, f, indent=2, ensure_ascii=False)

    print(f"✓ Saved historical data to {historical_path}")


def print_header() -> None:
    """Print collection banner."""
    print("=" * 70)
    print("Vector Institute Implementation Catalog - GitHub Metrics Collection")
    print("=" * 70)
    print()


def validate_prerequisites() -> None:
    """Validate that required tools are available."""
    if not check_gh_installed():
        print("ERROR: GitHub CLI (gh) is not installed or not authenticated.")
        print("Please install gh and run 'gh auth login' first.")
        sys.exit(1)


def setup_environment() -> tuple[list[str], Path, dict[str, Any]]:
    """Set up directories and load configuration.

    Returns
    -------
    tuple
        Repository IDs, output directory path, and historical data.

    """
    print("Reading repository configurations...")
    repo_ids = get_repo_ids_from_yaml()

    if not repo_ids:
        print("ERROR: No repository IDs found in YAML files.")
        sys.exit(1)

    print(f"Found {len(repo_ids)} catalog repositories")

    # Also get template repositories
    template_repos = get_template_repos()

    # Combine both lists, avoiding duplicates
    all_repo_ids = list(set(repo_ids + template_repos))

    print(f"Total repositories to track: {len(all_repo_ids)}")
    print(f"  - Catalog repos: {len(repo_ids)}")
    print(f"  - Template repos: {len(template_repos)}\n")

    output_dir = Path("catalog/public/data")
    output_dir.mkdir(parents=True, exist_ok=True)

    historical_path = output_dir / "github_metrics_history.json"
    historical_data = load_historical_data(historical_path)
    print(
        f"Loaded historical data (tracking {len(historical_data.get('repos', {}))} repos)\n"
    )

    return all_repo_ids, output_dir, historical_data


def collect_all_metrics(
    repo_ids: list[str], historical_data: dict[str, Any]
) -> tuple[list[dict[str, Any]], list[str], dict[str, Any]]:
    """Collect metrics for all repositories.

    Parameters
    ----------
    repo_ids : list[str]
        List of repository IDs to collect.
    historical_data : dict[str, Any]
        Existing historical metrics data.

    Returns
    -------
    tuple
        Metrics list, failed repos list, and updated historical data.

    """
    metrics_list = []
    failed_repos = []

    for repo_id in repo_ids:
        try:
            metrics = fetch_repo_metrics(repo_id)
            metrics_list.append(metrics)

            historical_data = update_historical_data(historical_data, metrics)

            print(
                f"  ⭐ {metrics['stars']} | "
                f"🍴 {metrics['forks']} | "
                f"👁️  {metrics['views_14d'] or 'N/A'}\n"
            )
        except Exception as e:
            print(f"  ✗ Failed: {e}\n", file=sys.stderr)
            failed_repos.append(repo_id)

    if not metrics_list:
        print("ERROR: Failed to collect metrics for any repository.")
        sys.exit(1)

    return metrics_list, failed_repos, historical_data


def validate_output_files(output_dir: Path) -> None:
    """Validate that output files were created successfully.

    Parameters
    ----------
    output_dir : Path
        Directory containing output files.

    """
    current_metrics_path = output_dir / "github_metrics.json"
    historical_path = output_dir / "github_metrics_history.json"

    if not current_metrics_path.exists():
        print("ERROR: Failed to create github_metrics.json")
        sys.exit(1)
    if not historical_path.exists():
        print("ERROR: Failed to create github_metrics_history.json")
        sys.exit(1)


def print_summary(metrics_list: list[dict[str, Any]], failed_repos: list[str]) -> None:
    """Print collection summary.

    Parameters
    ----------
    metrics_list : list[dict[str, Any]]
        List of successfully collected metrics.
    failed_repos : list[str]
        List of repository IDs that failed.

    """
    print()
    print("=" * 70)
    print("✓ Metrics collection complete!")
    print("=" * 70)
    print(f"Successfully collected: {len(metrics_list)} repositories")
    if failed_repos:
        print(f"Failed: {len(failed_repos)} repositories")
        print(f"  Failed repos: {', '.join(failed_repos)}")
    print()


def main() -> None:
    """Collect GitHub metrics for all catalog repositories.

    This function orchestrates the metrics collection process.
    """
    print_header()

    try:
        validate_prerequisites()
        repo_ids, output_dir, historical_data = setup_environment()
        metrics_list, failed_repos, historical_data = collect_all_metrics(
            repo_ids, historical_data
        )

        print("Saving metrics data...")
        save_metrics_data(metrics_list, historical_data)

        validate_output_files(output_dir)
        print_summary(metrics_list, failed_repos)

        sys.exit(0)

    except KeyboardInterrupt:
        print("\n\nCollection interrupted by user.")
        sys.exit(130)
    except Exception as e:
        print(f"\n\nFATAL ERROR: {e}", file=sys.stderr)
        import traceback

        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
