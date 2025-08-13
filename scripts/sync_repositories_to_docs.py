#!/usr/bin/env python3
"""Sync repos from YAML files to docs/index.md.

This script reads repository information from YAML files in the repositories/ directory
and updates the cards in docs/index.md. It automatically groups implementations
by type and ensures changes in YAML files are reflected in the documentation.
"""

import datetime
import re
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Tuple

import yaml

TYPE_TAB_PATTERN = re.compile(r'=== "([^"]*)"')
BROWSE_HEADING_PATTERN = r"## Browse Implementations by Type"
# Pattern to match Markdown links [text][reference]
MARKDOWN_LINK_PATTERN = re.compile(r"\[(.*?)\]\[(.*?)\]")
# Pattern to match simple Markdown links [text]
SIMPLE_MARKDOWN_LINK_PATTERN = re.compile(r"\[(.*?)\]")


def format_tags(items_list, tag_class) -> str:
    """Format items into tags with links when URLs are available.

    Parameters
    ----------
    items_list : List
        List of item names or objects with name/url fields from YAML file
    tag_class : str
        CSS class to apply to the tags

    Returns
    -------
    str
        Formatted HTML with tags

    """
    if not items_list:
        # Returning an empty string is intentional to avoid rendering unnecessary UI elements
        return ""

    # Create tags for each item in the list
    formatted_text = ""
    for item in items_list:
        # Handle both string items and dict items with name/url fields
        if isinstance(item, dict) and "name" in item:
            item_name = item["name"].strip()
            item_url = item.get("url", "")

            if item_url:
                formatted_text += f'<a href="{item_url}" class="{tag_class}" target="_blank">{item_name}</a>  '
            else:
                formatted_text += f'<span class="{tag_class}">{item_name}</span>  '
        else:
            item_text = str(item).strip()
            if item_text:
                formatted_text += f'<span class="{tag_class}">{item_text}</span>  '

    # Add a final check to ensure no broken spans
    if "<span" in formatted_text and formatted_text.count(
        "<span"
    ) != formatted_text.count("</span"):
        # Try to repair broken spans
        formatted_text = re.sub(
            r"<span([^>]*?)>([^<]*?)(?!<\/span>)(\s|$)",
            r"<span\1>\2</span>\3",
            formatted_text,
        )

    return formatted_text.rstrip()


def format_datasets(datasets_list) -> str:
    """Format dataset text into a nicer representation.

    Parameters
    ----------
    datasets_list : List
        List of dataset names or dataset objects from YAML file

    Returns
    -------
    str
        Formatted dataset HTML

    """
    return format_tags(datasets_list, "dataset-tag")


def count_total_implementations(implementations_by_type: Dict[str, List[Dict]]) -> int:
    """Count the total number of algorithm implementations across all repositories.

    Parameters
    ----------
    implementations_by_type : Dict[str, List[Dict]]
        Dictionary with types as keys and lists of implementation details as values.

    Returns
    -------
    int
        The total count of all algorithm implementations.

    """
    total_count = 0
    for _impl_type, implementations in implementations_by_type.items():
        for impl in implementations:
            # Count the implementations
            if "implementations" in impl and impl["implementations"]:
                total_count += len(impl["implementations"])

    return total_count


def calculate_years_of_research() -> int:
    """Calculate the years of research since 2019.

    Returns
    -------
    int
        The number of years since 2019 (inclusive).

    """
    current_year = datetime.datetime.now().year
    start_year = 2019
    return current_year - start_year + 1  # +1 to include the start year


