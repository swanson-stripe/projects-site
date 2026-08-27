/**
 * Front matter shared by every /marketplace/ page.
 *
 * These pages are published on provisioning.dev as a standalone provisioning
 * demo, so they opt out of the main site's identity: the layout reads siteName,
 * twitterSite, and ogImage as overrides. og:image is dropped outright rather
 * than pointed somewhere else — the site's card carries a wordmark these pages
 * deliberately do not. The tab favicon is left as the site's own.
 */
export default {
    siteName: "Provisioning API",
    ogImage: null,
    ogImageAlt: "",
    twitterSite: false,
};
