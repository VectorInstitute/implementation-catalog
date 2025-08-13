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
    <div class="stat-number">83</div>
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
        <h3><a href="https://github.com/VectorInstitute/atomgen" title="Go to Repository">atomgen</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">applied-research</span>
    </div>
    <p>Library for handling atomistic graph datasets focusing on transformer-based implementations, with utilities for training various models, experimenting with different pre-training tasks, and a suite of pre-trained models with huggingface integrations</p>
    <div class="tag-container">
        <span class="tag" data-tippy="AtomFormer">AtomFormer</span>          <a href="https://arxiv.org/abs/1706.08566" class="tag" target="_blank">SchNet</a>          <a href="https://github.com/jw9730/tokengt" class="tag" target="_blank">TokenGT</a>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <a href="https://huggingface.co/datasets/vector-institute/s2ef-15m" class="dataset-tag" target="_blank">S2EF Datasets</a>  <a href="https://huggingface.co/datasets/vector-institute/datasets" class="dataset-tag" target="_blank">Misc. Atomistic Graph Datasets</a>
    </div>

    </div>
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
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/kg-rag" title="Go to Repository">kg-rag</a></h3>
        <span class="tag year-tag">2025</span>
        <span class="tag type-tag">applied-research</span>
    </div>
    <p>A comprehensive framework for Knowledge Graph Retrieval Augmented Generation (KG-RAG).</p>
    <div class="tag-container">
        <a href="https://vectorinstitute.github.io/kg-rag/" class="tag" target="_blank">KG-RAG</a>          <a href="https://microsoft.github.io/graphrag/" class="tag" target="_blank">GraphRAG</a>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <a href="https://github.com/docugami/KG-RAG-datasets/blob/main/sec-10-q/README.md" class="dataset-tag" target="_blank">SEC 10-Q</a>
    </div>

    </div>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/pmc-data-extraction" title="Go to Repository">pmc-data-extraction</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">applied-research</span>
    </div>
    <p>A toolkit to download, augment, and benchmark Open-PMC data</p>
    <div class="tag-container">
        <a href="https://arxiv.org/abs/2503.14377" class="tag" target="_blank">PMC Data Extraction</a>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <a href="https://pmc.ncbi.nlm.nih.gov/" class="dataset-tag" target="_blank">PubMed Central</a>  <a href="https://huggingface.co/datasets/vector-institute/open-pmc" class="dataset-tag" target="_blank">HuggingFace PMC Dataset</a>
    </div>
    <div class="citation-links">
        <a href="#" class="bibtex-button" data-bibtex-id="baghbanzadeh2025advancing" title="View Citation">Cite</a>
        <a href="https://arxiv.org/abs/2503.14377" class="paper-link" title="View Paper" target="_blank">Paper</a>
    </div>
    </div>

    </div>

