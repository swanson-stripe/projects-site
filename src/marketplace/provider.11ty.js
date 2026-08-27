import { renderMarketplaceProvider } from "../lib/marketplace-pages.js";

/** One page per provider in the catalog snapshot. */
export default class MarketplaceProviderPage {
    data() {
        return {
            pagination: {
                data: "catalog.providers",
                size: 1,
                alias: "marketplaceProvider",
            },
            permalink: (data) => data.marketplaceProvider.pageUrl,
            layout: "main.webc",
            ogImage: "/assets/images/og/default.jpg",
            ogImageAlt: "",
            changefreq: "weekly",
            wave: false,
            eleventyComputed: {
                title: (data) => data.marketplaceProvider.name,
                seoTitle: (data) => `Provision ${data.marketplaceProvider.name} | Stripe Projects Marketplace`,
                ogTitle: (data) => `Provision ${data.marketplaceProvider.name} | Stripe Projects Marketplace`,
                seoDesc: (data) =>
                    `${data.marketplaceProvider.description} Provision a plan and resource, then reveal credentials — a mock of the Stripe Projects flow.`,
                ogDesc: (data) =>
                    `${data.marketplaceProvider.description} Provision a plan and resource, then reveal credentials — a mock of the Stripe Projects flow.`,
            },
        };
    }

    render(data) {
        return renderMarketplaceProvider(data);
    }
}
