export interface Implementation {
  name: string;
  url?: string | null;
}

export interface Dataset {
  name: string;
  url?: string | null;
}

export type RepositoryType = "tool" | "bootcamp" | "applied-research";

export interface Repository {
  name: string;
  repo_id: string;
  description: string;
  implementations: Implementation[];
  public_datasets?: Dataset[];
  type: RepositoryType;
  year: number;
  github_url?: string;
  paper_url?: string;
  bibtex?: string;
  platform_url?: string;
}

export interface RepositoryData {
  repositories: Repository[];
  totalImplementations: number;
  yearsOfResearch: number;
  lastUpdated: string;
}