def parse_yaml_repositories() -> Dict[str, List[Dict]]:
    """Parse the implementations from YAML files in repositories/ directory.

    Returns
    -------
    Dict[str, List[Dict]]
        Dictionary with types as keys and lists of implementation details as values.

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
    implementations_by_type = defaultdict(list)

    for yaml_file in yaml_files:
        with open(yaml_file, "r", encoding="utf-8") as f:
            repo_data = yaml.safe_load(f)

        # Add the repository to the appropriate type list
        implementations_by_type[repo_data["type"]].append(repo_data)

    return implementations_by_type


def _generate_implementation_tags(implementations: list) -> str:
    """Generate HTML tags for implementations."""
    tag_html = ""

    for impl_ in implementations:
        if isinstance(impl_, dict) and "name" in impl_:
            impl_name = impl_["name"].strip()
            impl_url = impl_.get("url", "")

            if impl_url:
                tag_html += f'        <a href="{impl_url}" class="tag" target="_blank">{impl_name}</a>  '
            else:
                tag_html += f'        <span class="tag" data-tippy="{impl_name}">{impl_name}</span>  '
        else:
            impl_text = str(impl_).strip()
            if impl_text:
                tag_html += f'        <span class="tag" data-tippy="{impl_text}">{impl_text}</span>  '

    return tag_html


def _get_repository_url(impl: Dict) -> str:
    """Get repository URL from implementation data."""
    if "github_url" in impl:
        return impl["github_url"]

    repo_id = impl["repo_id"]
    return f"https://github.com/{repo_id}"


def _generate_citation_links(impl: Dict) -> str:
    """Generate citation links HTML."""
    links = []

    if "bibtex" in impl:
        bibtex_id = impl["bibtex"]
        links.append(
            f'<a href="#" class="bibtex-button" data-bibtex-id="{bibtex_id}" title="View Citation">Cite</a>'
        )

    if "paper_url" in impl:
        paper_url = impl["paper_url"]
        links.append(
            f'<a href="{paper_url}" class="paper-link" title="View Paper" target="_blank">Paper</a>'
        )

    if "platform_url" in impl:
        platform_url = impl["platform_url"]
        links.append(
            f'<a href="{platform_url}" class="coder-button" title="Open in Coder" target="_blank">Open in Coder</a>'
        )

    if links:
        links_content = "\n        ".join(links)
        return f"""    <div class="citation-links">
        {links_content}
    </div>"""

    return ""


def _generate_datasets_html(formatted_datasets: str) -> str:
    """Generate datasets section HTML."""
    if formatted_datasets:
        return f"""    <div class="datasets">
        <strong>Datasets:</strong> {formatted_datasets}
    </div>"""
    return ""


def generate_card_html(impl: Dict) -> str:
    """Generate HTML for a single implementation card.

    Parameters
    ----------
    impl : Dict
        Dictionary containing implementation details

    Returns
    -------
    str
        HTML string for the implementation card

    """
    implementations = impl.get("implementations", [])
    tag_html = _generate_implementation_tags(implementations)

    formatted_datasets = format_datasets(impl.get("public_datasets", []))
    repo_url = _get_repository_url(impl)
    citation_html = _generate_citation_links(impl)
    datasets_html = _generate_datasets_html(formatted_datasets)

    return f"""    <div class="card" markdown>
    <div class="header">
        <h3><a href="{repo_url}" title="Go to Repository">{impl["name"]}</a></h3>
        <span class="tag year-tag">{impl["year"]}</span>
        <span class="tag type-tag">{impl["type"]}</span>
    </div>
    <p>{impl["description"]}</p>
    <div class="tag-container">
{tag_html.rstrip() if tag_html else "        <!-- No tags available -->"}
    </div>
{datasets_html}
{citation_html if citation_html else ""}
    </div>
