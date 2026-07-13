import { renderTemplateVariantPage } from "../lib/template-pages.js";

export default class TemplateVariantPage {
  data() {
    return {
      pagination: {
        data: "templates.variants",
        size: 1,
        alias: "templateVariant",
      },
      permalink: (data) => data.templateVariant?.url,
      layout: "main.webc",
      ogImage: "/assets/images/og/default.jpg",
      ogImageAlt: "Stripe Projects template variant details",
      eleventyComputed: {
        canonicalUrl: (data) =>
          `${data.base?.siteOrigin || ""}${data.templateVariant?.url || data.page?.url || "/"}`,
        ogUrl: (data) =>
          `${data.base?.siteOrigin || ""}${data.templateVariant?.url || data.page?.url || "/"}`,
        seoTitle: (data) =>
          `${data.templateVariant?.metadata?.name || "Template"}: ${data.templateVariant?.variantDescription || data.templateVariant?.variantId || "Variant"} | Stripe Projects`,
        ogTitle: (data) =>
          `${data.templateVariant?.metadata?.name || "Template"}: ${data.templateVariant?.variantDescription || data.templateVariant?.variantId || "Variant"} | Stripe Projects`,
        seoDesc: (data) =>
          data.templateVariant?.metadata?.description ||
          "Inspect a Stripe Projects template variant, included services, and its exact build command.",
        ogDesc: (data) =>
          data.templateVariant?.metadata?.description ||
          "Inspect a Stripe Projects template variant, included services, and its exact build command.",
      },
      changefreq: "daily",
      wave: false,
    };
  }

  render(data) {
    return renderTemplateVariantPage(data.templateVariant);
  }
}
