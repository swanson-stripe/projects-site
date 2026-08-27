import { renderMarketplaceProvider, MARKETPLACE_ORIGIN } from "../lib/marketplace-pages.js";

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
            changefreq: "weekly",
            wave: false,
            // Keep redirecting URLs out of the projects.dev sitemap.
            sitemap: false,
            eleventyComputed: {
                // Published on provisioning.dev; projects.dev redirects here.
                canonicalUrl: (data) => `${MARKETPLACE_ORIGIN}${data.marketplaceProvider.pageUrl}`,
                ogUrl: (data) => `${MARKETPLACE_ORIGIN}${data.marketplaceProvider.pageUrl}`,
                title: (data) => data.marketplaceProvider.name,
                seoTitle: (data) => `Provision ${data.marketplaceProvider.name} | Provisioning API`,
                ogTitle: (data) => `Provision ${data.marketplaceProvider.name} | Provisioning API`,
                seoDesc: (data) =>
                    `${data.marketplaceProvider.description} Provision a plan and resource, then reveal credentials — a mock of the provisioning API flow.`,
                ogDesc: (data) =>
                    `${data.marketplaceProvider.description} Provision a plan and resource, then reveal credentials — a mock of the provisioning API flow.`,
            },
        };
    }

    render(data) {
        return renderMarketplaceProvider(data);
    }
}