"""


def get_type_sections(content: str) -> Dict[str, Tuple[int, int, str]]:
    """Extract type sections from the markdown content.

    Parameters
    ----------
    content : str
        The markdown content

    Returns
    -------
    Dict[str, Tuple[int, int, str]]
        Dictionary mapping types to their (start_pos, end_pos, section_content)

    """
    type_sections = {}
    type_matches = list(TYPE_TAB_PATTERN.finditer(content))

    for i, match in enumerate(type_matches):
        type_value = match.group(1)
        section_start = match.start()

        # Find the end of this section
        if i + 1 < len(type_matches):
            section_end = type_matches[i + 1].start()
        else:
            section_end = len(content)

        section_content = content[section_start:section_end]
        type_sections[type_value] = (section_start, section_end, section_content)

    return type_sections


def generate_type_section(type_value: str, implementations: List[Dict]) -> str:
    """Generate a complete type section with all implementations.

    Parameters
    ----------
    type_value : str
        The type for this section
    implementations : List[Dict]
        List of implementation details

    Returns
    -------
    str
        Formatted type section

    """

    # Sort implementations to prioritize "retrieval-augmented-generation" first
    def sort_key(impl):
        if impl.get("name") == "retrieval-augmented-generation":
            return (0, impl.get("name", ""))
        return (1, impl.get("name", ""))

    sorted_implementations = sorted(implementations, key=sort_key)

    section = f'=== "{type_value}"\n\n    <div class="grid cards" markdown>\n'

    for impl in sorted_implementations:
        section += generate_card_html(impl)

    section += "\n    </div>\n\n"
    return section


def rebuild_document(
    original_content: str, implementations_by_type: Dict[str, List[Dict]]
) -> str:
    """Completely rebuild the document with all type sections.

    Parameters
    ----------
    original_content : str
        The original markdown content
    implementations_by_type : Dict[str, List[Dict]]
        Dictionary with implementations grouped by type

    Returns
    -------
    str
        Updated markdown content

    """
    # Split the document into parts
    # 1. Find where the front matter ends (this is used later)
    # 2. Find the heading position
    heading_match = re.search(BROWSE_HEADING_PATTERN, original_content)
    if not heading_match:
        raise ValueError("Could not find 'Browse Implementations by Type' heading")

    heading_start = heading_match.start()

    # 3. Get content before the heading (includes front matter, scripts, hero, style, and stats)
    pre_heading_content = original_content[:heading_start]

    # 4. Build the new content with proper structure
    new_content = pre_heading_content + "\n\n## Browse Implementations by Type\n\n"

    # Define the desired type order
    type_order = ["applied-research", "bootcamp", "tool"]

    # Add sections in the specified order, followed by any other types alphabetically
    for type_value in type_order:
        if type_value in implementations_by_type:
            new_content += generate_type_section(
                type_value, implementations_by_type[type_value]
            )

    # Add any remaining types that weren't in the predefined order
    for type_value in sorted(
        [t for t in implementations_by_type if t not in type_order]
    ):
        new_content += generate_type_section(
            type_value, implementations_by_type[type_value]
        )

    return new_content


def update_docs_index(implementations_by_type: Dict[str, List[Dict]]) -> None:
    """Update the docs/index.md file with cards for all implementations.

    Parameters
    ----------
    implementations_by_type : Dict[str, List[Dict]]
        Dictionary of implementations grouped by type

    """
    docs_index_path = Path("docs/index.md")
    if not docs_index_path.exists():
        raise FileNotFoundError(
            f"docs/index.md not found at {docs_index_path.absolute()}"
        )

    original_content = docs_index_path.read_text(encoding="utf-8")

    # Ensure we have CSS for dataset tags, type tags, year tags, and hero section
    css_for_tags = """
<style>
.hero-section {
  position: relative;
  padding: 5rem 4rem;
  text-align: center;
  color: white;
  background-color: var(--md-primary-fg-color);
  background-image: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('assets/splash.png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  width: 100%;
  position: relative;
  min-height: 70vh;
}

.hero-content {
  max-width: 800px;
  z-index: 10;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.7);
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #ffffff;
  font-family: 'Roboto', sans-serif;
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 0 2px 6px rgba(0,0,0,0.7);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;
  color: #f8f8f8;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
}

.card {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12) !important;
  border-left: 3px solid var(--md-accent-fg-color) !important;
  background-image: linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(72, 192, 217, 0.05)) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-left: 3px solid #48c0d9 !important;
}

