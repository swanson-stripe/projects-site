import { renderMarketplaceDevsite, MARKETPLACE_ORIGIN } from "../lib/marketplace-pages.js";

/** stripe.dev treatment of the Plaza: paper ground, mono labels, table listing. */
export default class MarketplaceDevPage {
    data() {
        return {
            permalink: "/marketplace/dev/",
            // Published on provisioning.dev; projects.dev redirects here.
            canonicalUrl: `${MARKETPLACE_ORIGIN}/marketplace/dev/`,
            ogUrl: `${MARKETPLACE_ORIGIN}/marketplace/dev/`,
            // Keep redirecting URLs out of the projects.dev sitemap.
            sitemap: false,
            layout: "main.webc",
            title: "Provisioning Plaza .dev",
            seoTitle: "Stripe Provisioning: Provisioning Plaza (.dev)",
            ogTitle: "Stripe Provisioning: Provisioning Plaza (.dev)",
            seoDesc:
                "stripe.dev treatment of the Stripe Projects marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogDesc:
                "stripe.dev treatment of the Stripe Projects marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogImage: "/assets/images/og/default.jpg",
            ogImageAlt: "",
            changefreq: "weekly",
            wave: false,
        };
    }

    render(data) {
        return renderMarketplaceDevsite(data);
    }
}
