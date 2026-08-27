import { renderMarketplaceDark, MARKETPLACE_ORIGIN } from "../lib/marketplace-pages.js";

/** Dark treatment of the listing, with the bloom-wave shader behind the hero. */
export default class MarketplaceDarkPage {
    data() {
        return {
            permalink: "/marketplace/dark/",
            // Published on provisioning.dev; projects.dev redirects here.
            canonicalUrl: `${MARKETPLACE_ORIGIN}/marketplace/dark/`,
            ogUrl: `${MARKETPLACE_ORIGIN}/marketplace/dark/`,
            // Keep redirecting URLs out of the projects.dev sitemap.
            sitemap: false,
            layout: "main.webc",
            title: "Marketplace — dark",
            seoTitle: "Provisioning API: Marketplace (dark)",
            ogTitle: "Provisioning API: Marketplace (dark)",
            seoDesc:
                "Dark treatment of the provisioning marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogDesc:
                "Dark treatment of the provisioning marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            changefreq: "weekly",
            // Leave the shader enabled — the hero mounts it.
            wave: true,
        };
    }

    render(data) {
        return renderMarketplaceDark(data);
    }
}
