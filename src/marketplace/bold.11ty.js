import { renderMarketplaceBold } from "../lib/marketplace-pages.js";

/** Bolder alternative treatment of the listing. Shares all flow JS with /marketplace/. */
export default class MarketplaceBoldPage {
    data() {
        return {
            permalink: "/marketplace/bold/",
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
