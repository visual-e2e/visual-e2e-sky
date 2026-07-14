export type DownloadAsset = {
  id: "mac-arm64" | "mac-x64" | "win";
  label: string;
  filename: string;
  url: string;
  size: number;
};

export type DownloadsManifest = {
  version: string;
  releasedAt: string | null;
  productRepo: string;
  releaseUrl: string;
  assets: DownloadAsset[];
};
