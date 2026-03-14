export default {
    url: process.env.URL || "http://localhost:8080",
    domain: "https://projects.dev/",
    name: "Stripe Projects",
    env: process.env.ENVIRONMENT || "local",

    // Current year
    currentYear() {
        const today = new Date();
        return today.getFullYear();
    }
};