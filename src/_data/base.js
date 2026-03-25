export default {
    url: process.env.URL || "http://localhost:8080",
    domain: "https://projects.dev/",
    name: "Stripe Projects",
    env: process.env.ENVIRONMENT || "local",
    ctaMode: "request-docs", // "install" | "request-docs" | "request-modal"

    currentYear() {
        const today = new Date();
        return today.getFullYear();
    }
};