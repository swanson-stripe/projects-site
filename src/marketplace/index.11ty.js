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
            seoTitle: "Provisioning API: Marketplace demo",
            ogTitle: "Provisioning API: Marketplace demo",
            seoDesc:
                "Mock marketplace for the provisioning API flows. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogDesc:
                "Mock marketplace for the provisioning API flows. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            changefreq: "weekly",
            wave: false,
        };
    }

    render(data) {
        return renderMarketplaceIndex(data);
    }
}