=== "bootcamp"

    <div class="grid cards" markdown>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/retrieval-augmented-generation" title="Go to Repository">retrieval-augmented-generation</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">bootcamp</span>
    </div>
    <p>A repository reference implementations for retrieval-augmented generation</p>
    <div class="tag-container">
        <span class="tag" data-tippy="Web Search">Web Search</span>          <span class="tag" data-tippy="Document Search">Document Search</span>          <span class="tag" data-tippy="SQL Search">SQL Search</span>          <span class="tag" data-tippy="Cloud Search">Cloud Search</span>          <span class="tag" data-tippy="PubMed QA">PubMed QA</span>          <span class="tag" data-tippy="RAG Evaluation">RAG Evaluation</span>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <a href="https://pubmed.ncbi.nlm.nih.gov" class="dataset-tag" target="_blank">PubMed</a>  <a href="https://www.kaggle.com/datasets/prakharrathi25/banking-dataset-marketing-targets" class="dataset-tag" target="_blank">Banking Dataset - Marketing Targets</a>
    </div>
    <div class="citation-links">
        <a href="https://89kc2habps6ig.pit-1.try.coder.app/templates/rag-bootcamp/" class="coder-button" title="Open in Coder" target="_blank">Open in Coder</a>
    </div>
    </div>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/ai-deployment" title="Go to Repository">ai-deployment</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">bootcamp</span>
    </div>
    <p>A repository with reference implementations for deploying AI models in production environments, focusing on best practices and cloud-native solutions.</p>
    <div class="tag-container">
        <a href="https://aws.amazon.com/" class="tag" target="_blank">AWS</a>          <a href="https://cloud.google.com/" class="tag" target="_blank">GCP</a>
    </div>


    </div>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/anomaly-detection" title="Go to Repository">anomaly-detection</a></h3>
        <span class="tag year-tag">2023</span>
        <span class="tag type-tag">bootcamp</span>
    </div>
    <p>A repository with implementation of anomaly detection techniques</p>
    <div class="tag-container">
        <span class="tag" data-tippy="Logistic Regression (Supervised)">Logistic Regression (Supervised)</span>          <span class="tag" data-tippy="Random Forest (Supervised)">Random Forest (Supervised)</span>          <span class="tag" data-tippy="XGBoost (Supervised)">XGBoost (Supervised)</span>          <span class="tag" data-tippy="CatBoost (Supervised)">CatBoost (Supervised)</span>          <span class="tag" data-tippy="Light GBM (Supervised)">Light GBM (Supervised)</span>          <span class="tag" data-tippy="TabNet (Supervised and Semi-supervised)">TabNet (Supervised and Semi-supervised)</span>          <span class="tag" data-tippy="Autoencoder (AE) (Unsupervised)">Autoencoder (AE) (Unsupervised)</span>          <span class="tag" data-tippy="Isolation Forest (Unsupervised)">Isolation Forest (Unsupervised)</span>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <a href="https://arxiv.org/pdf/2211.13358.pdf" class="dataset-tag" target="_blank">Bank Account Fraud Detection</a>  <a href="https://dgraph.xinye.com/dataset" class="dataset-tag" target="_blank">DGraph dataset</a>  <a href="https://www.mvtec.com/company/research/datasets/mvtec-ad" class="dataset-tag" target="_blank">MVTec dataset</a>  <a href="http://www.svcl.ucsd.edu/projects/anomaly/dataset.htm" class="dataset-tag" target="_blank">UCSD Anomaly Detection Dataset</a>  <a href="https://www.kaggle.com/datasets/odins0n/ucf-crime-dataset" class="dataset-tag" target="_blank">UCF Crime Dataset</a>
    </div>

    </div>
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
        <strong>Datasets:</strong> <a href="https://www.physionet.org/content/challenge-2012/1.0.0/" class="dataset-tag" target="_blank">Physionet Challenge 2012</a>  <a href="https://archive.ics.uci.edu/dataset/321/electricityloaddiagrams20112014" class="dataset-tag" target="_blank">Electricity dataset (UCI Machine Learning Repository)</a>
    </div>

    </div>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/finetuning-and-alignment" title="Go to Repository">finetuning-and-alignment</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">bootcamp</span>
    </div>
    <p>A repository with implementations advanced fine-tuning techniques and approaches to enhance Large Language Model performance, reduce their computational cost, with a focus on alignment with human values</p>
    <div class="tag-container">
        <a href="https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html" class="tag" target="_blank">FSDP</a>          <a href="https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html" class="tag" target="_blank">DDP</a>          <span class="tag" data-tippy="Instruction Tuning">Instruction Tuning</span>          <a href="https://github.com/huggingface/peft" class="tag" target="_blank">PEFT</a>          <span class="tag" data-tippy="Quantization">Quantization</span>          <span class="tag" data-tippy="Supervised Fine-tuning">Supervised Fine-tuning</span>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <a href="https://huggingface.co/datasets/knkarthick/samsum" class="dataset-tag" target="_blank">SAMSum dataset</a>  <a href="https://github.com/cardiffnlp/tweeteval" class="dataset-tag" target="_blank">TweetEval</a>
    </div>

    </div>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/interpretability" title="Go to Repository">interpretability</a></h3>
        <span class="tag year-tag">2025</span>
        <span class="tag type-tag">bootcamp</span>
    </div>
    <p>A repository providing reference implementations and resources for the 2025 Bootcamp on Interpretable and Explainable AI, covering both post-hoc explainability methods and interpretable models</p>
    <div class="tag-container">
        <a href="https://christophm.github.io/interpretable-ml-book/lime.html" class="tag" target="_blank">LIME</a>          <a href="https://arxiv.org/abs/1705.07874" class="tag" target="_blank">SHAP</a>          <a href="https://scikit-learn.org/stable/modules/partial_dependence.html" class="tag" target="_blank">PDP (Partial Dependence Plot)</a>          <a href="https://christophm.github.io/interpretable-ml-book/ale.html" class="tag" target="_blank">ALE (Accumulated Local Effects)</a>          <a href="https://www.tensorflow.org/tutorials/interpretability/integrated_gradients" class="tag" target="_blank">Integrated Gradients</a>          <a href="https://christophm.github.io/interpretable-ml-book/counterfactual.html" class="tag" target="_blank">Counterfactual Explanations</a>          <a href="https://en.wikipedia.org/wiki/Generalized_additive_model" class="tag" target="_blank">Generalized Additive Model</a>          <a href="https://arxiv.org/abs/2004.13912" class="tag" target="_blank">Neural Additive Model</a>          <a href="https://interpret.ml/docs/ebm.html" class="tag" target="_blank">Explainable Boosting Machine</a>          <a href="https://archive.ics.uci.edu/dataset/551/gas+turbine+co+and+nox+emission+data+set" class="tag" target="_blank">Gas turbine dataset</a>
    </div>


    </div>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/privacy-enhancing-techniques" title="Go to Repository">privacy-enhancing-techniques</a></h3>
        <span class="tag year-tag">2021</span>
        <span class="tag type-tag">bootcamp</span>
    </div>
    <p>A repository with implementations of privacy-enhancing techniques for machine learning</p>
    <div class="tag-container">
        <span class="tag" data-tippy="Differential Privacy (tensorflow_privacy)">Differential Privacy (tensorflow_privacy)</span>          <span class="tag" data-tippy="PATE">PATE</span>          <span class="tag" data-tippy="Membership Inference Attacks">Membership Inference Attacks</span>          <span class="tag" data-tippy="Horizontal Federated Learning">Horizontal Federated Learning</span>          <span class="tag" data-tippy="Vertical Federated Learning">Vertical Federated Learning</span>          <span class="tag" data-tippy="Homomorphic Encryption">Homomorphic Encryption</span>
    </div>


    </div>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/recommender-systems" title="Go to Repository">recommender-systems</a></h3>
        <span class="tag year-tag">2022</span>
        <span class="tag type-tag">bootcamp</span>
    </div>
    <p>A repository with implementations of recommender systems</p>
    <div class="tag-container">
        <span class="tag" data-tippy="Matrix Factorization">Matrix Factorization</span>          <span class="tag" data-tippy="Collaborative Filtering">Collaborative Filtering</span>          <span class="tag" data-tippy="Content-Based Filtering">Content-Based Filtering</span>          <span class="tag" data-tippy="Sequence Aware Recommender Systems">Sequence Aware Recommender Systems</span>          <span class="tag" data-tippy="Session-Based Recommender Systems">Session-Based Recommender Systems</span>          <span class="tag" data-tippy="Knowledge Graph-Based Recommender Systems">Knowledge Graph-Based Recommender Systems</span>
    </div>


    </div>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/self-supervised-learning" title="Go to Repository">self-supervised-learning</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">bootcamp</span>
    </div>
    <p>A repository with reference implementations of self-supervised learning techniques</p>
    <div class="tag-container">
        <a href="https://proceedings.mlr.press/v162/qiu22b/qiu22b.pdf" class="tag" target="_blank">Internal Contrastive Learning (ICL) + Latent Outlier Exposure (LOE)</a>          <a href="https://arxiv.org/abs/2302.00861" class="tag" target="_blank">SimMTM</a>          <a href="https://arxiv.org/abs/2303.15747" class="tag" target="_blank">TabRet</a>          <a href="https://arxiv.org/abs/2202.03555" class="tag" target="_blank">Data2Vec</a>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <a href="https://cs.stanford.edu/~acoates/stl10/" class="dataset-tag" target="_blank">STL-10</a>  <a href="https://archive.ics.uci.edu/dataset/381/beijing+pm2+5+data" class="dataset-tag" target="_blank">Beijing PM 2.5</a>
    </div>

    </div>

    </div>

