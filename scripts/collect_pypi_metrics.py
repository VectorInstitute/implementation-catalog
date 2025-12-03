#!/usr/bin/env python3
"""Collect PyPI metrics for packages in the catalog.

This script reads repository information from YAML files in the repositories/ directory,
fetches download statistics from the PyPI Stats API for packages with a package_name field,
and stores historical data in a JSON file.
"""

import datetime
import json
import sys
import time
from pathlib import Path
from typing import Any

import requests
import yaml


def get_packages_from_yaml() -> list[dict[str, str]]:
    """Extract package information from YAML files with package_name field.

    Returns
    -------
    list[dict[str, str]]
        List of dictionaries containing repo_id, name, package_name, and type.

    """
    repos_dir = Path("repositories")
    if not repos_dir.exists():
        msg = f"repositories/ directory not found at {repos_dir.absolute()}"
        raise FileNotFoundError(msg)

    yaml_files = list(repos_dir.glob("*.yaml")) + list(repos_dir.glob("*.yml"))

    if not yaml_files:
        msg = f"No YAML files found in {repos_dir.absolute()}"
        raise FileNotFoundError(msg)

    packages = []
    for yaml_file in yaml_files:
        with open(yaml_file, encoding="utf-8") as f:
            repo_data = yaml.safe_load(f)

        # Include repos with package_name field from tools, bootcamps, and applied-research
        repo_type = repo_data.get("type")
        if "package_name" in repo_data and repo_type in [
            "tool",
            "bootcamp",
            "applied-research",
        ]:
            packages.append(
                {
                    "repo_id": repo_data["repo_id"],
                    "name": repo_data["name"],
                    "package_name": repo_data["package_name"],
                    "type": repo_type,
                }
            )

    return packages


def fetch_pypi_stats(package_name: str) -> dict[str, Any] | None:
    """Fetch download statistics from PyPI Stats API (without mirrors).

    Parameters
    ----------
    package_name : str
        Name of the PyPI package.

    Returns
    -------
    dict[str, Any] | None
        Dictionary containing download statistics, or None if request fails.

    """
    try:
        # Fetch overall download stats without mirrors
        # This gives us raw time-series data which is more accurate than the
        # aggregate "recent" endpoint that includes mirrors
        url_overall = f"https://pypistats.org/api/packages/{package_name}/overall"
        response_overall = requests.get(url_overall, timeout=10)
        response_overall.raise_for_status()
        overall_data = response_overall.json()

        return {"overall": overall_data}

    except requests.exceptions.RequestException as e:
        print(f"  ✗ Error fetching PyPI stats for {package_name}: {e}", file=sys.stderr)
        return None


def calculate_recent_downloads(
    overall_data: dict[str, Any],
) -> tuple[int | None, int | None, int | None]:
    """Calculate recent download stats from overall time-series data (without mirrors).

    Parameters
    ----------
    overall_data : dict[str, Any]
        Overall download data from PyPI Stats API.

    Returns
    -------
    tuple[int | None, int | None, int | None]
        Downloads for last day, last week, last month (without mirrors).

    """
    from datetime import datetime, timedelta

    if not overall_data or "data" not in overall_data:
        return None, None, None

    # Filter to only "without_mirrors" category
    without_mirrors = [
        d for d in overall_data["data"] if d["category"] == "without_mirrors"
    ]

    if not without_mirrors:
        return None, None, None

    today = datetime.now().date()
    yesterday = today - timedelta(days=1)

    # Calculate downloads for different time periods
    # For "last day", look at yesterday (most recent complete day)
    # This avoids issues with incomplete data for the current day
    last_1_day = sum(
        d["downloads"]
        for d in without_mirrors
        if datetime.strptime(d["date"], "%Y-%m-%d").date() == yesterday
    )
    last_7_days = sum(
        d["downloads"]
        for d in without_mirrors
        if (today - datetime.strptime(d["date"], "%Y-%m-%d").date()).days <= 7
    )
    last_30_days = sum(
        d["downloads"]
        for d in without_mirrors
        if (today - datetime.strptime(d["date"], "%Y-%m-%d").date()).days <= 30
    )

    return (
        last_1_day if last_1_day > 0 else None,
        last_7_days if last_7_days > 0 else None,
        last_30_days if last_30_days > 0 else None,
    )


def fetch_package_metadata(package_name: str) -> dict[str, Any] | None:
    """Fetch package metadata from PyPI API.

    Parameters
    ----------
    package_name : str
        Name of the PyPI package.

    Returns
    -------
    dict[str, Any] | None
        Dictionary containing package metadata, or None if request fails.

    """
    try:
        url = f"https://pypi.org/pypi/{package_name}/json"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"  ✗ Error fetching metadata for {package_name}: {e}", file=sys.stderr)
        return None


