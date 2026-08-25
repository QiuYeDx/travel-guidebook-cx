export type OfflineLinkAction =
  | { kind: "internal-document"; url: string }
  | { kind: "block-external" }
  | { kind: "allow" };

export function getOfflineLinkAction(
  href: string,
  currentUrl: string,
): OfflineLinkAction {
  const target = new URL(href, currentUrl);
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return { kind: "allow" };
  }

  const current = new URL(currentUrl);
  if (target.origin === current.origin) {
    return { kind: "internal-document", url: target.toString() };
  }
  return { kind: "block-external" };
}