.dataset-tag {
  display: inline-block;
  background-color: #6a5acd;
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: 0.8rem;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.type-tag {
  display: inline-block;
  background-color: #2e8b57;
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: 0.8rem;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.year-tag {
  background-color: #48c0d9; /* Vector teal accent color */
  color: white;
  float: right;
  font-weight: 600;
}

.citation-links {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.75rem;
}

.citation-links a {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 0.8rem;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;
}

.citation-links a:hover {
  background-color: #e0e0e0;
}

.coder-button {
  display: inline-block;
  background-color: #007ACC !important;
  color: white !important;
  padding: 0.15rem 0.4rem !important;
  border-radius: 3px !important;
  font-size: 0.6rem !important;
  font-weight: 500 !important;
  text-decoration: none !important;
  border: 1px solid #007ACC !important;
  transition: all 0.2s ease !important;
}

.coder-button:hover {
  background-color: #005a9e !important;
  border-color: #005a9e !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}
</style>
"""

    # Check if the CSS is already in the document and replace it
    if "<style>" in original_content:
        # Find and replace existing style block with updated CSS
        style_start = original_content.find("<style>")
        style_end = original_content.find("</style>") + len("</style>")
        if style_start != -1 and style_end != -1:
            original_content = (
                original_content[:style_start]
                + css_for_tags.strip()
                + original_content[style_end:]
            )
    else:
        # Add the CSS at the beginning of the document, after the front matter
        front_matter_end = original_content.find("---", 5) + 3  # Find the second "---"
        if front_matter_end > 3:
            original_content = (
                original_content[:front_matter_end]
                + "\n"
                + css_for_tags
                + original_content[front_matter_end:]
            )

    # Update the heading from "by Year" to "by Type"
    original_content = original_content.replace(
        "## Browse Implementations by Year", "## Browse Implementations by Type"
    )

    # Update the statistics section with dynamic values
    total_implementations = count_total_implementations(implementations_by_type)
    years_of_research = calculate_years_of_research()

    # Update the statistics section
    stats_pattern = r'<div class="catalog-stats">.*?<div class="stat-number">.*?</div>.*?<div class="stat-number">.*?</div>.*?</div>(?:\s*</div>\s*</div>)*'
    stats_replacement = f"""<div class="catalog-stats">
  <div class="stat">
    <div class="stat-number">{total_implementations}</div>
    <div class="stat-label">Implementations</div>
  </div>
  <div class="stat">
    <div class="stat-number">{years_of_research}</div>
    <div class="stat-label">Years of Research</div>
  </div>
</div>"""

    # Make sure we only replace the exact catalog-stats div, not any nested divs
    original_content = re.sub(
        stats_pattern, stats_replacement, original_content, flags=re.DOTALL, count=1
    )

    # Create an entirely new document
    updated_content = rebuild_document(original_content, implementations_by_type)

    # Write the updated content back to docs/index.md
    docs_index_path.write_text(updated_content, encoding="utf-8")

    # Get existing and new types for reporting
    existing_sections = set(get_type_sections(original_content).keys())
    new_types = set(implementations_by_type.keys()) - existing_sections

    # Print summary
    print(
        f"Updated {docs_index_path} with {sum(len(impls) for impls in implementations_by_type.values())} repositories and {total_implementations} total implementations"
    )
    if new_types:
        print(
            f"Added {len(new_types)} new type sections: {', '.join(sorted(new_types))}"
        )


def main() -> None:
    """Run main function to sync YAML repositories to docs/index.md.

    This function orchestrates the entire synchronization process from YAML files to docs/index.md.
    """
    print("Syncing implementations from YAML files to docs/index.md...")
    implementations_by_type = parse_yaml_repositories()

    if not implementations_by_type:
        print("No repositories found in YAML files. Nothing to update.")
        return

    total_count = sum(len(impls) for impls in implementations_by_type.values())
    print(
        f"Found {total_count} repositories across {len(implementations_by_type)} types"
    )

    update_docs_index(implementations_by_type)
    print("Sync complete!")


if __name__ == "__main__":
    main()
