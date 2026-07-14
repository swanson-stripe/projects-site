import { renderTemplateFamilyPage } from "../lib/template-pages.js";

export default class TemplateFamilyPage {
  data() {
    return {
      pagination: {
        data: "templates.families",
        size: 1,
        alias: "templateFamily",
      },
      permalink: (data) => data.templateFamily?.url,
      layout: "main.webc",
      ogImage: "/assets/images/og/default.jpg",
      ogImageAlt: "Stripe Projects template details",
      eleventyComputed: {
        canonicalUrl: (data) =>
          `${data.base?.siteOrigin || ""}${data.templateFamily?.url || data.page?.url || "/"}`,
        ogUrl: (data) =>
          `${data.base?.siteOrigin || ""}${data.templateFamily?.url || data.page?.url || "/"}`,
        seoTitle: (data) =>
          `${data.templateFamily?.name || "Template"} | Stripe Projects Templates`,
        ogTitle: (data) =>
          `${data.templateFamily?.name || "Template"} | Stripe Projects Templates`,
        seoDesc: (data) =>
          data.templateFamily?.description ||
          "Inspect template variants, services, and build commands.",
        ogDesc: (data) =>
          data.templateFamily?.description ||
          "Inspect template variants, services, and build commands.",
      },
      changefreq: "daily",
      wave: false,
    };
  }

  render(data) {
    return renderTemplateFamilyPage(data.templateFamily);
  }
}
