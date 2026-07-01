import { getProviderPagePath } from "./lib/provider-pages.js";

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return null;
  return date.toISOString().slice(0, 10);
}

function shouldIncludePage(item) {
  if (!item?.url || !item?.outputPath?.endsWith(".html")) return false;
  if (item.data?.eleventyExcludeFromCollections) return false;
  if (item.data?.sitemap === false) return false;

  const robots = item.data?.robots;
  if (typeof robots === "string" && robots.toLowerCase().includes("noindex")) {
    return false;
  }

  return true;
}

function getChangefreq(item) {
  if (item.data?.changefreq) return item.data.changefreq;
  if (item.url.startsWith("/blog/") && item.url !== "/blog/") return "monthly";
  return null;
}

export default class SitemapTemplate {
  data() {
    return {
      permalink: "/sitemap.xml",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const siteOrigin = (data.base?.siteOrigin ?? "https://projects.dev").replace(/\/$/, "");
    const collectionPages = Array.from(
      new Map(
        (data.collections.all ?? [])
          .filter(shouldIncludePage)
          .map((item) => [item.url, item]),
      ).values(),
    );
    const providerPages = (data.providers ?? []).map((provider) => ({
      url: getProviderPagePath(provider),
      data: {
        changefreq: "weekly",
      },
    }));
    const pages = Array.from(
      new Map(
        [...collectionPages, ...providerPages].map((item) => [item.url, item]),
      ).values(),
    ).sort((a, b) => a.url.localeCompare(b.url));

    const body = pages
      .map((item) => {
        const loc = `${siteOrigin}${item.url}`;
        const lastmod = formatDate(item.data?.date);
        const changefreq = getChangefreq(item);

        return [
          "  <url>",
          `    <loc>${escapeXml(loc)}</loc>`,
          lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
          changefreq ? `    <changefreq>${escapeXml(changefreq)}</changefreq>` : null,
          "  </url>",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  }
}
