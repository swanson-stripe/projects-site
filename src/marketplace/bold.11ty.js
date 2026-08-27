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
            seoTitle: "Stripe Provisioning: Provisioning Plaza",
            ogTitle: "Stripe Provisioning: Provisioning Plaza",
            seoDesc:
                "Brand-flooded treatment of the Stripe Projects marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogDesc:
                "Brand-flooded treatment of the Stripe Projects marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogImage: "/assets/images/og/default.jpg",
            ogImageAlt: "",
            changefreq: "weekly",
            wave: false,
        };
    }

    render(data) {
        return renderMarketplaceBold(data);
    }
}
