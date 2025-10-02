#!/usr/bin/env node

/**
 * Generates individual HTML pages for each repository to enable proper Pagefind indexing.
 * Each page includes all searchable content (implementations, datasets) and redirects to the main page.
 */

const fs = require('fs');
const path = require('path');

// Read the repositories data
const dataPath = path.join(__dirname, '../public/data/repositories.json');
const repositoryData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Output directory for search pages
const outputDir = path.join(__dirname, '../out/repos');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get base path from environment
const basePath = process.env.NEXT_PUBLIC_BASE_PATH === 'true' ? '/implementation-catalog' : '';

// Generate a page for each repository
repositoryData.repositories.forEach((repo, index) => {
  const repoSlug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const repoDir = path.join(outputDir, repoSlug);

  // Create directory for this repo
  if (!fs.existsSync(repoDir)) {
    fs.mkdirSync(repoDir, { recursive: true });
  }

  // Get GitHub URL
  const githubUrl = repo.github_url || `https://github.com/${repo.repo_id}`;

  // Build implementations list
  const implementationsList = repo.implementations && repo.implementations.length > 0
    ? `
      <div class="implementations">
        <h3>Implementations</h3>
        <ul>
          ${repo.implementations.map(impl => `<li>${impl.name}</li>`).join('\n          ')}
        </ul>
      </div>
    `
    : '';

  // Build datasets list
  const datasetsList = repo.public_datasets && repo.public_datasets.length > 0
    ? `
      <div class="datasets">
        <h3>Datasets</h3>
        <ul>
          ${repo.public_datasets.map(dataset => `<li>${dataset.name}</li>`).join('\n          ')}
        </ul>
      </div>
    `
    : '';

  // Create HTML content
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${repo.name} - Vector Implementation Catalog</title>
  <meta name="description" content="${repo.description}">
  <meta http-equiv="refresh" content="0; url=${basePath}/#${repoSlug}">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 14px;
      margin: 5px 5px 5px 0;
    }
    .type-badge { background: #e0f2fe; color: #0369a1; }
    .year-badge { background: #f0fdf4; color: #15803d; }
    h1 { color: #111827; margin-bottom: 10px; }
    h3 { color: #374151; margin-top: 20px; }
    ul { list-style: none; padding: 0; }
    li {
      background: #f9fafb;
      padding: 8px 12px;
      margin: 5px 0;
      border-radius: 6px;
    }
    .description { color: #4b5563; margin: 20px 0; }
    .link { color: #0891b2; text-decoration: none; }
    .redirect-notice {
      background: #fef3c7;
      border: 1px solid #fbbf24;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body data-pagefind-body>
  <div class="redirect-notice">
    <strong>Redirecting...</strong> If you're not redirected, <a href="${basePath}/#${repoSlug}" class="link">click here</a>.
  </div>

  <article>
    <div>
      <span class="badge type-badge" data-pagefind-filter="type">${repo.type}</span>
      <span class="badge year-badge" data-pagefind-filter="year">${repo.year}</span>
    </div>

    <h1 data-pagefind-meta="title">${repo.name}</h1>

    <p class="description" data-pagefind-meta="description">${repo.description}</p>

    <p>
      <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="link">View on GitHub</a>
    </p>

    ${implementationsList}
    ${datasetsList}
  </article>

  <script>
    // Redirect to main page with hash
    window.location.href = '${basePath}/#${repoSlug}';
  </script>
</body>
</html>`;

  // Write the HTML file
  fs.writeFileSync(path.join(repoDir, 'index.html'), htmlContent);

  console.log(`Generated search page for: ${repo.name}`);
});

console.log(`\nSuccessfully generated ${repositoryData.repositories.length} search pages in ${outputDir}`);
