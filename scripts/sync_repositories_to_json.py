#!/usr/bin/env python3
"""Sync repos from YAML files to JSON for Next.js consumption.

This script reads repository information from YAML files in the repositories/ directory
and generates a JSON file that the Next.js static site can consume at build time.
"""

import datetime
import json
from pathlib import Path
from typing import Any, Dict, List

import yaml


def calculate_years_of_research() -> int:
    """Calculate the years of research since 2019.

    Returns
    -------
    int
        The number of years since 2019 (inclusive).

    """
    current_year = datetime.datetime.now().year
    start_year = 2019
    return current_year - start_year + 1


def count_total_implementations(repositories: List[Dict[str, Any]]) -> int:
    """Count the total number of algorithm implementations across all repositories.

    Parameters
    ----------
    repositories : List[Dict[str, Any]]
        List of repository dictionaries.

    Returns
    -------
    int
        The total count of all algorithm implementations.

    """
    total_count = 0
    for repo in repositories:
        if "implementations" in repo and repo["implementations"]:
            total_count += len(repo["implementations"])
    return total_count


def parse_yaml_repositories() -> List[Dict[str, Any]]:
    """Parse the implementations from YAML files in repositories/ directory.

    Returns
    -------
    List[Dict[str, Any]]
        List of repository dictionaries.

    """
    repos_dir = Path("repositories")
    if not repos_dir.exists():
        raise FileNotFoundError(
            f"repositories/ directory not found at {repos_dir.absolute()}"
        )

    # Find all YAML files in the repositories directory
    yaml_files = list(repos_dir.glob("*.yaml")) + list(repos_dir.glob("*.yml"))

    if not yaml_files:
        raise FileNotFoundError(f"No YAML files found in {repos_dir.absolute()}")

    # Extract repository information from each YAML file
    repositories = []

    for yaml_file in yaml_files:
        with open(yaml_file, "r", encoding="utf-8") as f:
            repo_data = yaml.safe_load(f)

        # Ensure required fields exist
        if not all(
            key in repo_data
            for key in ["name", "repo_id", "description", "type", "year"]
        ):
            print(f"Warning: Skipping {yaml_file} - missing required fields")
            continue

        repositories.append(repo_data)

    return repositories


def generate_json_data(repositories: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate the complete JSON data structure.

    Parameters
    ----------
    repositories : List[Dict[str, Any]]
        List of repository dictionaries.

    Returns
    -------
    Dict[str, Any]
        Complete data structure for JSON export.

    """
    total_implementations = count_total_implementations(repositories)
    years_of_research = calculate_years_of_research()

    # Sort repositories by year (descending) and then by name
    sorted_repositories = sorted(repositories, key=lambda x: (-x["year"], x["name"]))

    return {
        "repositories": sorted_repositories,
        "totalImplementations": total_implementations,
        "yearsOfResearch": years_of_research,
        "lastUpdated": datetime.datetime.now().isoformat(),
    }


def write_json_file(data: Dict[str, Any], output_path: Path) -> None:
    """Write the data to a JSON file.

    Parameters
    ----------
    data : Dict[str, Any]
        The data to write.
    output_path : Path
        Path to the output JSON file.

    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(
        f"Successfully wrote {len(data['repositories'])} repositories to {output_path}"
    )
    print(f"Total implementations: {data['totalImplementations']}")
    print(f"Years of research: {data['yearsOfResearch']}")


def main() -> None:
    """Run main function to sync YAML repositories to JSON.

    This function orchestrates the entire synchronization process from YAML files to JSON.
    """
    print("Syncing implementations from YAML files to JSON...")

    repositories = parse_yaml_repositories()

    if not repositories:
        print("No repositories found in YAML files. Nothing to update.")
        return

    print(f"Found {len(repositories)} repositories")

    data = generate_json_data(repositories)

    # Write to catalog/public/data/repositories.json
    output_path = Path("catalog/public/data/repositories.json")
    write_json_file(data, output_path)

    print("Sync complete!")


if __name__ == "__main__":
    main()
