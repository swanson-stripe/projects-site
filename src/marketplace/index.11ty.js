import { renderMarketplaceIndex, MARKETPLACE_ORIGIN } from "../lib/marketplace-pages.js";

export default class MarketplaceIndexPage {
    data() {
        return {
            permalink: "/marketplace/",
            // Published on provisioning.dev; projects.dev redirects here.
            canonicalUrl: `${MARKETPLACE_ORIGIN}/marketplace/`,
            ogUrl: `${MARKETPLACE_ORIGIN}/marketplace/`,
            // Keep redirecting URLs out of the projects.dev sitemap.
            sitemap: false,
            layout: "main.webc",
            title: "Marketplace",
            seoTitle: "Stripe Projects: Marketplace demo",
            ogTitle: "Stripe Projects: Marketplace demo",
            seoDesc:
                "Mock marketplace for the Stripe Projects provisioning flows. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogDesc:
                "Mock marketplace for the Stripe Projects provisioning flows. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogImage: "/assets/images/og/default.jpg",
            ogImageAlt: "",
            changefreq: "weekly",
            wave: false,
        };
    }

    render(data) {
        return renderMarketplaceIndex(data);
    }
}