def fetch_package_metrics(package_info: dict[str, str]) -> dict[str, Any]:
    """Fetch metrics for a single PyPI package.

    Parameters
    ----------
    package_info : dict[str, str]
        Dictionary containing repo_id, name, package_name, and type.

    Returns
    -------
    dict[str, Any]
        Dictionary containing package metrics.

    """
    package_name = package_info["package_name"]
    print(f"Fetching metrics for {package_name}...")

    metrics = {
        "repo_id": package_info["repo_id"],
        "name": package_info["name"],
        "package_name": package_name,
        "type": package_info["type"],
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "downloads_last_day": None,
        "downloads_last_week": None,
        "downloads_last_month": None,
        "total_downloads": None,
        "version": None,
        "release_date": None,
    }

    # Fetch download statistics (without mirrors)
    stats = fetch_pypi_stats(package_name)
    if stats and "overall" in stats:
        # Calculate recent downloads from time-series data (without mirrors)
        last_day, last_week, last_month = calculate_recent_downloads(stats["overall"])
        metrics["downloads_last_day"] = last_day
        metrics["downloads_last_week"] = last_week
        metrics["downloads_last_month"] = last_month

        # Calculate total downloads (without mirrors only)
        overall_data = stats["overall"].get("data", [])
        without_mirrors = [
            d for d in overall_data if d["category"] == "without_mirrors"
        ]
        total = sum(item.get("downloads", 0) for item in without_mirrors)
        metrics["total_downloads"] = total if total > 0 else None

    # Fetch package metadata
    metadata = fetch_package_metadata(package_name)
    if metadata and "info" in metadata:
        info = metadata["info"]
        metrics["version"] = info.get("version")

        # Get latest release date from releases
        if "releases" in metadata and metrics["version"]:
            releases = metadata["releases"].get(metrics["version"], [])
            if releases and len(releases) > 0:
                metrics["release_date"] = releases[0].get("upload_time")

    return metrics


def load_historical_data(data_path: Path) -> dict[str, Any]:
    """Load existing historical PyPI metrics data.

    Parameters
    ----------
    data_path : Path
        Path to the historical data JSON file.

    Returns
    -------
    dict[str, Any]
        Historical data dictionary.

    """
    if data_path.exists():
        with open(data_path, encoding="utf-8") as f:
            return json.load(f)
    return {"packages": {}, "last_updated": None}


def update_historical_data(
    historical_data: dict[str, Any], metrics: dict[str, Any]
) -> dict[str, Any]:
    """Update historical data with new metrics.

    Parameters
    ----------
    historical_data : dict[str, Any]
        Existing historical data.
    metrics : dict[str, Any]
        New metrics to add.

    Returns
    -------
    dict[str, Any]
        Updated historical data.

    """
    package_name = metrics["package_name"]

    if package_name not in historical_data["packages"]:
        historical_data["packages"][package_name] = {
            "name": metrics["name"],
            "repo_id": metrics["repo_id"],
            "type": metrics["type"],
            "snapshots": [],
        }
    else:
        # Update type in case it changed
        historical_data["packages"][package_name]["type"] = metrics["type"]

    # Add new snapshot (keep last 400 data points, ~2 years of weekly data)
    historical_data["packages"][package_name]["snapshots"].append(metrics)
    historical_data["packages"][package_name]["snapshots"] = historical_data[
        "packages"
    ][package_name]["snapshots"][-400:]

    historical_data["last_updated"] = metrics["timestamp"]

    return historical_data


def save_metrics_data(
    metrics_list: list[dict[str, Any]], historical_data: dict[str, Any]
) -> None:
    """Save PyPI metrics data to JSON files.

    Parameters
    ----------
    metrics_list : list[dict[str, Any]]
        List of current metrics for all packages.
    historical_data : dict[str, Any]
        Historical data with all snapshots.

    """
    # Save current metrics (latest snapshot)
    current_metrics_path = Path("catalog/public/data/pypi_metrics.json")
    current_metrics_path.parent.mkdir(parents=True, exist_ok=True)

    current_data = {
        "packages": {m["package_name"]: m for m in metrics_list},
        "last_updated": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }

    with open(current_metrics_path, "w", encoding="utf-8") as f:
        json.dump(current_data, f, indent=2, ensure_ascii=False)

    print(f"✓ Saved current metrics to {current_metrics_path}")

    # Save historical data
    historical_path = Path("catalog/public/data/pypi_metrics_history.json")
    with open(historical_path, "w", encoding="utf-8") as f:
        json.dump(historical_data, f, indent=2, ensure_ascii=False)

    print(f"✓ Saved historical data to {historical_path}")


