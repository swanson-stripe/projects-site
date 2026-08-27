import { renderMarketplaceIndex } from "../lib/marketplace-pages.js";

export default class MarketplaceIndexPage {
    data() {
        return {
            permalink: "/marketplace/",
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
