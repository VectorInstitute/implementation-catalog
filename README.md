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

## 📋 Repository Information

The catalog contains the following information for each implementation:
- **Repository**: Link to the Github repo
- **Description**: Brief introduction and links to published research papers
- **Algorithms**: ML algorithms and techniques demonstrated
- **Datasets**: Links to publicly available datasets
- **Type**: Classification (bootcamp, tool, or applied-research)
- **Year**: Publication year

| <div style="width:100px">Repository</div> | <div style="width:290px">Description</div> | <div style="width:150px">Algorithms</div>  | <div style="width:60px">No. of<br/>datasets</div> | <div style="width:120px">Public<br/>Datasets</div> | <div style="width:60px">Type</div> | <div style="width:60px">Year</div> |
| :--------- | :---------- | :--------- | :--------------------:| :-------: | :-------: | :--------: |
| [rag-bootcamp][rag-repo] | This repository contains demos for various Retrieval Augmented Generation techniques using different libraries. | Cloud search via LlamaHub, Document search via LangChain, LlamaIndex for OpenAI and Cohere models, Hybrid Search via Weaviate Vector Store, Evaluation via RAGAS library, Websearch via LangChain | 3 | [Vectors 2021 Annual Report], [PubMed Doc], [Banking Deposits] | bootcamp | 2024 |
| [finetuning-and-alignment][fa-repo] | This repository contains demos for finetuning techniques for LLMs focussed on reducing computational cost. | DDP, FSDP, Instruction Tuning, LoRA, DoRA, QLora, Supervised finetuning | 3 | [samsam], [imdb], [Bias-DeBiased] | bootcamp | 2024 |
| [Prompt Engineering Laboratory][pe-lab-repo] | This repository contains demos for various Prompt Engineering techniques, along with examples for Bias quantification, text classification. | Stereotypical Bias Analysis, Sentiment inference, Finetuning using HF Library, Activation Generation, Train and Test Model for Activations without Prompts, RAG, ABSA, Few shot prompting, Zero shot prompting (Stochastic, Greedy, Likelihood Estimation), Role play prompting, LLM Prompt Summarization, Zero shot and few shot prompt translation, Few shot CoT, Zero shot CoT, Self-Consistent CoT prompting (Zero shot, 5-shot), Balanced Choice of Plausible Alternatives, Bootstrap Ensembling(Generation & MC formulation), Vote Ensembling | 11 | [Crows-pairs][crow-pairs-pe-lab], [sst5][sst5-pe-lab], [czarnowska templates][czar-templ-pe-lab], [cnn_dailymail], [ag_news], [Weather and sports data], [Other] | bootcamp | 2024 |
| [bias-mitigation-unlearning][bmu-repo] | This repository contains code for the paper [Can Machine Unlearning Reduce Social Bias in Language Models?][bmu-paper] which was published at EMNLP'24 in the Industry track. <br>Authors are Omkar Dige, Diljot Arneja, Tsz Fung Yau, Qixuan Zhang, Mohammad Bolandraftar, Xiaodan Zhu, Faiza Khan Khattak. | PCGU, Task vectors and DPO for Machine Unlearning | 20 | [BBQ][bbq-bmu], [Stereoset][stereoset-bmu], [Link1][link1-bmu], [Link2][link2-bmu] | applied-research | 2024 |
| [cyclops-workshop][cyclops-repo] | This repository contains demos for using [CyclOps] package for clinical ML evaluation and monitoring. | XGBoost | 1 | [Diabetes 130-US hospitals dataset for years 1999-2008][diabetes-cyclops] | bootcamp | 2024 |
| [odyssey][odyssey-repo] | This is a library created with research done for the paper [EHRMamba: Towards Generalizable and Scalable Foundation Models for Electronic Health Records][odyssey-paper] published at ArXiv'24. <br>Authors are Adibvafa Fallahpour, Mahshid Alinoori, Wenqian Ye, Xu Cao, Arash Afkanpour, Amrit Krishnan. | EHRMamba, XGBoost, Bi-LSTM | 1 | [MIMIC-IV] | tool | 2024 |
| [diffusion-models][diffusion-repo] | This repository contains demos for various diffusion models for tabular and time series data. | TabDDPM, TabSyn, ClavaDDPM, CSDI, TSDiff | 12 | [Physionet Challenge 2012], [wiki2000] | bootcamp | 2024 |
| [News Media Bias][nmb-repo] | This repository contains code for libraries and experiments to recognise and evaluate bias and fakeness within news media articles via LLMs. | Bias evaluation via LLMs, finetuning and data annotation via LLM for fake news detection, Supervised finetuning for debiasing sentence, NER for biased phrases via LLMS, Evaluate using DeepEval library | 4 | [News Media Bias Full data][nmb-data], [Toxigen], [Nela GT], [Debiaser data] | bootcamp | 2024 |
| [News Media Bias Plus][nmb-plus-repo] | Continuation of News Media Bias project, this repository contains code for libraries and experiments to collect and annotate data, recognise and evaluate bias and fakeness within news media articles via LLMs and LVMs. | Bias evaluation via LLMs and VLMs, finetuning and data annotation via LLM for fake news detection, supervised finetuning for debiasing sentence, NER for biased entities via LLMS | 2 | [News Media Bias Plus Full Data][nmb-plus-full-data], [NMB Plus Named Entities][nmb-plus-entities] | bootcamp | 2024 |
| [Anomaly Detection Project][anomaly-repo] | This repository contains demos for various supervised and unsupervised anomaly detection techniques in domains such as Fraud Detection, Network Intrusion Detection, System Monitoring and image, Video Analysis. | AMNet, GCN, SAGE, OCGNN, DON, AdONE, MLP, FTTransformer, DeepSAD, XGBoost, CBLOF, CFA for Target-Oriented Anomaly Localization, Draem for surface anomaly detection, Logistic Regression, CATBoost, Random Forest, Diversity Measurable Anomaly Detection, Two-stream I3D Convolutional Network, DeepCNN, LightGBM, Isolation Forest, TabNet, AutoEncoder, Internal Contrastive Learning | 5 | [On Vector Cluster][cluster-anomaly] | bootcamp | 2023 |
| [SSL Bootcamp][ssl-repo] | This repository contains demos for self-supervised techniques such as contrastive learning, masked modeling and self distillation. | Internal Contrastive Learning, LatentOD-AD, TabRet, SimMTM, Data2Vec | 52 | [Beijing Air Quality][baq-ssl], [BRFSS][brfss-ssl], [Stroke Prediction][stroke-ssl], [STL10][stl-10-ssl], [Link1][Link1-ssl], [Link2][Link2-ssl] | bootcamp | 2023 |
| [Causal Inference Lab][ci-lab-repo] | This repository contains code to estimate the causal effects of an intervention on some measurable outcome primarily in the health domain. | Naive ATE, TARNet, DragonNet, Double Machine Learning, T Learner, S Learner, Inverse Propensity based Learner, PEHE, MAE | 5 | [Infant Health and Development Program][IHDP], [Jobs], [Twins], [Berkeley admission], [Government Census], [Compas] | bootcamp | 2023 |
| [HV-Ai-C][hvaic-repo] | This repository implements a Reinforcement Learning agent to optimize energy consumption within Data Centers. | RL agents performing Random action, Fixed action, Q Learning, Hyperspace Neighbor Penetration | - | <em>No public datasets available</em> | bootcamp | 2023 |
| [Flex Model][flex-model-repo] | This repository contains code for the paper [FlexModel: A Framework for Interpretability of Distributed Large Language Models][flex-model-paper]. <br> Authors are Matthew Choi, Muhammad Adil Asif, John Willes, David Emerson. | Distributed Interpretability | - | <em>No public datasets available</em> | bootcamp | 2023 |
| [VBLL][vbll-repo] | This repository contains code for the paper [Variational Bayesian Last Layers][vbll-paper]. <br> Authors are James Harrison, John Willes, Jasper Snoek. | Variational Bayesian Last Layers | 2 | [MNIST], [FashionMNIST] | bootcamp | 2023 |
| [Recommendation Systems][recsys-repo] | This repository contains demos for various RecSys techniques such as Collaborative Filtering, Knowledge Graph, RL based, Sequence Aware, Session based etc. | SVD++, NeuMF, Plot based, Two tower, SVD, KG based, SlateQ, BST, Simple Association Rules, first-order Markov Chains, Sequential Rules, RNN, Neural Attentive Session, BERT4rec, A2SVDModel, SLi-Rec | 7 | [Amazon-recsys], [careervillage], [movielens-recsys], [tmdb], [LastFM], [yoochoose] | bootcamp | 2022 |
| [Forecasting with Deep Learning][forecasting-dl-repo] | This repository contains demos for a variety of forecasting techniques for Univariate and Multivariate time series, spatiotemporal forecasting etc. | Exponential Smoothing, Persistence Forecasting, Mean Window Forecast, Prophet, Neuralphophet, NBeats, DeepAR, Autoformer, DLinear, NHITS | 11 | [Canadian Weather Station Data], [BoC Exchange rate], [Electricity Consumption], [Road Traffic Occupancy], [Influenza-Like Illness Patient Ratios], [Walmart M5 Retail Product Sales], [WeatherBench], [Grocery Store Sales], [Economic Data with Food CPI] | bootcamp | 2022 |
| [Prompt Engineering][pe-repo] | This repository contains demos for a variety of Prompt Engineering techniques such as fairness measurement via sentiment analysis, finetuning, prompt tuning, prompt ensembling etc. | Bias Quantification & Probing, Stereotypical Bias Analysis, Binary sentiment analysis task, Finetuning using HF Library, Gradient-Search for Instruction Prefix, GRIPS for Instruction Prefix, LLM Summarization, LLM Classification | 10 | [Crow-pairs], [sst5], [cnn_dailymail], [ag_news], [Tweet-data], [Other] | bootcamp | 2022 |
| [NAA][naa-repo] | This repository contains code for the paper [Bringing the State-of-the-Art to Customers: A Neural Agent Assistant Framework for Customer Service Support][naa-paper] published at EMNLP'22 in the industry track. <br> Authors are Stephen Obadinma, Faiza Khan Khattak, Shirley Wang, Tania Sidhorn, Elaine Lau, Sean Robertson, Jingcheng Niu, Winnie Au, Alif Munim, Karthik Raja Kalaiselvi Bhaskar. | Context Retrieval using SBERT bi-encoder, Context Retrieval using SBERT cross-encoder, Intent identification using BERT, Few Shot Multi-Class Text Classification with BERT, Multi-Class Text Classification with BERT, Response generation via GPT2 | 5 | [ELI5], [MSMARCO] | bootcamp | 2022 |
| [Privacy Enhancing Technologies][pet-repo] | This repository contains demos for Privacy, Homomorphic Encryption, Horizontal and Vertical Federated Learning, MIA, and PATE. | Vanilla SGD, DP SGD, DP Logistic Regression, Homomorphic Encryption for MLP, Horizontal FL, Horizontal FL on MLP, Membership Inference Attacks (MIA) using DP, MIA using SAM, PATE, Vertical FL | 9 | [Heart Disease], [Credit Card Fraud], [Breaset Cancer Data], [TCGA], [CIFAR10][cifar10-pet], [Home Credit Default Risk], [Yelp], [Airbnb] | bootcamp | 2021 |
| [SSGVQAP][ssgvap-repo] | This repository contains code for the paper [A Smart System to Generate and Validate Question Answer Pairs for COVID-19 Literature][ssgvap-paper] which was accepted in ACL'20. <br> Authors are Rohan Bhambhoria, Luna Feng, Dawn Sepehr, John Chen, Conner Cowling, Sedef Kocak, Elham Dolatabadi. | An Active Learning Strategy for Data Selection, AL-Uncertainty, AL-Clustering | 1 | [CORD-19] | bootcamp | 2021 |
| [foodprice-forecasting][fpf-repo] | This repository replicates the experiments described on pages 16 and 17 of the [2022 Edition of Canada's Food Price Report][fpf-paper]. | Time series forecasting using Prophet, Time series forecasting using Neural prophet, Interpretable time series forecasting using N-BEATS, Ensemble of the above methods | 3 | [FRED Economic Data] | bootcamp | 2021 |
| [Computer_Vision_Project][cvp-repo] | This repository tackles different problems such as defect detection, footprint extraction, road obstacle detection, traffic incident detection, and segmentation of medical procedures. | Semantic segmentation using Unet, Unet++, FCN, DeepLabv3, Anomaly segmentation | 11 | [SpaceNet Building Detection V2], [MVTEC], [ICDAR2015], [PASCAL_VOC], [DOTA], [AVA], [UCF101-24], [J-HMDB-21] | bootcamp | 2020 |

--------

>[!NOTE]
>- Many repositories contain code for reference purposes only. In order to run them, updates may be required to the code and environment files.
>- Links for only publicly available datasets are provided. Many datasets used in the repositories are only available on the the Vector cluster.


[//]: # (Reference links for Github repositories)
[cvp-repo]: https://github.com/VectorInstitute/Computer_Vision_Project
[pet-repo]: https://github.com/VectorInstitute/PETs-Bootcamp
[ssgvap-repo]: https://github.com/VectorInstitute/SSGVQAP
[fpf-repo]: https://github.com/VectorInstitute/foodprice-forecasting
[recsys-repo]: https://github.com/VectorInstitute/recommender_systems_project
[forecasting-dl-repo]: https://github.com/VectorInstitute/forecasting-with-dl
[pe-repo]: https://github.com/VectorInstitute/PromptEngineering
[fastgan-repo]: https://github.com/VectorInstitute/FastGAN-pytorch
[naa-repo]: https://github.com/VectorInstitute/NAA
[anomaly-repo]: https://github.com/VectorInstitute/anomaly-detection-project
[ssl-repo]: https://github.com/VectorInstitute/SSL-Bootcamp
[ci-lab-repo]: https://github.com/VectorInstitute/Causal_Inference_Laboratory
[covid-repo]: https://github.com/VectorInstitute/ProjectLongCovid-NER
[hvaic-repo]: https://github.com/VectorInstitute/HV-Ai-C
[flex-model-repo]: https://github.com/VectorInstitute/flex_model
[vbll-repo]: https://github.com/VectorInstitute/vbll
[rag-repo]: https://github.com/VectorInstitute/rag_bootcamp
[fa-repo]: https://github.com/VectorInstitute/finetuning-and-alignment
[pe-lab-repo]: https://github.com/VectorInstitute/PromptEngineeringLaboratory
[bmu-repo]: https://github.com/VectorInstitute/bias-mitigation-unlearning
[bmu-paper]: https://aclanthology.org/2024.emnlp-industry.71/
[cyclops-repo]: https://github.com/VectorInstitute/cyclops-workshop
[odyssey-repo]: https://github.com/VectorInstitute/odyssey
[nmb-repo]: https://github.com/VectorInstitute/news-media-bias
[diffusion-repo]: https://github.com/VectorInstitute/diffusion_model_bootcamp
[nmb-plus-repo]: https://github.com/VectorInstitute/news-media-bias-plus

[//]: # (Reference links for Research papers)
[ssgvap-paper]: https://aclanthology.org/2020.sdp-1.4/
[fpf-paper]: https://www.dal.ca/sites/agri-food/research/canada-s-food-price-report-2022.html
[naa-paper]: https://aclanthology.org/2022.emnlp-industry.44/
[flex-model-paper]: https://arxiv.org/abs/2312.03140
[vbll-paper]: https://arxiv.org/abs/2404.11599
[bmu-paper]: https://aclanthology.org/2024.emnlp-industry.71/
[odyssey-paper]: https://arxiv.org/pdf/2405.14567
[vilbias-paper]: https://arxiv.org/abs/2412.17052
[fact-or-fiction-paper]: https://arxiv.org/abs/2411.05775

[//]: # (Reference links for datasets)
[SpaceNet Building Detection V2]: https://spacenet.ai/spacenet-buildings-dataset-v2/
[MVTEC]: https://www.mvtec.com/company/research/datasets/mvtec-ad
[ICDAR2015]: https://drive.google.com/drive/folders/12eg7u7oBkZ6-ov3ITiED4nLlQzP4KoTd
[PASCAL_VOC]: https://drive.google.com/drive/folders/12eg7u7oBkZ6-ov3ITiED4nLlQzP4KoTd
[DOTA]: https://github.com/MoonBlvd/Detection-of-Traffic-Anomaly
[AVA]: https://github.com/cvdfoundation/ava-dataset
[UCF101-24]: https://drive.google.com/file/d/1o2l6nYhd-0DDXGP-IPReBP4y1ffVmGSE/view?usp=sharing
[J-HMDB-21]: http://jhmdb.is.tue.mpg.de/challenge/JHMDB/datasets
[Heart Disease]: https://www.kaggle.com/datasets/ronitf/heart-disease-uci
[Credit Card Fraud]: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud
[Breaset Cancer Data]: https://github.com/VectorInstitute/PETs-Bootcamp/blob/main/HE_TenSEAL/breast_cancer_data.csv
[TCGA]: https://vectorinstituteai-my.sharepoint.com/personal/sedef_kocak_vectorinstituteai_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fsedef%5Fkocak%5Fvectorinstituteai%5Fonmicrosoft%5Fcom%2FDocuments%2FPETS%5FProject%5FParticipants%2FExample%20Datasets%2FKidney%20Histopathology&ga=1
[cifar10-pet]: https://www.tensorflow.org/api_docs/python/tf/keras/datasets/cifar10
[Home Credit Default Risk]: https://www.kaggle.com/c/home-credit-default-risk/overview
[Yelp]: https://business.yelp.com/data/resources/open-dataset/
[Airbnb]: https://insideairbnb.com/get-the-data/
[CORD-19]: https://www.kaggle.com/datasets/allen-institute-for-ai/CORD-19-research-challenge
[FRED Economic Data]: https://fred.stlouisfed.org/
[Amazon-recsys]: https://drive.google.com/drive/folders/1w9ofYRBZN5XIb8M-UzbU3Wp4H1ZBYOFi?usp=drive_link
[careervillage]: https://drive.google.com/drive/folders/1rNeBtNYM7Z0oHVho75PDEP3VZIXAoxx9?usp=drive_link
[movielens-recsys]: https://drive.google.com/drive/folders/112OtYq83WZgVqV43pGhKZjVTzlUhKM-b?usp=drive_link
[tmdb]: https://drive.google.com/drive/folders/1CU863OynVNnNTTduKxExubCyJLCZPF0R?usp=drive_link
[LastFM]: https://drive.google.com/drive/folders/1Jftz1_olxblJVZe6ZDMdrclAW_YnCOci?usp=drive_link
[yoochoose]: https://drive.google.com/drive/folders/1XNyPH8i-pxnNbJKjZZRCL1oz-HPZscLC?usp=drive_link
[Canadian Weather Station Data]: https://drive.google.com/drive/folders/1YeOoJNf7VCy7r3sFhdTrl7WdevcUIZNW
[BoC Exchange rate]: https://drive.google.com/drive/folders/1Z9pnC0kPN-c_eAHSsPyWPYRnnGR3sEuf
[Electricity Consumption]: https://drive.google.com/drive/folders/1YIl6RHAQ5muZEjFjXLj7Zt4vOwKUu2Qe
[Road Traffic Occupancy]: https://drive.google.com/drive/folders/1YDM-mMGuhlE_pTlwb5qoPcOQfspJ4m4W
[Influenza-Like Illness Patient Ratios]: https://drive.google.com/drive/folders/1YFoC3fWY-22S11MtfKHnl_R8OminZ2eo
[Walmart M5 Retail Product Sales]: https://drive.google.com/drive/folders/1bc488T1GsJ3xg2nQmuFTut7uF1SFDSp2
[WeatherBench]:https://drive.google.com/drive/folders/1YD-Hadx_T4JZcjmvFYDp4Pb71852CIVT
[Grocery Store Sales]: https://drive.google.com/drive/folders/1as_cJgJbzw1OlnWyF8Y3xj7ZEjRh_kD6
[Economic Data with Food CPI]: https://drive.google.com/drive/folders/1cNyHR5DpUQ5RORgDS8pB8iswWo-iBLFI
[Crow-pairs]: https://github.com/VectorInstitute/PromptEngineering/blob/main/src/reference_implementations/fairness_measurement/crow_s_pairs/resources/crows_pairs_anonymized.csv
[sst5]: http://github.com/VectorInstitute/PromptEngineering/blob/main/src/reference_implementations/fairness_measurement/czarnowska_analysis/resources/processed_sst5.tsv
[Tweet-data]: https://github.com/VectorInstitute/PromptEngineering/tree/main/resources/datasets
[Other]: https://github.com/VectorInstitute/PromptEngineering/tree/main/src/reference_implementations/prompting_vector_llms/llm_prompting_examples/resources
[ELI5]: https://drive.google.com/drive/folders/1PDBiij-6JSxOtplOSc0hPTk9zL9n3qR6
[MSMARCO]: https://drive.google.com/drive/folders/1LO3OtuDC_FSFktTgb2NfjPY2cse7WcTY
[cluster-anomaly]: https://github.com/VectorInstitute/anomaly-detection-project/tree/main?tab=readme-ov-file#datasets
[baq-ssl]: https://zenodo.org/records/3902671
[brfss-ssl]: https://www.cdc.gov/brfss/
[stroke-ssl]: https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset
[stl-10-ssl]: https://cs.stanford.edu/~acoates/stl10/
[Link1-ssl]: https://github.com/VectorInstitute/SSL-Bootcamp/tree/main/contrastive_learning/ICL/datasets/Classical
[Link2-ssl]: https://github.com/VectorInstitute/SSL-Bootcamp/tree/main/contrastive_learning/LatentOE/DATA
[IHDP]: https://github.com/VectorInstitute/Causal_Inference_Laboratory/tree/main/data/IHDP-100
[Jobs]: https://github.com/VectorInstitute/Causal_Inference_Laboratory/tree/main/data/Jobs
[Twins]: https://github.com/VectorInstitute/Causal_Inference_Laboratory/tree/main/data/TWINS
[Berkeley admission]: https://github.com/VectorInstitute/Causal_Inference_Laboratory/tree/main/data/CFA
[Government Census]: https://github.com/VectorInstitute/Causal_Inference_Laboratory/tree/main/data/CFA
[Compas]: https://github.com/VectorInstitute/Causal_Inference_Laboratory/tree/main/data/CFA
[MNIST]: https://huggingface.co/datasets/ylecun/mnist
[FashionMNIST]: https://huggingface.co/datasets/zalando-datasets/fashion_mnist
[Vectors 2021 Annual Report]: https://github.com/VectorInstitute/rag_bootcamp/tree/main/cloud_search/source_documents
[PubMed Doc]: https://github.com/VectorInstitute/rag_bootcamp/tree/main/pubmed_qa/data/pubmed_doc
[Banking Deposits]: https://github.com/VectorInstitute/rag_bootcamp/tree/main/sql_search
[samsam]: https://huggingface.co/datasets/Samsung/samsum
[imdb]: https://github.com/VectorInstitute/finetuning-and-alignment/tree/main/data/imdb
[Bias-DeBiased]: https://github.com/VectorInstitute/finetuning-and-alignment/tree/main/data
[crow-pairs-pe-lab]: https://github.com/VectorInstitute/PromptEngineeringLaboratory/tree/main/src/reference_implementations/fairness_measurement/crow_s_pairs/resources
[sst5-pe-lab]: https://github.com/VectorInstitute/PromptEngineeringLaboratory/tree/main/src/reference_implementations/fairness_measurement/czarnowska_analysis/resources
[czar-templ-pe-lab]: https://github.com/VectorInstitute/PromptEngineeringLaboratory/tree/main/src/reference_implementations/fairness_measurement/resources/czarnowska_templates
[Weather and sports data]: https://github.com/VectorInstitute/PromptEngineeringLaboratory/tree/main/src/reference_implementations/prompting_vector_llms/llm_basic_rag_example/resources
[link1-bmu]: https://github.com/VectorInstitute/bias-mitigation-unlearning/tree/main/reddit_bias/data
[bbq-bmu]: https://github.com/nyu-mll/BBQ/tree/main/data
[stereoset-bmu]: https://github.com/moinnadeem/StereoSet/tree/master/data
[link2-bmu]: https://github.com/VectorInstitute/bias-mitigation-unlearning/tree/main/task_vectors/src/datasets
[diabetes-cyclops]: https://archive.ics.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008
[MIMIC-IV]: https://physionet.org/content/mimiciv/2.0/
[nmb-data]: https://huggingface.co/datasets/newsmediabias/news-bias-full-data
[Toxigen]: https://github.com/VectorInstitute/news-media-bias/blob/main/Evaluations/toxigen_eval/
[Nela GT]: https://dataverse.harvard.edu/file.xhtml?fileId=6078140&version=2.0
[Debiaser data]: https://github.com/VectorInstitute/news-media-bias/tree/main/UnBIAS-Debiaser%20library/datasets
[Physionet Challenge 2012]: https://physionet.org/files/challenge-2012/1.0.0/set-a.tar.gz?download
[wiki2000]: https://github.com/awslabs/gluonts/raw/b89f203595183340651411a41eeb0ee60570a4d9/datasets/wiki2000_nips.tar.gz
[nmb-plus-full-data]: https://huggingface.co/datasets/vector-institute/newsmediabias-plus
[nmb-plus-entities]: https://huggingface.co/datasets/vector-institute/NMB-Plus-Named-Entities

[//]: # (Miscellaneous reference links)

[CyclOps]: https://github.com/VectorInstitute/cyclops
