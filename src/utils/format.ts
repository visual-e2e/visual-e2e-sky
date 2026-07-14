export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export function detectPreferredAssetId(): "mac-arm64" | "mac-x64" | "win" | null {
  const ua = navigator.userAgent;
  const platform = navigator.platform ?? "";
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return "win";
  if (/Mac/i.test(platform)) {
    // Apple Silicon Macs often report MacIntel in UA; arm64 hint from userAgentData when available.
    const uaData = (navigator as Navigator & { userAgentData?: { platform?: string; architecture?: string } })
      .userAgentData;
    if (uaData?.architecture === "arm") return "mac-arm64";
    return "mac-arm64";
  }
  return null;
}
