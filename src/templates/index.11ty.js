import { renderTemplatesIndex } from "../lib/template-pages.js";

export default class TemplatesIndexPage {
  data() {
    return {
      permalink: "/templates/",
      layout: "main.webc",
      title: "Templates",
      seoTitle: "Templates | Stripe Projects",
      ogTitle: "Templates | Stripe Projects",
      seoDesc: "Browse Stripe Projects templates and inspect every variant, provider, and build command.",
      ogDesc: "Browse Stripe Projects templates and inspect every variant, provider, and build command.",
      ogImage: "/assets/images/og/default.jpg",
      ogImageAlt: "Stripe Projects templates",
      changefreq: "daily",
      wave: false,
    };
  }

  render(data) {
    return renderTemplatesIndex(data.templates);
  }
}
