import { renderMarketplaceBold, MARKETPLACE_ORIGIN } from "../lib/marketplace-pages.js";

/** Bolder alternative treatment of the listing. Shares all flow JS with /marketplace/. */
export default class MarketplaceBoldPage {
    data() {
        return {
            permalink: "/marketplace/bold/",
            // Published on provisioning.dev; projects.dev redirects here.
            canonicalUrl: `${MARKETPLACE_ORIGIN}/marketplace/bold/`,
            ogUrl: `${MARKETPLACE_ORIGIN}/marketplace/bold/`,
            // Keep redirecting URLs out of the projects.dev sitemap.
            sitemap: false,
            layout: "main.webc",
            title: "Provisioning Plaza",
            seoTitle: "Provisioning API: Provisioning Plaza",
            ogTitle: "Provisioning API: Provisioning Plaza",
            seoDesc:
                "Brand-flooded treatment of the provisioning marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogDesc:
                "Brand-flooded treatment of the provisioning marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            changefreq: "weekly",
            wave: false,
        };
    }

    render(data) {
        return renderMarketplaceBold(data);
    }
}
