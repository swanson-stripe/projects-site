import { renderMarketplaceDark } from "../lib/marketplace-pages.js";

/** Dark treatment of the listing, with the bloom-wave shader behind the hero. */
export default class MarketplaceDarkPage {
    data() {
        return {
            permalink: "/marketplace/dark/",
            layout: "main.webc",
            title: "Marketplace — dark",
            seoTitle: "Stripe Provisioning: Marketplace (dark)",
            ogTitle: "Stripe Provisioning: Marketplace (dark)",
            seoDesc:
                "Dark treatment of the Stripe Projects marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogDesc:
                "Dark treatment of the Stripe Projects marketplace demo. Link provider accounts, accept terms, pick a plan, provision a resource, and reveal credentials from the UI.",
            ogImage: "/assets/images/og/default.jpg",
            ogImageAlt: "",
            changefreq: "weekly",
            // Leave the shader enabled — the hero mounts it.
            wave: true,
        };
    }

    render(data) {
        return renderMarketplaceDark(data);
    }
}
