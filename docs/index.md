---
hide:
  - navigation
  - toc
---

<script src="javascripts/bibtex.js"></script>

<!-- Hero section with background image -->
<div class="hero-section" markdown>
  <div class="hero-content">
    <h1></h1>
    <p>A curated collection of high-quality AI implementations developed by researchers and engineers at the Vector Institute</p>
    <a href="#browse-implementations-by-type" class="md-button md-button--primary">Browse Implementations</a>
    <a href="https://github.com/VectorInstitute/reference-implementation-catalog" class="md-button md-button--primary">View on GitHub</a>
  </div>
</div>

<!-- Custom styling for the hero section -->





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
  text-decoration: none;
  transition: background-color 0.2s;
}

a.dataset-tag:hover {
  background-color: #5449b3;
  text-decoration: none;
  color: white;
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
  margin-top: 0.4rem;
  display: flex;
  gap: 0.5rem;
}

.citation-links a {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.35rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 500;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;
  height: 1.2rem;
  line-height: 1;
}

.citation-links a:hover {
  background-color: #e0e0e0;
  text-decoration: none;
}

/* BibTeX Modal Styles */
.bibtex-modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.bibtex-modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 800px;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.bibtex-close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.bibtex-close:hover,
.bibtex-close:focus {
  color: black;
  text-decoration: none;
}

#bibtex-content {
  background-color: #f8f8f8;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  color: #333;
  line-height: 1.4;
}

.bibtex-copy-btn {
  background-color: #48c0d9;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.bibtex-copy-btn:hover {
  background-color: #36a0b9;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.bibtex-copy-btn.copied {
  background-color: #2d8d76;
}

.bibtex-copy-btn::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'%3E%3C/path%3E%3Crect x='8' y='2' width='8' height='4' rx='1' ry='1'%3E%3C/rect%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}
</style>









<style>
.catalog-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
}

.stat {
  text-align: center;
  background-color: rgba(72, 192, 217, 0.2);
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  font-weight: 500;
}
</style>

<div class="catalog-stats">
  <div class="stat">
    <div class="stat-number">25</div>
    <div class="stat-label">Implementations</div>
  </div>
  <div class="stat">
    <div class="stat-number">7</div>
    <div class="stat-label">Years of Research</div>
  </div>
</div>

































## Browse Implementations by Type

=== "applied-research"

    <div class="grid cards" markdown>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/bias-mitigation-unlearning" title="Go to Repository">bias-mitigation-unlearning</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">applied-research</span>
    </div>
    <p>A repository for social bias mitigation in LLMs using machine unlearning</p>
    <div class="tag-container">
        <a href="https://aclanthology.org/2024.emnlp-industry.71/" class="tag" target="_blank">Negation via Task Vectors</a>          <a href="https://aclanthology.org/2024.emnlp-industry.71/" class="tag" target="_blank">PCGU</a>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <a href="https://github.com/nyu-mll/BBQ/tree/main/data" class="dataset-tag" target="_blank">BBQ</a>  <a href="https://github.com/moinnadeem/StereoSet/tree/master/data" class="dataset-tag" target="_blank">Stereoset</a>  <a href="https://github.com/VectorInstitute/bias-mitigation-unlearning/tree/main/reddit_bias/data" class="dataset-tag" target="_blank">RedditBias</a>
    </div>
    <div class="citation-links">
        <a href="#" class="bibtex-button" data-bibtex-id="dige2024can" title="View Citation">Cite</a>
        <a href="https://aclanthology.org/2024.emnlp-industry.71/" class="paper-link" title="View Paper" target="_blank">Paper</a>
    </div>
    </div>

    </div>

=== "bootcamp"

    <div class="grid cards" markdown>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/diffusion_models" title="Go to Repository">diffusion-models</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">bootcamp</span>
    </div>
    <p>A repository with demos for various diffusion models for tabular and time series data</p>
    <div class="tag-container">
        <span class="tag" data-tippy="TabDDPM">TabDDPM</span>          <span class="tag" data-tippy="TabSyn">TabSyn</span>          <a href="https://arxiv.org/abs/2405.17724" class="tag" target="_blank">ClavaDDPM</a>          <span class="tag" data-tippy="CSDI">CSDI</span>          <a href="https://arxiv.org/abs/2307.11494" class="tag" target="_blank">TSDiff</a>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <span class="dataset-tag">Physionet Challenge 2012</span>  <span class="dataset-tag">wiki2000</span>
    </div>

    </div>

    </div>

=== "tool"

    <div class="grid cards" markdown>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/fl4health" title="Go to Repository">fl4health</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">tool</span>
    </div>
    <p>A flexible, modular, and easy to use library to facilitate federated learning research and development in healthcare settings</p>
    <div class="tag-container">
        <a href="https://arxiv.org/abs/1602.05629" class="tag" target="_blank">FedAvg</a>          <a href="https://arxiv.org/abs/2003.00295" class="tag" target="_blank">FedOpt</a>          <a href="https://arxiv.org/abs/1812.06127" class="tag" target="_blank">FedProx</a>          <a href="https://arxiv.org/abs/1910.06378" class="tag" target="_blank">SCAFFOLD</a>          <a href="https://arxiv.org/abs/2103.16257" class="tag" target="_blank">MOON</a>          <a href="https://arxiv.org/abs/2103.06030" class="tag" target="_blank">FedDG-GA</a>          <a href="https://proceedings.mlr.press/v202/panchal23a/panchal23a.pdf" class="tag" target="_blank">FLASH</a>          <a href="https://arxiv.org/pdf/2209.15328" class="tag" target="_blank">FedPM</a>          <a href="https://arxiv.org/abs/2205.13692" class="tag" target="_blank">Personal FL</a>          <a href="https://arxiv.org/abs/2102.07623" class="tag" target="_blank">FedBN</a>          <a href="https://arxiv.org/abs/1912.00818" class="tag" target="_blank">FedPer</a>          <a href="https://arxiv.org/abs/2303.05206" class="tag" target="_blank">FedRep</a>          <a href="https://arxiv.org/abs/2012.04221" class="tag" target="_blank">Ditto</a>          <a href="https://arxiv.org/abs/2206.07902" class="tag" target="_blank">MR-MTL</a>          <a href="https://arxiv.org/abs/2003.13461" class="tag" target="_blank">APFL</a>          <a href="https://ieeexplore.ieee.org/document/10020518/" class="tag" target="_blank">PerFCL</a>          <a href="https://arxiv.org/pdf/2309.16825.pdf" class="tag" target="_blank">FENDA-FL</a>          <span class="tag" data-tippy="FENDA+Ditto">FENDA+Ditto</span>
    </div>


    </div>

    </div>