def print_header() -> None:
    """Print collection banner."""
    print("=" * 70)
    print("Vector Institute Implementation Catalog - PyPI Metrics Collection")
    print("=" * 70)
    print()


def setup_environment() -> tuple[list[dict[str, str]], Path, dict[str, Any]]:
    """Set up directories and load configuration.

    Returns
    -------
    tuple
        Package info list, output directory path, and historical data.

    """
    print("Reading repository configurations...")
    packages = get_packages_from_yaml()

    if not packages:
        print("No packages with package_name field found in YAML files.")
        print("This is expected if no tools have PyPI packages yet.")
        return [], Path("catalog/public/data"), {"packages": {}, "last_updated": None}

    print(f"Found {len(packages)} packages to track\n")

    output_dir = Path("catalog/public/data")
    output_dir.mkdir(parents=True, exist_ok=True)

    historical_path = output_dir / "pypi_metrics_history.json"
    historical_data = load_historical_data(historical_path)
    print(
        f"Loaded historical data (tracking {len(historical_data.get('packages', {}))} packages)\n"
    )

    return packages, output_dir, historical_data


def collect_all_metrics(
    packages: list[dict[str, str]], historical_data: dict[str, Any]
) -> tuple[list[dict[str, Any]], list[str], dict[str, Any]]:
    """Collect metrics for all packages.

    Parameters
    ----------
    packages : list[dict[str, str]]
        List of package information to collect.
    historical_data : dict[str, Any]
        Existing historical metrics data.

    Returns
    -------
    tuple
        Metrics list, failed packages list, and updated historical data.

    """
    metrics_list = []
    failed_packages = []

    for package_info in packages:
        try:
            metrics = fetch_package_metrics(package_info)
            metrics_list.append(metrics)

            historical_data = update_historical_data(historical_data, metrics)

            print(
                f"  📦 v{metrics['version'] or 'N/A'} | "
                f"↓ Last day: {metrics['downloads_last_day'] or 'N/A'} | "
                f"Last week: {metrics['downloads_last_week'] or 'N/A'} | "
                f"Last month: {metrics['downloads_last_month'] or 'N/A'}\n"
            )

            # Be nice to the API
            time.sleep(1)

        except Exception as e:
            print(f"  ✗ Failed: {e}\n", file=sys.stderr)
            failed_packages.append(package_info["package_name"])

    return metrics_list, failed_packages, historical_data


def validate_output_files(output_dir: Path) -> None:
    """Validate that output files were created successfully.

    Parameters
    ----------
    output_dir : Path
        Directory containing output files.

    """
    current_metrics_path = output_dir / "pypi_metrics.json"
    historical_path = output_dir / "pypi_metrics_history.json"

    if not current_metrics_path.exists():
        print("ERROR: Failed to create pypi_metrics.json")
        sys.exit(1)
    if not historical_path.exists():
        print("ERROR: Failed to create pypi_metrics_history.json")
        sys.exit(1)


def print_summary(
    metrics_list: list[dict[str, Any]], failed_packages: list[str]
) -> None:
    """Print collection summary.

    Parameters
    ----------
    metrics_list : list[dict[str, Any]]
        List of successfully collected metrics.
    failed_packages : list[str]
        List of package names that failed.

    """
    print()
    print("=" * 70)
    print("✓ PyPI metrics collection complete!")
    print("=" * 70)
    print(f"Successfully collected: {len(metrics_list)} packages")
    if failed_packages:
        print(f"Failed: {len(failed_packages)} packages")
        print(f"  Failed packages: {', '.join(failed_packages)}")
    print()


def main() -> None:
    """Collect PyPI metrics for all catalog packages.

    This function orchestrates the PyPI metrics collection process.
    """
    print_header()

    try:
        packages, output_dir, historical_data = setup_environment()

        if not packages:
            # Create empty JSON files so the frontend doesn't break
            save_metrics_data([], historical_data)
            print("✓ Created empty PyPI metrics files (no packages to track)")
            sys.exit(0)

        metrics_list, failed_packages, historical_data = collect_all_metrics(
            packages, historical_data
        )

        if not metrics_list:
            print("WARNING: Failed to collect metrics for any package.")
            # Still create empty files
            save_metrics_data([], historical_data)
            sys.exit(0)

        print("Saving metrics data...")
        save_metrics_data(metrics_list, historical_data)

        validate_output_files(output_dir)
        print_summary(metrics_list, failed_packages)

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
