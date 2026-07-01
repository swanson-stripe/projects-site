export function stripTrailingSlash(value = "") {
  return String(value).replace(/\/$/, "");
}

export function getProviderId(provider) {
  return String(provider?.slug ?? "").split("/")[0] ?? "";
}

export function getServiceId(provider) {
  return String(provider?.slug ?? "").split("/")[1] ?? "";
}

export function getProviderPageSlug(provider) {
  return getProviderId(provider)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProviderPagePath(provider) {
  return `/providers/${getProviderPageSlug(provider)}/`;
}

export function getProviderPageUrl(provider, siteOrigin = "https://projects.dev") {
  return `${stripTrailingSlash(siteOrigin)}${getProviderPagePath(provider)}`;
}

export function formatToken(token = "") {
  const upper = token.toUpperCase();
  if (["AI", "API", "CI", "CD", "TTS"].includes(upper)) return upper;
  return token.charAt(0).toUpperCase() + token.slice(1);
}

export function formatIdentifier(value = "") {
  return String(value)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(formatToken)
    .join(" ");
}

export function formatCategory(category = "") {
  if (category === "ci-cd") return "CI/CD";
  if (category === "ai") return "AI";
  return formatIdentifier(category);
}

export function getDisplayUrl(url = "") {
  return stripTrailingSlash(url).replace(/^https?:\/\//, "");
}

export function getInstallCommand(provider) {
  return `stripe projects add ${provider.slug}`;
}

export function getProviderSummary(provider) {
  return provider?.longDescription || provider?.description || "";
}

export function getProviderSeoDescription(provider) {
  return `Provision ${provider.name} with Stripe Projects. Add ${provider.name} via ${getInstallCommand(provider)}. ${provider.description}.`;
}
