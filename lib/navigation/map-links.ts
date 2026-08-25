export function createAmapSearchUrl(query: string): string {
  const normalized = query.trim();
  if (!normalized) {
    throw new Error("Map search query must not be empty");
  }

  const url = new URL("https://www.amap.com/search");
  url.searchParams.set("query", normalized);
  return url.toString();
}