=== "tool"

    <div class="grid cards" markdown>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/fed-rag" title="Go to Repository">fed-rag</a></h3>
        <span class="tag year-tag">2025</span>
        <span class="tag type-tag">tool</span>
    </div>
    <p>A framework for fine-tuning retrieval-augmented generation (RAG) systems.</p>
    <div class="tag-container">
        <span class="tag" data-tippy="Basic fine-tuning with FL">Basic fine-tuning with FL</span>          <a href="https://arxiv.org/abs/2310.01352" class="tag" target="_blank">RA-DIT</a>
    </div>


    </div>
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
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/mmlearn" title="Go to Repository">mmlearn</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">tool</span>
    </div>
    <p>A toolkit for research on multimodal representation learning</p>
    <div class="tag-container">
        <span class="tag" data-tippy="Contrastive Pretraining">Contrastive Pretraining</span>          <a href="https://arxiv.org/abs/2301.08243" class="tag" target="_blank">I-JEPA</a>
    </div>
    <div class="datasets">
        <strong>Datasets:</strong> <a href="https://www.image-net.org/" class="dataset-tag" target="_blank">ImageNet</a>  <a href="https://www.openslr.org/12/" class="dataset-tag" target="_blank">LibriSpeech</a>  <a href="https://rgbd.cs.princeton.edu/" class="dataset-tag" target="_blank">RGB-D</a>
    </div>

    </div>
    <div class="card" markdown>
    <div class="header">
        <h3><a href="https://github.com/VectorInstitute/vector-inference" title="Go to Repository">vector-inference</a></h3>
        <span class="tag year-tag">2024</span>
        <span class="tag type-tag">tool</span>
    </div>
    <p>Efficient LLM inference on Slurm clusters using vLLM.</p>
    <div class="tag-container">
        <!-- No tags available -->
    </div>


    </div>

    </div>
