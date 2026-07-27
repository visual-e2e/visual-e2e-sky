export type ToolCatalogPackage = {
  filename: string;
  url: string;
  size: number;
  sha256?: string;
};

export type ToolAuthor = {
  name: string;
  avatar?: string;
};

export type ToolCatalogEntry = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category?: string;
  author?: ToolAuthor;
  repo: string;
  version: string | null;
  releasedAt: string | null;
  releaseUrl: string;
  package: ToolCatalogPackage | null;
  ports?: { preferredProd?: number };
  engines?: { host?: string };
};

export type ToolsCatalog = {
  version: number;
  updatedAt: string;
  catalogUrl?: string;
  tools: ToolCatalogEntry[];
};
