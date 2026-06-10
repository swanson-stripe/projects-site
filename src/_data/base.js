export default {
    url: process.env.URL || "http://localhost:8080",
    domain: "https://projects.dev/",
    name: "Stripe Projects",
    env: process.env.ENVIRONMENT || (process.env.VERCEL ? "production" : "local"),
    ctaMode: "install", // "install" | "request-docs" | "request-modal"

    currentYear() {
        const today = new Date();
        return today.getFullYear();
    }
};
