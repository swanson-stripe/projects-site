/**
 * GENERATED FILE — do not edit by hand.
 *
 * Snapshot of the Projects catalog, reshaped for /marketplace/. Regenerate with:
 *
 *     stripe projects catalog --json > catalog.json
 *     node scripts/build-marketplace-catalog.mjs catalog.json
 *
 * Provider websites and descriptions are merged in from src/providers.webc.
 * Legal links and credential key names are demo stand-ins — see the generator.
 */

export default {
    "lastUpdated": "2026-09-02T17:53:24.398Z",
    "providerCount": 64,
    "serviceCount": 203,
    "deployableCount": 92,
    "categories": [
        {
            "id": "ai",
            "label": "AI",
            "count": 25
        },
        {
            "id": "compute",
            "label": "Compute",
            "count": 16
        },
        {
            "id": "database",
            "label": "Database",
            "count": 15
        },
        {
            "id": "search",
            "label": "Search",
            "count": 8
        },
        {
            "id": "storage",
            "label": "Storage",
            "count": 8
        },
        {
            "id": "analytics",
            "label": "Analytics",
            "count": 7
        },
        {
            "id": "auth",
            "label": "Auth",
            "count": 7
        },
        {
            "id": "browser",
            "label": "Browser",
            "count": 5
        },
        {
            "id": "cache",
            "label": "Cache",
            "count": 5
        },
        {
            "id": "observability",
            "label": "Observability",
            "count": 5
        },
        {
            "id": "domains",
            "label": "Domains",
            "count": 4
        },
        {
            "id": "feature_flags",
            "label": "Feature flags",
            "count": 4
        },
        {
            "id": "sandbox",
            "label": "Sandbox",
            "count": 4
        },
        {
            "id": "email",
            "label": "Email",
            "count": 3
        },
        {
            "id": "messaging",
            "label": "Messaging",
            "count": 3
        },
        {
            "id": "payments",
            "label": "Payments",
            "count": 3
        },
        {
            "id": "cdn",
            "label": "Cdn",
            "count": 2
        },
        {
            "id": "ci",
            "label": "CI",
            "count": 2
        },
        {
            "id": "communications",
            "label": "Communications",
            "count": 2
        },
        {
            "id": "ecommerce",
            "label": "Ecommerce",
            "count": 2
        },
        {
            "id": "queue",
            "label": "Queue",
            "count": 2
        },
        {
            "id": "notification",
            "label": "Notification",
            "count": 1
        }
    ],
    "providers": [
        {
            "slug": "agentmail",
            "name": "AgentMail",
            "url": "https://agentmail.to",
            "tosUrl": "https://agentmail.to/terms",
            "privacyUrl": "https://agentmail.to/privacy",
            "iconUrl": "/assets/images/provider-favicons/agentmail.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "AG",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "The email inbox API for AI agents. Agents can communicate with any internet user and authenticate with any internet service.",
            "categories": [
                "email",
                "ai",
                "messaging"
            ],
            "pageUrl": "/marketplace/agentmail/",
            "searchText": "agentmail agentmail the email inbox api for ai agents. agents can communicate with any internet user and authenticate with any internet service. email ai messaging agentmail/api",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "agentmail/free",
                    "description": "Build on AgentMail for free :)",
                    "categories": [
                        "ai",
                        "email",
                        "messaging"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "developer",
                        "startup",
                        "free"
                    ]
                },
                {
                    "serviceId": "developer",
                    "ref": "agentmail/developer",
                    "description": "For developers making small scale applications",
                    "categories": [
                        "ai",
                        "email",
                        "messaging"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$20.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$20.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "startup",
                        "free",
                        "developer"
                    ]
                },
                {
                    "serviceId": "startup",
                    "ref": "agentmail/startup",
                    "description": "For production workloads",
                    "categories": [
                        "ai",
                        "email",
                        "messaging"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$200.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$200.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "developer",
                        "free",
                        "startup"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "api",
                    "ref": "agentmail/api",
                    "description": "AgentMail API — create inboxes to send and receive email programmatically for AI agents",
                    "categories": [
                        "email"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "developer",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "startup",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "api",
                    "envPrefix": "AGENTMAIL_API",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "api"
                    ]
                }
            ]
        },
        {
            "slug": "agentphone",
            "name": "AgentPhone",
            "url": "https://agentphone.ai",
            "tosUrl": "https://agentphone.ai/terms",
            "privacyUrl": "https://agentphone.ai/privacy",
            "iconUrl": "/assets/images/provider-favicons/agentphone.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "AG",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Programmable phone numbers for AI agents. Make and receive calls, handle voicemail, and route conversations autonomously.",
            "categories": [
                "communications"
            ],
            "pageUrl": "/marketplace/agentphone/",
            "searchText": "agentphone agentphone programmable phone numbers for ai agents. make and receive calls, handle voicemail, and route conversations autonomously. communications agentphone/number",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "number",
                    "ref": "agentphone/number",
                    "description": "Provision a phone number with voice and messaging capabilities for your AI agent. Get a US or CA number and start making calls and sending messages.",
                    "categories": [
                        "communications"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "number",
                    "envPrefix": "AGENTPHONE_NUMBER",
                    "credentialKeys": [
                        "API_KEY",
                        "SENDER_ID"
                    ],
                    "updateableTo": [
                        "number"
                    ]
                }
            ]
        },
        {
            "slug": "algolia",
            "name": "Algolia",
            "url": "https://algolia.com",
            "tosUrl": "https://algolia.com/terms",
            "privacyUrl": "https://algolia.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/algolia.svg",
            "brandColor": "#003dff",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "AL",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "AI Search and Retrieval platform with a unified keyword and vector engine, enabling companies to build agentic, generative, and search experiences.",
            "categories": [
                "ai",
                "search"
            ],
            "pageUrl": "/marketplace/algolia/",
            "searchText": "algolia algolia ai search and retrieval platform with a unified keyword and vector engine, enabling companies to build agentic, generative, and search experiences. ai search algolia/application",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "application",
                    "ref": "algolia/application",
                    "description": "Algolia Search & Discovery API",
                    "categories": [
                        "search",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "plan": "free"
                            },
                            "label": "free",
                            "price": "Free forever Search & Discovery API",
                            "status": "free",
                            "description": "Free forever Search & Discovery API",
                            "isDefault": false,
                            "terms": "By proceeding, you accept the Algolia Free Plan Terms: https://www.algolia.com/policies/free-plan-details and the product specific Service Limits available at https://www.algolia.com/doc/guides/scaling/algolia-service-limits.",
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "plan": "grow"
                            },
                            "label": "grow",
                            "price": "$0.50 / 1,000 Requests - Free 10,000 Requests / mo - No attribution required - No usage limits",
                            "status": "paid",
                            "description": "Best-in-class Search & Discovery API with free tier.",
                            "isDefault": false,
                            "terms": "By proceeding, you accept the Algolia Grow Plan Terms: https://www.algolia.com/policies/grow-plan-specific-terms and the product specific Service Limits available at https://www.algolia.com/doc/guides/scaling/algolia-service-limits.",
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "plan": "grow-plus"
                            },
                            "label": "grow-plus",
                            "price": "$1.75 / 1,000 Requests - Free 10,000 Requests / mo - No attribution required - No usage limits",
                            "status": "paid",
                            "description": "AI-powered Search & Discovery API with free tier.",
                            "isDefault": false,
                            "terms": "By proceeding, you accept the Algolia Grow Plus Plan Terms: https://www.algolia.com/policies/grow-plus-plan-specific-terms and the product specific Service Limits available at https://www.algolia.com/doc/guides/scaling/algolia-service-limits.",
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Free forever Search & Discovery API",
                    "defaultResourceName": "application",
                    "envPrefix": "ALGOLIA_APPLICATION",
                    "credentialKeys": [
                        "API_KEY",
                        "APP_ID"
                    ],
                    "updateableTo": [
                        "application"
                    ]
                }
            ]
        },
        {
            "slug": "amplitude",
            "name": "Amplitude",
            "url": "https://amplitude.com",
            "tosUrl": "https://amplitude.com/terms",
            "privacyUrl": "https://amplitude.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/amplitude.svg",
            "brandColor": "#0052f2",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "AM",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Digital analytics platform for understanding user behavior, building funnels, measuring retention, and running A/B experiments to drive product growth.",
            "categories": [
                "ai",
                "analytics",
                "feature_flags"
            ],
            "pageUrl": "/marketplace/amplitude/",
            "searchText": "amplitude amplitude digital analytics platform for understanding user behavior, building funnels, measuring retention, and running a/b experiments to drive product growth. ai analytics feature_flags amplitude/analytics",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "amplitude/free",
                    "description": "Free plan - Product analytics, feature flags, and session replay with up to 10k MTU",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "plus-v3-50k-mtu-monthly",
                        "plus-v3-25k-mtu-monthly",
                        "plus-v3-10k-mtu-monthly",
                        "free"
                    ]
                },
                {
                    "serviceId": "plus-v3-10k-mtu-monthly",
                    "ref": "amplitude/plus-v3-10k-mtu-monthly",
                    "description": "Plus plan - 10k MTU (Monthly) - Advanced analytics, unlimited feature flags, and session replay",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$186.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$186.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "plus-v3-50k-mtu-monthly",
                        "plus-v3-25k-mtu-monthly",
                        "free",
                        "plus-v3-10k-mtu-monthly"
                    ]
                },
                {
                    "serviceId": "plus-v3-25k-mtu-monthly",
                    "ref": "amplitude/plus-v3-25k-mtu-monthly",
                    "description": "Plus plan - 25k MTU (Monthly) - Advanced analytics, unlimited feature flags, and session replay",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$311.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$311.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "plus-v3-10k-mtu-monthly",
                        "plus-v3-50k-mtu-monthly",
                        "free",
                        "plus-v3-25k-mtu-monthly"
                    ]
                },
                {
                    "serviceId": "plus-v3-50k-mtu-monthly",
                    "ref": "amplitude/plus-v3-50k-mtu-monthly",
                    "description": "Plus plan - 50k MTU (Monthly) - Advanced analytics, unlimited feature flags, and session replay",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$561.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$561.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "plus-v3-10k-mtu-monthly",
                        "plus-v3-25k-mtu-monthly",
                        "free",
                        "plus-v3-50k-mtu-monthly"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "analytics",
                    "ref": "amplitude/analytics",
                    "description": "Amplitude Analytics - Product analytics, feature flags, session replay, and experimentation to help teams build better products",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "plus-v3-10k-mtu-monthly",
                            "status": "paid",
                            "price": "$186.00 per month",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "plus-v3-25k-mtu-monthly",
                            "status": "paid",
                            "price": "$311.00 per month",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "plus-v3-50k-mtu-monthly",
                            "status": "paid",
                            "price": "$561.00 per month",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "analytics",
                    "envPrefix": "AMPLITUDE_ANALYTICS",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID",
                        "HOST"
                    ],
                    "updateableTo": [
                        "plus-v3-25k-mtu-monthly",
                        "plus-v3-50k-mtu-monthly",
                        "plus-v3-10k-mtu-monthly",
                        "free",
                        "analytics"
                    ]
                }
            ]
        },
        {
            "slug": "auth0",
            "name": "Auth0",
            "url": "https://auth0.com",
            "tosUrl": "https://auth0.com/terms",
            "privacyUrl": "https://auth0.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/auth0.svg",
            "brandColor": "#191919",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "AU",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Secure users, AI agents, and more with an easy-to-implement, scalable, and adaptable authentication and authorization platform.",
            "categories": [
                "auth"
            ],
            "pageUrl": "/marketplace/auth0/",
            "searchText": "auth0 auth0 secure users, ai agents, and more with an easy-to-implement, scalable, and adaptable authentication and authorization platform. auth auth0/client",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "auth0/free",
                    "description": "Auth0 Free Plan",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "b2b-professional",
                        "b2c-professional",
                        "b2b-essentials",
                        "b2c-essentials",
                        "free"
                    ]
                },
                {
                    "serviceId": "b2b-professional",
                    "ref": "auth0/b2b-professional",
                    "description": "Auth0 B2B - Professional Plan",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$800.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$800.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "b2c-professional",
                        "b2b-essentials",
                        "b2c-essentials",
                        "free",
                        "b2b-professional"
                    ]
                },
                {
                    "serviceId": "b2b-essentials",
                    "ref": "auth0/b2b-essentials",
                    "description": "Auth0 B2B - Essentials Plan",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$150.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$150.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "b2b-professional",
                        "b2c-professional",
                        "b2c-essentials",
                        "free",
                        "b2b-essentials"
                    ]
                },
                {
                    "serviceId": "b2c-professional",
                    "ref": "auth0/b2c-professional",
                    "description": "Auth0 B2C - Professional Plan",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$240.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$240.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "b2b-professional",
                        "b2b-essentials",
                        "b2c-essentials",
                        "free",
                        "b2c-professional"
                    ]
                },
                {
                    "serviceId": "b2c-essentials",
                    "ref": "auth0/b2c-essentials",
                    "description": "Auth0 B2C - Essentials Plan",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$35.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$35.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "b2b-professional",
                        "b2c-professional",
                        "b2b-essentials",
                        "free",
                        "b2c-essentials"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "client",
                    "ref": "auth0/client",
                    "description": "Setup a mobile, web or IoT application to use Auth0 for authentication.",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "b2b-professional",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "b2c-professional",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "b2c-essentials",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "b2b-essentials",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "client",
                    "envPrefix": "AUTH0_CLIENT",
                    "credentialKeys": [
                        "PUBLISHABLE_KEY",
                        "SECRET_KEY",
                        "ISSUER_URL"
                    ],
                    "updateableTo": [
                        "client"
                    ]
                }
            ]
        },
        {
            "slug": "base44",
            "name": "Base 44",
            "url": "https://base44.com",
            "tosUrl": "https://base44.com/terms",
            "privacyUrl": "https://base44.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/base44.svg",
            "brandColor": "#ff631f",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "B4",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Full-stack app platform with hosting, database, and AI built in. Ship complete applications from a single environment.",
            "categories": [
                "ai",
                "auth",
                "compute",
                "database"
            ],
            "pageUrl": "/marketplace/base44/",
            "searchText": "base 44 base44 full-stack app platform with hosting, database, and ai built in. ship complete applications from a single environment. ai auth compute database base44/app",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "app",
                    "ref": "base44/app",
                    "description": "A Base44 app with AI services, hosting, database and auth.",
                    "categories": [
                        "compute",
                        "database",
                        "auth",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "app",
                    "envPrefix": "BASE44_APP",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "app"
                    ]
                }
            ]
        },
        {
            "slug": "blaxel",
            "name": "Blaxel",
            "url": "https://blaxel.ai",
            "tosUrl": "https://blaxel.ai/terms",
            "privacyUrl": "https://blaxel.ai/privacy",
            "iconUrl": "/assets/images/provider-favicons/blaxel.svg",
            "brandColor": "#fbb040",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "BL",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Serverless platform for deploying and running AI agents with built-in sandboxed execution environments.",
            "categories": [
                "ai",
                "compute",
                "sandbox",
                "storage"
            ],
            "pageUrl": "/marketplace/blaxel/",
            "searchText": "blaxel blaxel serverless platform for deploying and running ai agents with built-in sandboxed execution environments. ai compute sandbox storage blaxel/agent-drive blaxel/sandbox",
            "plans": [
                {
                    "serviceId": "tier-1",
                    "ref": "blaxel/tier-1",
                    "description": "$20/month top-up enables Tier 1.",
                    "categories": [
                        "compute",
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "paid",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "credits_usd": 20,
                                "tier": "tier_1",
                                "qualification_window_days": 30
                            },
                            "label": "20 · tier_1 · 30",
                            "price": "paid",
                            "status": "paid",
                            "description": "Tier 1: higher resource limits and all previous tier features",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": "https://blaxel.ai/terms"
                        }
                    ],
                    "updateableTo": [
                        "tier-2",
                        "tier-3",
                        "tier-4",
                        "tier-5",
                        "tier-6",
                        "tier-1"
                    ]
                },
                {
                    "serviceId": "tier-4",
                    "ref": "blaxel/tier-4",
                    "description": "$500/month top-up enables Tier 4.",
                    "categories": [
                        "compute",
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "paid",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "credits_usd": 500,
                                "tier": "tier_4",
                                "qualification_window_days": 30
                            },
                            "label": "500 · tier_4 · 30",
                            "price": "paid",
                            "status": "paid",
                            "description": "Tier 4: higher resource limits and all previous tier features",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": "https://blaxel.ai/terms"
                        }
                    ],
                    "updateableTo": [
                        "tier-3",
                        "tier-5",
                        "tier-6",
                        "tier-1",
                        "tier-2",
                        "tier-4"
                    ]
                },
                {
                    "serviceId": "tier-5",
                    "ref": "blaxel/tier-5",
                    "description": "$1,500/month top-up enables Tier 5.",
                    "categories": [
                        "compute",
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "paid",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "credits_usd": 1500,
                                "tier": "tier_5",
                                "qualification_window_days": 30
                            },
                            "label": "1500 · tier_5 · 30",
                            "price": "paid",
                            "status": "paid",
                            "description": "Tier 5: higher resource limits and all previous tier features",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": "https://blaxel.ai/terms"
                        }
                    ],
                    "updateableTo": [
                        "tier-3",
                        "tier-4",
                        "tier-6",
                        "tier-1",
                        "tier-2",
                        "tier-5"
                    ]
                },
                {
                    "serviceId": "tier-2",
                    "ref": "blaxel/tier-2",
                    "description": "$50/month top-up enables Tier 2.",
                    "categories": [
                        "compute",
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "paid",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "credits_usd": 50,
                                "tier": "tier_2",
                                "qualification_window_days": 30
                            },
                            "label": "50 · tier_2 · 30",
                            "price": "paid",
                            "status": "paid",
                            "description": "Tier 2: higher resource limits and all previous tier features",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": "https://blaxel.ai/terms"
                        }
                    ],
                    "updateableTo": [
                        "tier-3",
                        "tier-4",
                        "tier-5",
                        "tier-6",
                        "tier-1",
                        "tier-2"
                    ]
                },
                {
                    "serviceId": "tier-6",
                    "ref": "blaxel/tier-6",
                    "description": "$4,000/month top-up enables Tier 6.",
                    "categories": [
                        "compute",
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "paid",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "credits_usd": 4000,
                                "tier": "tier_6",
                                "qualification_window_days": 30
                            },
                            "label": "4000 · tier_6 · 30",
                            "price": "paid",
                            "status": "paid",
                            "description": "Tier 6: higher resource limits and all previous tier features",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": "https://blaxel.ai/terms"
                        }
                    ],
                    "updateableTo": [
                        "tier-3",
                        "tier-4",
                        "tier-5",
                        "tier-1",
                        "tier-2",
                        "tier-6"
                    ]
                },
                {
                    "serviceId": "tier-3",
                    "ref": "blaxel/tier-3",
                    "description": "$200/month top-up enables Tier 3.",
                    "categories": [
                        "compute",
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "paid",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "credits_usd": 200,
                                "tier": "tier_3",
                                "qualification_window_days": 30
                            },
                            "label": "200 · tier_3 · 30",
                            "price": "paid",
                            "status": "paid",
                            "description": "Tier 3: higher resource limits and all previous tier features",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": "https://blaxel.ai/terms"
                        }
                    ],
                    "updateableTo": [
                        "tier-4",
                        "tier-5",
                        "tier-6",
                        "tier-1",
                        "tier-2",
                        "tier-3"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "agent-drive",
                    "ref": "blaxel/agent-drive",
                    "description": "Shared filesystem for agents to work on the same files across multiple sandboxes.",
                    "categories": [
                        "compute",
                        "ai",
                        "storage"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "agent-drive",
                    "envPrefix": "BLAXEL_AGENT_DRIVE",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "agent-drive"
                    ]
                },
                {
                    "serviceId": "sandbox",
                    "ref": "blaxel/sandbox",
                    "description": "Secure sandboxes that instantly suspend when idle, and resume in 25 ms.",
                    "categories": [
                        "compute",
                        "sandbox",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "sandbox",
                    "envPrefix": "BLAXEL_SANDBOX",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "sandbox"
                    ]
                }
            ]
        },
        {
            "slug": "browserbase",
            "name": "Browserbase",
            "url": "https://browserbase.com",
            "tosUrl": "https://browserbase.com/terms",
            "privacyUrl": "https://browserbase.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/browserbase.svg",
            "brandColor": "#ff4500",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "BR",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Platform for building and deploying browser agents that interact with the web like humans. Spin up thousands of headless browsers in milliseconds, globally.",
            "categories": [
                "browser"
            ],
            "pageUrl": "/marketplace/browserbase/",
            "searchText": "browserbase browserbase platform for building and deploying browser agents that interact with the web like humans. spin up thousands of headless browsers in milliseconds, globally. browser browserbase/project",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "browserbase/free",
                    "description": "Free — $0/month. 3 concurrent browsers, 1 browser hour/month, 1,000 Search API calls, 1,000 Fetch API calls, 15-minute session cap. 7-day data retention. $5 in model tokens included. No proxies, no Verified Agents.",
                    "categories": [
                        "browser"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "developer",
                        "startup",
                        "free"
                    ]
                },
                {
                    "serviceId": "developer",
                    "ref": "browserbase/developer",
                    "description": "Developer — $20/month. 25 concurrent browsers, 100 browser hours then $0.12/hour, 1,000 Search calls then $7/1,000, 1,000 Fetch calls then $1/1,000 (or $4/1,000 with proxies), 1GB residential proxies then $12/GB. Verified Agents, Model Gateway pay-as-you-go at market rates. 7-day data retention.",
                    "categories": [
                        "browser"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$20/month + usage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$20/month + usage",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "startup",
                        "free",
                        "developer"
                    ]
                },
                {
                    "serviceId": "startup",
                    "ref": "browserbase/startup",
                    "description": "Startup — $99/month (most popular). 100 concurrent browsers, 500 browser hours then $0.10/hour, 1,000 Search calls then $7/1,000, 10,000 Fetch calls then $0.50/1,000 (or $4/1,000 with proxies), 5GB residential proxies then $10/GB. Verified Agents, Model Gateway pay-as-you-go. 30-day data retention.",
                    "categories": [
                        "browser"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$99/month + usage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$99/month + usage",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "developer",
                        "free",
                        "startup"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "project",
                    "ref": "browserbase/project",
                    "description": "A Browserbase project — managed cloud browsers for Playwright, Puppeteer, Stagehand, and Selenium workloads, plus Search API, Fetch API, Model Gateway access, residential proxies, Verified Agents, and live session viewing. Concurrency, browser hours, retention, and proxy / verification capabilities are determined by the active plan.",
                    "categories": [
                        "browser"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "developer",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "startup",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "project",
                    "envPrefix": "BROWSERBASE_PROJECT",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID"
                    ],
                    "updateableTo": [
                        "project"
                    ]
                }
            ]
        },
        {
            "slug": "chatbase",
            "name": "Chatbase",
            "url": "https://chatbase.co",
            "tosUrl": "https://chatbase.co/terms",
            "privacyUrl": "https://chatbase.co/privacy",
            "iconUrl": "/assets/images/provider-favicons/chatbase.svg",
            "brandColor": "#09090b",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "CH",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "AI agent builder platform. Create, deploy, and manage custom AI chatbots trained on your data.",
            "categories": [
                "ai"
            ],
            "pageUrl": "/marketplace/chatbase/",
            "searchText": "chatbase chatbase ai agent builder platform. create, deploy, and manage custom ai chatbots trained on your data. ai chatbase/agent",
            "plans": [
                {
                    "serviceId": "pro",
                    "ref": "chatbase/pro",
                    "description": "Pro plan — 15,000 message credits/month, 1 AI agent, all features, advanced analytics, tickets",
                    "categories": [
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "paid",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "paid",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "hobby",
                        "standard",
                        "pro"
                    ]
                },
                {
                    "serviceId": "hobby",
                    "ref": "chatbase/hobby",
                    "description": "Hobby plan — 700 message credits/month, 1 AI agent, all AI models",
                    "categories": [
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "paid",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "paid",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro",
                        "standard",
                        "hobby"
                    ]
                },
                {
                    "serviceId": "standard",
                    "ref": "chatbase/standard",
                    "description": "Standard plan — 4,000 message credits/month, 1 AI agent, API access, voice, telephony",
                    "categories": [
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "paid",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "paid",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro",
                        "hobby",
                        "standard"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "agent",
                    "ref": "chatbase/agent",
                    "description": "AI chatbot agent — train on your data, deploy via API or embed widget",
                    "categories": [
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "standard",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "hobby",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "agent",
                    "envPrefix": "CHATBASE_AGENT",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "agent"
                    ]
                }
            ]
        },
        {
            "slug": "chroma",
            "name": "Chroma",
            "url": "https://trychroma.com",
            "tosUrl": "https://trychroma.com/terms",
            "privacyUrl": "https://trychroma.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/chroma.svg",
            "brandColor": "#327eff",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "CH",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "AI-native vector database. Fast, serverless search supporting vector, full-text, regex, and metadata queries.",
            "categories": [
                "ai",
                "database"
            ],
            "pageUrl": "/marketplace/chroma/",
            "searchText": "chroma chroma ai-native vector database. fast, serverless search supporting vector, full-text, regex, and metadata queries. ai database chroma/database",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "database",
                    "ref": "chroma/database",
                    "description": "A hosted search database for AI applications",
                    "categories": [
                        "database",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "database",
                    "envPrefix": "CHROMA_DATABASE",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "database"
                    ]
                }
            ]
        },
        {
            "slug": "clerk",
            "name": "Clerk",
            "url": "https://clerk.dev",
            "tosUrl": "https://clerk.dev/terms",
            "privacyUrl": "https://clerk.dev/privacy",
            "iconUrl": "/assets/images/provider-favicons/clerk.svg",
            "brandColor": "#6c47ff",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "CL",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Drop-in authentication with social login, magic links, MFA, and full user management UI.",
            "categories": [
                "auth"
            ],
            "pageUrl": "/marketplace/clerk/",
            "searchText": "clerk clerk drop-in authentication with social login, magic links, mfa, and full user management ui. auth clerk/auth",
            "plans": [
                {
                    "serviceId": "hobby",
                    "ref": "clerk/hobby",
                    "description": "Clerk Hobby plan — authentication and user management for side projects and small apps. 50,000 MAU included.",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pro",
                        "hobby"
                    ]
                },
                {
                    "serviceId": "pro",
                    "ref": "clerk/pro",
                    "description": "Clerk Pro plan — production-ready auth with MFA, SSO, custom domains, remove branding. 50,000 MAU included, then usage-based.",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$25/month base. Includes 50,000 MAU and 100 MAO. $0.02/MAU and $1/MAO above included amounts.",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$25/month base. Includes 50,000 MAU and 100 MAO. $0.02/MAU and $1/MAO above included amounts.",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "auth",
                    "ref": "clerk/auth",
                    "description": "Clerk Authentication — drop-in auth for any framework. Free by default, paid under Pro.",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "hobby",
                            "status": "free",
                            "price": "Free",
                            "isDefault": true
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "$25/month base. Includes 50,000 MAU and 100 MAO. $0.02/MAU and $1/MAO above included amounts.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "auth",
                    "envPrefix": "CLERK_AUTH",
                    "credentialKeys": [
                        "PUBLISHABLE_KEY",
                        "SECRET_KEY",
                        "ISSUER_URL"
                    ],
                    "updateableTo": [
                        "auth"
                    ]
                }
            ]
        },
        {
            "slug": "clickhouse",
            "name": "ClickHouse",
            "url": "https://clickhouse.com",
            "tosUrl": "https://clickhouse.com/terms",
            "privacyUrl": "https://clickhouse.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/clickhouse.svg",
            "brandColor": "#faff70",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": true,
            "fallbackInitials": "CL",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Open-source columnar database for real-time analytics. Process billions of rows in milliseconds with SQL.",
            "categories": [
                "database",
                "analytics"
            ],
            "pageUrl": "/marketplace/clickhouse/",
            "searchText": "clickhouse clickhouse open-source columnar database for real-time analytics. process billions of rows in milliseconds with sql. database analytics clickhouse/clickhouse clickhouse/postgres",
            "plans": [
                {
                    "serviceId": "scale",
                    "ref": "clickhouse/scale",
                    "description": "ClickHouse Cloud Scale — production-grade managed ClickHouse with multi-replica baseline, autoscaling, and broader memory range. Usage-based pricing: compute metered per memory-hour between minReplicaMemoryGb and maxReplicaMemoryGb (times numReplicas), storage per compressed TB-month. Prices vary per (cloud provider, region) pair.",
                    "categories": [
                        "analytics",
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "Scale tier — usage-based: compute $0.50–$12.70/hour, storage $22.00–$27.50/TB-month (8–128 GiB × 2 replicas; spans all regions).",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Scale tier — usage-based: compute $0.50–$12.70/hour, storage $22.00–$27.50/TB-month (8–128 GiB × 2 replicas; spans all regions).",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "basic",
                        "enterprise",
                        "scale"
                    ]
                },
                {
                    "serviceId": "basic",
                    "ref": "clickhouse/basic",
                    "description": "ClickHouse Cloud Basic — single-replica managed ClickHouse for development, prototyping, and small analytical workloads. Usage-based pricing: compute metered per memory-hour at a fixed replica memory size, storage per compressed TB-month. Idle scaling on by default — compute bills $0 during idle periods. Prices vary per (cloud provider, region) pair.",
                    "categories": [
                        "analytics",
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "Basic tier — usage-based: compute $0.18–$0.29/hour, storage $22.00–$27.50/TB-month (8 GiB × 1 replica; spans all regions).",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Basic tier — usage-based: compute $0.18–$0.29/hour, storage $22.00–$27.50/TB-month (8 GiB × 1 replica; spans all regions).",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "enterprise",
                        "scale",
                        "basic"
                    ]
                },
                {
                    "serviceId": "enterprise",
                    "ref": "clickhouse/enterprise",
                    "description": "ClickHouse Cloud Enterprise — dedicated-infrastructure managed ClickHouse with enhanced support and the largest memory range. Usage-based pricing: compute metered per memory-hour between minReplicaMemoryGb and maxReplicaMemoryGb (times numReplicas), storage per compressed TB-month. Prices vary per (cloud provider, region) pair.",
                    "categories": [
                        "analytics",
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "Enterprise tier — usage-based: compute $0.65–$16.61/hour, storage $22.00–$27.50/TB-month (8–128 GiB × 2 replicas; spans all regions).",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Enterprise tier — usage-based: compute $0.65–$16.61/hour, storage $22.00–$27.50/TB-month (8–128 GiB × 2 replicas; spans all regions).",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "scale",
                        "basic",
                        "enterprise"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "clickhouse",
                    "ref": "clickhouse/clickhouse",
                    "description": "A ClickHouse Cloud service. Provision as many as you need under your active tier; compute and storage are metered by usage and vary by cloud provider and region.",
                    "categories": [
                        "analytics",
                        "database"
                    ],
                    "scope": "account",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "basic",
                            "status": "paid",
                            "price": "Compute and storage are metered by usage and billed under your active Basic plan; see the plan for compute ranges. Rates vary by cloud provider and region.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "scale",
                            "status": "paid",
                            "price": "Compute and storage are metered by usage and billed under your active Scale plan; see the plan for compute ranges. Rates vary by cloud provider and region.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "enterprise",
                            "status": "paid",
                            "price": "Compute and storage are metered by usage and billed under your active Enterprise plan; see the plan for compute ranges. Rates vary by cloud provider and region.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "clickhouse",
                    "envPrefix": "CLICKHOUSE_CLICKHOUSE",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID",
                        "HOST"
                    ],
                    "updateableTo": [
                        "clickhouse"
                    ]
                },
                {
                    "serviceId": "postgres",
                    "ref": "clickhouse/postgres",
                    "description": "Managed Postgres Scale — production-grade fully managed PostgreSQL with configurable VM sizes, high availability, and automatic backups. Free during preview.",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "postgres",
                    "envPrefix": "CLICKHOUSE_POSTGRES",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "postgres"
                    ]
                }
            ]
        },
        {
            "slug": "cloudflare",
            "name": "Cloudflare",
            "url": "https://cloudflare.com",
            "tosUrl": "https://www.cloudflare.com/website-terms/",
            "privacyUrl": "https://www.cloudflare.com/privacypolicy/",
            "iconUrl": "/assets/images/provider-favicons/cloudflare.svg",
            "brandColor": "#f78100",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "CL",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Edge platform for running, securing, and accelerating apps without managing infrastructure. Global network with routing, protection, and performance built in.",
            "categories": [
                "compute",
                "database",
                "ai",
                "browser",
                "cache",
                "domains",
                "queue",
                "storage"
            ],
            "pageUrl": "/marketplace/cloudflare/",
            "searchText": "cloudflare cloudflare edge platform for running, securing, and accelerating apps without managing infrastructure. global network with routing, protection, and performance built in. compute database ai browser cache domains queue storage cloudflare/browser-run cloudflare/containers cloudflare/d1 cloudflare/hyperdrive cloudflare/kv cloudflare/queues cloudflare/r2:bucket cloudflare/registrar:domain cloudflare/workers cloudflare/workers-ai",
            "plans": [
                {
                    "serviceId": "workers:free",
                    "ref": "cloudflare/workers:free",
                    "description": "Shared free plan for Workers-backed deployables such as Workers, KV, Hyperdrive, Queues, D1, Browser Run, and Workers AI.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "workers:paid",
                        "workers:free"
                    ]
                },
                {
                    "serviceId": "workers:paid",
                    "ref": "cloudflare/workers:paid",
                    "description": "Shared paid plan for Workers-backed deployables with a $5/month minimum charge, included usage, and additional charges for usage above the included amounts.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$5/month minimum charge per account with included usage and additional charges for usage above the included amounts.",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$5/month minimum charge per account with included usage and additional charges for usage above the included amounts.",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "workers:free",
                        "workers:paid"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "browser-run",
                    "ref": "cloudflare/browser-run",
                    "description": "Run headless browsers on Cloudflare for screenshots, PDFs, scraping, testing, crawling, and agent workflows.",
                    "categories": [
                        "browser"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "workers:free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "workers:paid",
                            "status": "paid",
                            "price": "Included in the Workers Paid plan. Workers AI pricing includes daily included usage, with additional charges based on usage above the included amount.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "browser-run",
                    "envPrefix": "CLOUDFLARE_BROWSER_RUN",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID"
                    ],
                    "updateableTo": [
                        "workers:free",
                        "workers:paid",
                        "browser-run"
                    ]
                },
                {
                    "serviceId": "containers",
                    "ref": "cloudflare/containers",
                    "description": "Run code written in any programming language, built for any runtime, as part of apps built on Workers.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "workers:paid",
                            "status": "paid",
                            "price": "Available on the Workers Paid plan. Containers usage is billed separately for memory, CPU, disk, and network egress.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "containers",
                    "envPrefix": "CLOUDFLARE_CONTAINERS",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "workers:free",
                        "workers:paid",
                        "containers"
                    ]
                },
                {
                    "serviceId": "d1",
                    "ref": "cloudflare/d1",
                    "description": "Serverless SQL databases with SQLite semantics, Worker and HTTP API access, and built-in point-in-time recovery.",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "workers:free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "workers:paid",
                            "status": "paid",
                            "price": "Included in the Workers Paid plan. Browser Run pricing includes monthly browser hours, with additional charges for browser hours above the included amount and for concurrent browsers when using browser sessions.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "d1",
                    "envPrefix": "CLOUDFLARE_D1",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "workers:free",
                        "workers:paid",
                        "d1"
                    ]
                },
                {
                    "serviceId": "hyperdrive",
                    "ref": "cloudflare/hyperdrive",
                    "description": "Connect Cloudflare Workers to existing Postgres or MySQL databases with connection pooling, query caching, and global acceleration.",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "workers:free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "workers:paid",
                            "status": "paid",
                            "price": "Included in the Workers Paid plan. Queues pricing includes monthly included operations, with additional charges for operations above the included amount.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "hyperdrive",
                    "envPrefix": "CLOUDFLARE_HYPERDRIVE",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "workers:free",
                        "workers:paid",
                        "hyperdrive"
                    ]
                },
                {
                    "serviceId": "kv",
                    "ref": "cloudflare/kv",
                    "description": "Store and read key-value data globally with low latency for configs, caches, and other high-read workloads.",
                    "categories": [
                        "cache"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "workers:free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "workers:paid",
                            "status": "paid",
                            "price": "Included in the Workers Paid plan. KV pricing includes monthly included usage for reads, writes, deletes, list requests, and storage, with additional charges above the included amounts.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "kv",
                    "envPrefix": "CLOUDFLARE_KV",
                    "credentialKeys": [
                        "URL",
                        "TOKEN"
                    ],
                    "updateableTo": [
                        "workers:free",
                        "workers:paid",
                        "kv"
                    ]
                },
                {
                    "serviceId": "queues",
                    "ref": "cloudflare/queues",
                    "description": "Send and receive messages with guaranteed delivery, batching, delays, retries, and dead-letter queues.",
                    "categories": [
                        "queue"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "workers:free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "workers:paid",
                            "status": "paid",
                            "price": "Included in the Workers Paid plan. D1 pricing includes monthly included rows read, rows written, and storage, with additional charges above the included amounts.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "queues",
                    "envPrefix": "CLOUDFLARE_QUEUES",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "workers:free",
                        "workers:paid",
                        "queues"
                    ]
                },
                {
                    "serviceId": "r2:bucket",
                    "ref": "cloudflare/r2:bucket",
                    "description": "Create an R2 bucket with S3-compatible access for object storage, uploads, downloads, and usage-based billing.",
                    "categories": [
                        "storage"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "r2-bucket",
                    "envPrefix": "CLOUDFLARE_R2_BUCKET",
                    "credentialKeys": [
                        "ACCESS_KEY_ID",
                        "SECRET_ACCESS_KEY",
                        "BUCKET"
                    ],
                    "updateableTo": [
                        "r2:bucket"
                    ]
                },
                {
                    "serviceId": "registrar:domain",
                    "ref": "cloudflare/registrar:domain",
                    "description": "Register a domain through Cloudflare Registrar as a one-time purchase. Cloudflare will ask for search keywords, show matching domains, and then register the selected domain.",
                    "categories": [
                        "domains"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "registrar-domain",
                    "envPrefix": "CLOUDFLARE_REGISTRAR_DOMAIN",
                    "credentialKeys": [
                        "API_KEY",
                        "DOMAIN"
                    ],
                    "updateableTo": [
                        "registrar:domain"
                    ]
                },
                {
                    "serviceId": "workers",
                    "ref": "cloudflare/workers",
                    "description": "Build, deploy, and scale serverless apps and APIs across Cloudflare's global network.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "workers:free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "workers:paid",
                            "status": "paid",
                            "price": "Included in the Workers Paid plan. Pricing starts at $5/month per account with included usage and additional charges for usage above the included amounts.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "workers",
                    "envPrefix": "CLOUDFLARE_WORKERS",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "workers:free",
                        "workers:paid",
                        "workers"
                    ]
                },
                {
                    "serviceId": "workers-ai",
                    "ref": "cloudflare/workers-ai",
                    "description": "Run AI models, powered by serverless GPUs, on Cloudflare's global network",
                    "categories": [
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "workers:free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "workers:paid",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "workers-ai",
                    "envPrefix": "CLOUDFLARE_WORKERS_AI",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "workers:free",
                        "workers:paid",
                        "workers-ai"
                    ]
                }
            ]
        },
        {
            "slug": "composio",
            "name": "Composio",
            "url": "https://composio.dev",
            "tosUrl": "https://composio.dev/terms",
            "privacyUrl": "https://composio.dev/privacy",
            "iconUrl": "/assets/images/provider-favicons/composio.svg",
            "brandColor": "#31aaff",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "CO",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Integration platform for AI agents. Connect agents to 250+ tools and apps with managed authentication and execution.",
            "categories": [
                "ai"
            ],
            "pageUrl": "/marketplace/composio/",
            "searchText": "composio composio integration platform for ai agents. connect agents to 250+ tools and apps with managed authentication and execution. ai composio/project",
            "plans": [
                {
                    "serviceId": "hobby",
                    "ref": "composio/hobby",
                    "description": "Composio Hobby plan — free account tier",
                    "categories": [
                        "ai"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "hobby"
                    ]
                },
                {
                    "serviceId": "starter",
                    "ref": "composio/starter",
                    "description": "Composio Starter plan — account-level subscription with higher included usage",
                    "categories": [
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$29/month, includes 200,000 tool calls, then $0.39 per 1,000 tool calls",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$29/month, includes 200,000 tool calls, then $0.39 per 1,000 tool calls",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "starter"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "project",
                    "ref": "composio/project",
                    "description": "Composio project with project-scoped API credentials",
                    "categories": [
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "project",
                    "envPrefix": "COMPOSIO_PROJECT",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "project"
                    ]
                }
            ]
        },
        {
            "slug": "createos",
            "name": "CreateOS",
            "url": "https://createos.ai",
            "tosUrl": "https://createos.ai/terms",
            "privacyUrl": "https://createos.ai/privacy",
            "iconUrl": "/assets/images/provider-favicons/createos.svg",
            "brandColor": "#141414",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "CR",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Compute infrastructure for AI workloads. Provision and manage GPU and CPU resources on demand.",
            "categories": [
                "compute"
            ],
            "pageUrl": "/marketplace/createos/",
            "searchText": "createos createos compute infrastructure for ai workloads. provision and manage gpu and cpu resources on demand. compute createos/project",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "createos/free",
                    "description": "Free tier with basic features.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pro-monthly",
                        "enterprise-monthly",
                        "beginner-monthly",
                        "free"
                    ]
                },
                {
                    "serviceId": "enterprise-monthly",
                    "ref": "createos/enterprise-monthly",
                    "description": "Enterprise plan billed monthly at $200.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$200/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$200/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro-monthly",
                        "beginner-monthly",
                        "free",
                        "enterprise-monthly"
                    ]
                },
                {
                    "serviceId": "beginner-monthly",
                    "ref": "createos/beginner-monthly",
                    "description": "Beginner plan billed monthly at $10.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$10/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$10/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro-monthly",
                        "enterprise-monthly",
                        "free",
                        "beginner-monthly"
                    ]
                },
                {
                    "serviceId": "pro-monthly",
                    "ref": "createos/pro-monthly",
                    "description": "Pro plan billed monthly at $75.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$75/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$75/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "beginner-monthly",
                        "enterprise-monthly",
                        "free",
                        "pro-monthly"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "project",
                    "ref": "createos/project",
                    "description": "Deploy and manage cloud workloads on CreateOS.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "enterprise-monthly",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "beginner-monthly",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro-monthly",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "project",
                    "envPrefix": "CREATEOS_PROJECT",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "project"
                    ]
                }
            ]
        },
        {
            "slug": "customerio",
            "name": "Customer.io",
            "url": "https://customer.io",
            "tosUrl": "https://customer.io/terms",
            "privacyUrl": "https://customer.io/privacy",
            "iconUrl": "/assets/images/provider-favicons/customerio.svg",
            "brandColor": "#0b353b",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "CU",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Automated messaging platform for targeted emails, push notifications, SMS, and in-app messages based on user behavior.",
            "categories": [
                "email",
                "messaging",
                "notification"
            ],
            "pageUrl": "/marketplace/customerio/",
            "searchText": "customer.io customerio automated messaging platform for targeted emails, push notifications, sms, and in-app messages based on user behavior. email messaging notification customerio/workspace",
            "plans": [
                {
                    "serviceId": "builder:sandbox",
                    "ref": "customerio/builder:sandbox",
                    "description": "Unlimited email sends in sandbox mode to up to 10 verified recipients. Test your integration and build your product.",
                    "categories": [
                        "notification",
                        "email",
                        "messaging"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "builder",
                        "builder:sandbox"
                    ]
                },
                {
                    "serviceId": "builder",
                    "ref": "customerio/builder",
                    "description": "Production messaging for email, in app messages, push notifications, and webhooks. Add funds to start sending.",
                    "categories": [
                        "notification",
                        "email",
                        "messaging"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "Message funding amount in USD ($10 = 25,000 messages)",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Message funding amount in USD ($10 = 25,000 messages)",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "builder"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "workspace",
                    "ref": "customerio/workspace",
                    "description": "Customer.io workspace — multi-channel messaging for email, push, SMS, and webhooks.",
                    "categories": [
                        "notification",
                        "email",
                        "messaging"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "builder:sandbox",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "builder",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "workspace",
                    "envPrefix": "CUSTOMERIO_WORKSPACE",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "workspace"
                    ]
                }
            ]
        },
        {
            "slug": "datadog",
            "name": "Datadog",
            "url": "https://datadoghq.com",
            "tosUrl": "https://datadoghq.com/terms",
            "privacyUrl": "https://datadoghq.com/privacy",
            "iconUrl": null,
            "brandColor": "#632ca6",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "DA",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Cloud-scale monitoring and security platform. Unified observability for infrastructure, applications, logs, and more.",
            "categories": [
                "observability"
            ],
            "pageUrl": "/marketplace/datadog/",
            "searchText": "datadog datadog cloud-scale monitoring and security platform. unified observability for infrastructure, applications, logs, and more. observability datadog/observability",
            "plans": [
                {
                    "serviceId": "trial",
                    "ref": "datadog/trial",
                    "description": "14-day Datadog trial",
                    "categories": [
                        "observability"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pay-as-you-go",
                        "trial"
                    ]
                },
                {
                    "serviceId": "pay-as-you-go",
                    "ref": "datadog/pay-as-you-go",
                    "description": "Pay-as-you-go Datadog plan",
                    "categories": [
                        "observability"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "See datadoghq.com/pricing for details",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "See datadoghq.com/pricing for details",
                            "status": "paid",
                            "description": "",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pay-as-you-go"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "observability",
                    "ref": "datadog/observability",
                    "description": "Project-level Datadog Observability",
                    "categories": [
                        "observability"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "pay-as-you-go",
                            "status": "paid",
                            "price": "See datadoghq.com/pricing for details",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "trial",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "observability",
                    "envPrefix": "DATADOG_OBSERVABILITY",
                    "credentialKeys": [
                        "API_KEY",
                        "DSN"
                    ],
                    "updateableTo": [
                        "observability"
                    ]
                }
            ]
        },
        {
            "slug": "daytona",
            "name": "Daytona",
            "url": "https://daytona.io",
            "tosUrl": "https://daytona.io/terms",
            "privacyUrl": "https://daytona.io/privacy",
            "iconUrl": "/assets/images/provider-favicons/daytona.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "DA",
            "entry": {
                "status": "paid",
                "label": "$500/mo in Daytona credits"
            },
            "description": "Secure, elastic sandbox infrastructure for AI agents. Complete, isolated, and fully programmable environments spun up on demand for agentic workflows and pipelines at scale.",
            "categories": [
                "ai",
                "compute",
                "sandbox"
            ],
            "pageUrl": "/marketplace/daytona/",
            "searchText": "daytona daytona secure, elastic sandbox infrastructure for ai agents. complete, isolated, and fully programmable environments spun up on demand for agentic workflows and pipelines at scale. ai compute sandbox daytona/sandbox",
            "plans": [
                {
                    "serviceId": "top-up-0500",
                    "ref": "daytona/top-up-0500",
                    "description": "Add $500/mo in Daytona credits for compute usage.",
                    "categories": [
                        "compute",
                        "ai",
                        "sandbox"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$500/mo in Daytona credits",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$500/mo in Daytona credits",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "top-up-1000",
                        "top-up-2000",
                        "top-up-0025",
                        "top-up-0500"
                    ]
                },
                {
                    "serviceId": "top-up-1000",
                    "ref": "daytona/top-up-1000",
                    "description": "Add $1000/mo in Daytona credits for compute usage.",
                    "categories": [
                        "compute",
                        "ai",
                        "sandbox"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$1000/mo in Daytona credits",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$1000/mo in Daytona credits",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "top-up-0025",
                        "top-up-2000",
                        "top-up-0500",
                        "top-up-1000"
                    ]
                },
                {
                    "serviceId": "top-up-0025",
                    "ref": "daytona/top-up-0025",
                    "description": "Add $25/mo in Daytona credits for compute usage.",
                    "categories": [
                        "compute",
                        "ai",
                        "sandbox"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$25/mo in Daytona credits",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$25/mo in Daytona credits",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "top-up-1000",
                        "top-up-2000",
                        "top-up-0500",
                        "top-up-0025"
                    ]
                },
                {
                    "serviceId": "top-up-2000",
                    "ref": "daytona/top-up-2000",
                    "description": "Add $2000/mo in Daytona credits for compute usage.",
                    "categories": [
                        "compute",
                        "ai",
                        "sandbox"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$2000/mo in Daytona credits",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$2000/mo in Daytona credits",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "top-up-1000",
                        "top-up-0025",
                        "top-up-0500",
                        "top-up-2000"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "sandbox",
                    "ref": "daytona/sandbox",
                    "description": "Daytona Sandbox - cloud compute environment for AI agents and developers. New accounts receive $100 in free credits.",
                    "categories": [
                        "compute",
                        "ai",
                        "sandbox"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "top-up-1000",
                            "status": "paid",
                            "price": "Usage-based: vCPU $0.0504/h, RAM $0.0162/GiB/h, Storage $0.000108/GiB/h (5 GiB free)",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "top-up-0025",
                            "status": "paid",
                            "price": "Usage-based: vCPU $0.0504/h, RAM $0.0162/GiB/h, Storage $0.000108/GiB/h (5 GiB free)",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "top-up-0500",
                            "status": "paid",
                            "price": "Usage-based: vCPU $0.0504/h, RAM $0.0162/GiB/h, Storage $0.000108/GiB/h (5 GiB free)",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "top-up-2000",
                            "status": "paid",
                            "price": "Usage-based: vCPU $0.0504/h, RAM $0.0162/GiB/h, Storage $0.000108/GiB/h (5 GiB free)",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "sandbox",
                    "envPrefix": "DAYTONA_SANDBOX",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "sandbox"
                    ]
                }
            ]
        },
        {
            "slug": "depot",
            "name": "Depot",
            "url": "https://depot.dev",
            "tosUrl": "https://depot.dev/terms",
            "privacyUrl": "https://depot.dev/privacy",
            "iconUrl": "/assets/images/provider-favicons/depot.svg",
            "brandColor": "#589b54",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "DE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Fast CI/CD infrastructure. Accelerate container builds and CI pipelines with managed remote builders and caching.",
            "categories": [
                "cache",
                "ci",
                "compute"
            ],
            "pageUrl": "/marketplace/depot/",
            "searchText": "depot depot fast ci/cd infrastructure. accelerate container builds and ci pipelines with managed remote builders and caching. cache ci compute depot/api",
            "plans": [
                {
                    "serviceId": "startup-plan",
                    "ref": "depot/startup-plan",
                    "description": "Depot Startup plan for accelerated builds, CI runners, and build cache.",
                    "categories": [
                        "compute",
                        "cache",
                        "ci"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "Starting at $200/month plus pay-as-you-go usage.",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Starting at $200/month plus pay-as-you-go usage.",
                            "status": "paid",
                            "description": "Startup plan",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "developer-plan",
                        "startup-plan"
                    ]
                },
                {
                    "serviceId": "developer-plan",
                    "ref": "depot/developer-plan",
                    "description": "Depot Developer plan for accelerated builds, CI runners, and build cache.",
                    "categories": [
                        "compute",
                        "cache",
                        "ci"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "Starting at $20/month plus pay-as-you-go usage.",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Starting at $20/month plus pay-as-you-go usage.",
                            "status": "paid",
                            "description": "Developer plan",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "startup-plan",
                        "developer-plan"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "api",
                    "ref": "depot/api",
                    "description": "Depot API access for automating builds, CI runners, cache, and sandbox workflows.",
                    "categories": [
                        "compute",
                        "cache",
                        "ci"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "developer-plan",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "startup-plan",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "api",
                    "envPrefix": "DEPOT_API",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "api"
                    ]
                }
            ]
        },
        {
            "slug": "e2b",
            "name": "E2B",
            "url": "https://e2b.dev",
            "tosUrl": "https://e2b.dev/terms",
            "privacyUrl": "https://e2b.dev/privacy",
            "iconUrl": "/assets/images/provider-favicons/e2b.svg",
            "brandColor": "#ff3001",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "E2",
            "entry": {
                "status": "paid",
                "label": "Usage-based pricing"
            },
            "description": "Cloud sandboxes for AI agents and apps. Spin up secure, isolated environments for code execution in milliseconds.",
            "categories": [
                "compute",
                "sandbox"
            ],
            "pageUrl": "/marketplace/e2b/",
            "searchText": "e2b e2b cloud sandboxes for ai agents and apps. spin up secure, isolated environments for code execution in milliseconds. compute sandbox e2b/sandbox",
            "plans": [
                {
                    "serviceId": "hobby",
                    "ref": "e2b/hobby",
                    "description": "E2B Hobby plan for pay-as-you-go sandbox usage.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "Usage-based pricing",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Usage-based pricing",
                            "status": "paid",
                            "description": "No monthly fee. Pay-as-you-go sandbox usage with Hobby limits.",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro",
                        "hobby"
                    ]
                },
                {
                    "serviceId": "pro",
                    "ref": "e2b/pro",
                    "description": "Monthly E2B Pro plan plus pay-as-you-go usage.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$150/month plus usage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$150/month plus usage",
                            "status": "paid",
                            "description": "Pro subscription and usage are billed by E2B.",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "hobby",
                        "pro"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "sandbox",
                    "ref": "e2b/sandbox",
                    "description": "Team-scoped E2B API access for creating and managing cloud sandboxes.",
                    "categories": [
                        "compute",
                        "sandbox"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "hobby",
                            "status": "paid",
                            "price": "Hobby: $0/month plus usage",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "Pro: $150/month plus usage",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "sandbox",
                    "envPrefix": "E2B_SANDBOX",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "sandbox"
                    ]
                }
            ]
        },
        {
            "slug": "elevenlabs",
            "name": "ElevenLabs",
            "url": "https://elevenlabs.io",
            "tosUrl": "https://elevenlabs.io/terms",
            "privacyUrl": "https://elevenlabs.io/privacy",
            "iconUrl": "/assets/images/provider-favicons/elevenlabs.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "EL",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "AI tools for generating human-like speech, voice cloning, and audio content to make communication and creation seamless.",
            "categories": [
                "ai"
            ],
            "pageUrl": "/marketplace/elevenlabs/",
            "searchText": "elevenlabs elevenlabs ai tools for generating human-like speech, voice cloning, and audio content to make communication and creation seamless. ai elevenlabs/tts",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "tts",
                    "ref": "elevenlabs/tts",
                    "description": "ElevenLabs Text-to-Speech API",
                    "categories": [
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "tts",
                    "envPrefix": "ELEVENLABS_TTS",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "tts"
                    ]
                }
            ]
        },
        {
            "slug": "exa",
            "name": "Exa",
            "url": "https://exa.ai",
            "tosUrl": "https://exa.ai/terms",
            "privacyUrl": "https://exa.ai/privacy",
            "iconUrl": "/assets/images/provider-favicons/exa.svg",
            "brandColor": "#0143d9",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "EX",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "AI-native search engine that understands meaning, not just keywords. Build search and retrieval into AI applications.",
            "categories": [
                "ai",
                "search"
            ],
            "pageUrl": "/marketplace/exa/",
            "searchText": "exa exa ai-native search engine that understands meaning, not just keywords. build search and retrieval into ai applications. ai search exa/api",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "exa/free",
                    "description": "Exa API — free tier (no payment method required).",
                    "categories": [
                        "search",
                        "ai"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pay_as_you_go",
                        "free"
                    ]
                },
                {
                    "serviceId": "pay_as_you_go",
                    "ref": "exa/pay_as_you_go",
                    "description": "Exa API — usage-based pay-as-you-go (no monthly minimum).",
                    "categories": [
                        "search",
                        "ai"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "Search $7/1k · Deep Search $12–$15/1k · Contents $1/1k pages. See exa.ai/pricing.",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Search $7/1k · Deep Search $12–$15/1k · Contents $1/1k pages. See exa.ai/pricing.",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "free",
                        "pay_as_you_go"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "api",
                    "ref": "exa/api",
                    "description": "Exa - the fastest, most accurate web search API.",
                    "categories": [
                        "search",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "pay_as_you_go",
                            "status": "paid",
                            "price": "Search $7/1k · Deep Search $12–$15/1k · Contents $1/1k pages. See exa.ai/pricing.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "api",
                    "envPrefix": "EXA_API",
                    "credentialKeys": [
                        "API_KEY",
                        "APP_ID"
                    ],
                    "updateableTo": [
                        "api"
                    ]
                }
            ]
        },
        {
            "slug": "firecrawl",
            "name": "Firecrawl",
            "url": "https://firecrawl.dev",
            "tosUrl": "https://firecrawl.dev/terms",
            "privacyUrl": "https://firecrawl.dev/privacy",
            "iconUrl": "/assets/images/provider-favicons/firecrawl.svg",
            "brandColor": "#fa5d19",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "FI",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Web scraping and crawling API that turns any website into clean, structured data for AI apps. Supports JS rendering, markdown output, and LLM-ready formatting.",
            "categories": [
                "search"
            ],
            "pageUrl": "/marketplace/firecrawl/",
            "searchText": "firecrawl firecrawl web scraping and crawling api that turns any website into clean, structured data for ai apps. supports js rendering, markdown output, and llm-ready formatting. search firecrawl/api",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "firecrawl/free",
                    "description": "Firecrawl free tier — limited API usage (no card; same workspace API key as paid).",
                    "categories": [
                        "search"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "hobby",
                        "api",
                        "growth",
                        "standard",
                        "free"
                    ]
                },
                {
                    "serviceId": "growth",
                    "ref": "firecrawl/growth",
                    "description": "Firecrawl Growth — paid credits for scrape, crawl, extract, and other features (pick monthly or yearly).",
                    "categories": [
                        "search"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$399.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "interval": "Monthly"
                            },
                            "label": "Monthly",
                            "price": "$399.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "interval": "Yearly"
                            },
                            "label": "Yearly",
                            "price": "$3,990.00 per year",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "hobby",
                        "api",
                        "standard",
                        "free",
                        "growth"
                    ]
                },
                {
                    "serviceId": "hobby",
                    "ref": "firecrawl/hobby",
                    "description": "Firecrawl Hobby — paid credits for scrape, crawl, extract, and other features (pick monthly or yearly).",
                    "categories": [
                        "search"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$19.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "interval": "Monthly"
                            },
                            "label": "Monthly",
                            "price": "$19.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "interval": "Yearly"
                            },
                            "label": "Yearly",
                            "price": "$190.00 per year",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "api",
                        "growth",
                        "standard",
                        "free",
                        "hobby"
                    ]
                },
                {
                    "serviceId": "standard",
                    "ref": "firecrawl/standard",
                    "description": "Firecrawl Standard — paid credits for scrape, crawl, extract, and other features (pick monthly or yearly).",
                    "categories": [
                        "search"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$99.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "interval": "Monthly"
                            },
                            "label": "Monthly",
                            "price": "$99.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "interval": "Yearly"
                            },
                            "label": "Yearly",
                            "price": "$990.00 per year",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "hobby",
                        "api",
                        "growth",
                        "free",
                        "standard"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "api",
                    "ref": "firecrawl/api",
                    "description": "Firecrawl API — search, scrape, and extract the web into LLM-ready data (workspace API access).",
                    "categories": [
                        "search"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": true
                        },
                        {
                            "planServiceId": "standard",
                            "status": "paid",
                            "price": "Paid Firecrawl plans: pick hobby, standard, or growth, then monthly or yearly billing.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "growth",
                            "status": "paid",
                            "price": "Paid Firecrawl plans: pick hobby, standard, or growth, then monthly or yearly billing.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "hobby",
                            "status": "paid",
                            "price": "Paid Firecrawl plans: pick hobby, standard, or growth, then monthly or yearly billing.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "api",
                    "envPrefix": "FIRECRAWL_API",
                    "credentialKeys": [
                        "API_KEY",
                        "APP_ID"
                    ],
                    "updateableTo": [
                        "hobby",
                        "growth",
                        "standard",
                        "free",
                        "api"
                    ]
                }
            ]
        },
        {
            "slug": "flyio",
            "name": "Fly.io",
            "url": "https://fly.io",
            "tosUrl": "https://fly.io/terms",
            "privacyUrl": "https://fly.io/privacy",
            "iconUrl": "/assets/images/provider-favicons/flyio.svg",
            "brandColor": "#24175b",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "FL",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Deploy full-stack apps and databases globally on fast hardware with low-latency networking and built-in Postgres and Redis.",
            "categories": [
                "compute",
                "database"
            ],
            "pageUrl": "/marketplace/flyio/",
            "searchText": "fly.io flyio deploy full-stack apps and databases globally on fast hardware with low-latency networking and built-in postgres and redis. compute database flyio/app flyio/mpg flyio/sprite",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "app",
                    "ref": "flyio/app",
                    "description": "Deploy and run your applications globally",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "app",
                    "envPrefix": "FLYIO_APP",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "app"
                    ]
                },
                {
                    "serviceId": "mpg",
                    "ref": "flyio/mpg",
                    "description": "Managed PostgreSQL — high-availability clusters with automatic failover, daily backups, and connection pooling via PgBouncer.",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "plan": "basic"
                            },
                            "label": "basic",
                            "price": "$38/month, $0.28/GB storage/month (starting at 10 GB, auto-growing); bandwidth: same-region free, cross-region $0.006/GB (North America & Europe), $0.015/GB (Asia Pacific, Oceania & South America), $0.050/GB (Africa & India)",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "plan": "starter"
                            },
                            "label": "starter",
                            "price": "$72/month, $0.28/GB storage/month (starting at 10 GB, auto-growing); bandwidth: same-region free, cross-region $0.006/GB (North America & Europe), $0.015/GB (Asia Pacific, Oceania & South America), $0.050/GB (Africa & India)",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "plan": "launch"
                            },
                            "label": "launch",
                            "price": "$282/month, $0.28/GB storage/month (starting at 10 GB, auto-growing); bandwidth: same-region free, cross-region $0.006/GB (North America & Europe), $0.015/GB (Asia Pacific, Oceania & South America), $0.050/GB (Africa & India)",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-3",
                            "configuration": {
                                "plan": "scale"
                            },
                            "label": "scale",
                            "price": "$962/month, $0.28/GB storage/month (starting at 10 GB, auto-growing); bandwidth: same-region free, cross-region $0.006/GB (North America & Europe), $0.015/GB (Asia Pacific, Oceania & South America), $0.050/GB (Africa & India)",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-4",
                            "configuration": {
                                "plan": "Performance"
                            },
                            "label": "Performance",
                            "price": "$1922/month, $0.28/GB storage/month (starting at 10 GB, auto-growing); bandwidth: same-region free, cross-region $0.006/GB (North America & Europe), $0.015/GB (Asia Pacific, Oceania & South America), $0.050/GB (Africa & India)",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Usage-based",
                    "defaultResourceName": "mpg",
                    "envPrefix": "FLYIO_MPG",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "mpg"
                    ]
                },
                {
                    "serviceId": "sprite",
                    "ref": "flyio/sprite",
                    "description": "Stateful sandbox environments with checkpoint & restore",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "sprite",
                    "envPrefix": "FLYIO_SPRITE",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "sprite"
                    ]
                }
            ]
        },
        {
            "slug": "gitlab",
            "name": "GitLab",
            "url": "https://gitlab.com",
            "tosUrl": "https://gitlab.com/terms",
            "privacyUrl": "https://gitlab.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/gitlab.svg",
            "brandColor": "#fc6d26",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "GI",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Intelligent DevSecOps orchestration platform that increases developer productivity, improves operational efficiency, and reduces security and compliance risk.",
            "categories": [
                "ai",
                "analytics",
                "cdn",
                "ci",
                "compute",
                "observability",
                "storage"
            ],
            "pageUrl": "/marketplace/gitlab/",
            "searchText": "gitlab gitlab intelligent devsecops orchestration platform that increases developer productivity, improves operational efficiency, and reduces security and compliance risk. ai analytics cdn ci compute observability storage gitlab/project",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "project",
                    "ref": "gitlab/project",
                    "description": "GitLab project with built-in CI/CD, container registry, and collaboration tools",
                    "categories": [
                        "analytics",
                        "compute",
                        "ci",
                        "ai",
                        "storage",
                        "cdn",
                        "observability"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "project",
                    "envPrefix": "GITLAB_PROJECT",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID",
                        "HOST"
                    ],
                    "updateableTo": [
                        "project"
                    ]
                }
            ]
        },
        {
            "slug": "herenow",
            "name": "herenow",
            "url": "https://here.now",
            "tosUrl": "https://here.now/terms",
            "privacyUrl": "https://here.now/privacy",
            "iconUrl": null,
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "HE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Instant web hosting for agents. Publish HTML, files, and full sites to live URLs at {slug}.here.now, with custom domains, version history, and access controls.",
            "categories": [
                "cdn",
                "storage"
            ],
            "pageUrl": "/marketplace/herenow/",
            "searchText": "herenow herenow instant web hosting for agents. publish html, files, and full sites to live urls at {slug}.here.now, with custom domains, version history, and access controls. cdn storage herenow/hosting",
            "plans": [
                {
                    "serviceId": "developer",
                    "ref": "herenow/developer",
                    "description": "here.now Developer plan — $20/month: unlimited sites, 2 TB storage, 20 custom domains, vanity subdomain namespaces, and a higher publish rate limit.",
                    "categories": [
                        "cdn"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$20.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$20.00 per month",
                            "status": "paid",
                            "description": "$20 per month",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "hobby",
                        "developer"
                    ]
                },
                {
                    "serviceId": "hobby",
                    "ref": "herenow/hobby",
                    "description": "here.now Hobby plan — $4/month: up to 1,000 sites, 500 GB storage, 5 custom domains, vanity subdomain namespaces, and a higher publish rate limit.",
                    "categories": [
                        "cdn"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$4.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$4.00 per month",
                            "status": "paid",
                            "description": "$4 per month",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "developer",
                        "hobby"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "hosting",
                    "ref": "herenow/hosting",
                    "description": "here.now hosting — publish HTML, files, and full sites to live URLs at {slug}.here.now via the here.now API. Provisions an API key synced as HERENOW_API_KEY.",
                    "categories": [
                        "storage",
                        "cdn"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "hobby",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "developer",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "hosting",
                    "envPrefix": "HERENOW_HOSTING",
                    "credentialKeys": [
                        "ACCESS_KEY_ID",
                        "SECRET_ACCESS_KEY",
                        "BUCKET"
                    ],
                    "updateableTo": [
                        "hosting"
                    ]
                }
            ]
        },
        {
            "slug": "heygen",
            "name": "HeyGen",
            "url": "https://heygen.com",
            "tosUrl": "https://heygen.com/terms",
            "privacyUrl": "https://heygen.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/heygen.svg",
            "brandColor": "#0079ff",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "HE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "AI video generation platform for creating personalized talking-head videos, avatars, and translations at scale.",
            "categories": [
                "ai"
            ],
            "pageUrl": "/marketplace/heygen/",
            "searchText": "heygen heygen ai video generation platform for creating personalized talking-head videos, avatars, and translations at scale. ai heygen/api",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "api",
                    "ref": "heygen/api",
                    "description": "Programmatic access to HeyGen's AI video generation platform. Create avatar videos, translate videos, generate text-to-speech, and more.",
                    "categories": [
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "api",
                    "envPrefix": "HEYGEN_API",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "api"
                    ]
                }
            ]
        },
        {
            "slug": "huggingface",
            "name": "Hugging Face",
            "url": "https://huggingface.co",
            "tosUrl": "https://huggingface.co/terms",
            "privacyUrl": "https://huggingface.co/privacy",
            "iconUrl": "/assets/images/provider-favicons/huggingface.svg",
            "brandColor": "#ffd21e",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": true,
            "fallbackInitials": "HF",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "ML platform for hosting, training, and deploying models and datasets. Access thousands of open-source models and run inference with a simple API.",
            "categories": [
                "ai",
                "compute",
                "storage"
            ],
            "pageUrl": "/marketplace/huggingface/",
            "searchText": "hugging face huggingface ml platform for hosting, training, and deploying models and datasets. access thousands of open-source models and run inference with a simple api. ai compute storage huggingface/bucket huggingface/platform",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "huggingface/free",
                    "description": "Free — access the Hugging Face platform at zero cost, no credit card required. Includes a free usage quota. Optional pay-as-you-go auto top-up can be enabled to bill usage above quota via a shared payment token. See https://huggingface.co/pricing",
                    "categories": [
                        "ai"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pro",
                        "free"
                    ]
                },
                {
                    "serviceId": "pro",
                    "ref": "huggingface/pro",
                    "description": "Pro — paid Hugging Face plan for higher limits and advanced features. Includes a generous monthly usage quota. Optional pay-as-you-go auto top-up can be enabled to bill usage above quota via a shared payment token. Requires a shared payment token. See https://huggingface.co/pricing",
                    "categories": [
                        "ai"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "Recurring monthly subscription. See https://huggingface.co/pricing for current rates and limits.",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Recurring monthly subscription. See https://huggingface.co/pricing for current rates and limits.",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "free",
                        "pro"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "bucket",
                    "ref": "huggingface/bucket",
                    "description": "Create a Storage Bucket for your data",
                    "categories": [
                        "ai",
                        "storage"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "paid",
                            "price": "Free tier storage included with the Free plan; additional storage is only billed if pay-as-you-go auto top-up is enabled on the plan, otherwise writes stop once the quota is depleted. See https://huggingface.co/pricing for current rates.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "Pro tier storage included with the Pro plan subscription; additional storage is only billed if pay-as-you-go auto top-up is enabled on the plan, otherwise writes stop once the quota is depleted. See https://huggingface.co/pricing for current rates.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "bucket",
                    "envPrefix": "HUGGINGFACE_BUCKET",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "bucket"
                    ]
                },
                {
                    "serviceId": "platform",
                    "ref": "huggingface/platform",
                    "description": "Full access to the Hugging Face platform: models, datasets, GPU compute, and inference",
                    "categories": [
                        "compute",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "paid",
                            "price": "Free tier quota included with the Free plan; additional usage is only billed if pay-as-you-go auto top-up is enabled on the plan, otherwise the service stops once the quota is depleted. See https://huggingface.co/pricing for current rates.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "Pro tier quota included with the Pro plan subscription; additional usage is only billed if pay-as-you-go auto top-up is enabled on the plan, otherwise the service stops once the quota is depleted. See https://huggingface.co/pricing for current rates.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "platform",
                    "envPrefix": "HUGGINGFACE_PLATFORM",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "platform"
                    ]
                }
            ]
        },
        {
            "slug": "inngest",
            "name": "Inngest",
            "url": "https://inngest.com",
            "tosUrl": "https://inngest.com/terms",
            "privacyUrl": "https://inngest.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/inngest.svg",
            "brandColor": "#292524",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "IN",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Event-driven platform for background jobs, scheduled tasks, and long-running AI workflows with built-in retries, step functions, and full observability.",
            "categories": [
                "queue"
            ],
            "pageUrl": "/marketplace/inngest/",
            "searchText": "inngest inngest event-driven platform for background jobs, scheduled tasks, and long-running ai workflows with built-in retries, step functions, and full observability. queue inngest/app",
            "plans": [
                {
                    "serviceId": "hobby",
                    "ref": "inngest/hobby",
                    "description": "Inngest free tier - includes up to 50,000 function executions/month, unlimited functions, and all core features including retries, scheduling, fan-out, throttling, and debounce.",
                    "categories": [
                        "queue"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pro",
                        "hobby"
                    ]
                },
                {
                    "serviceId": "pro",
                    "ref": "inngest/pro",
                    "description": "Inngest Pro - production-grade durable workflow engine. Includes 1M function executions/month, 7 day traces and metrics retention, 100+ concurrency executions.",
                    "categories": [
                        "queue"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$99.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$99.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro",
                        "hobby"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "app",
                    "ref": "inngest/app",
                    "description": "An Inngest app for deploying reliable production workflows",
                    "categories": [
                        "queue"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "hobby",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "app",
                    "envPrefix": "INNGEST_APP",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "app"
                    ]
                }
            ]
        },
        {
            "slug": "kernel",
            "name": "KERNEL",
            "url": "https://www.kernel.sh/",
            "tosUrl": "https://www.kernel.sh/terms",
            "privacyUrl": "https://www.kernel.sh/privacy",
            "iconUrl": "/assets/images/provider-favicons/kernel.svg",
            "brandColor": "#81b300",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "KE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "AI-native browser infrastructure for building agents that browse, interact with, and extract data from the web.",
            "categories": [
                "browser",
                "ai"
            ],
            "pageUrl": "/marketplace/kernel/",
            "searchText": "kernel kernel ai-native browser infrastructure for building agents that browse, interact with, and extract data from the web. browser ai kernel/project",
            "plans": [
                {
                    "serviceId": "developer",
                    "ref": "kernel/developer",
                    "description": "Developer (Free) - $5/mo free credits, 5 concurrent browsers",
                    "categories": [
                        "browser"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "startup",
                        "hobbyist",
                        "developer"
                    ]
                },
                {
                    "serviceId": "startup",
                    "ref": "kernel/startup",
                    "description": "Start-Up - $200/mo, $50 free credits, 150 concurrent browsers",
                    "categories": [
                        "browser"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$200/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$200/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "developer",
                        "hobbyist",
                        "startup"
                    ]
                },
                {
                    "serviceId": "hobbyist",
                    "ref": "kernel/hobbyist",
                    "description": "Hobbyist - $30/mo, $10 free credits, 10 concurrent browsers",
                    "categories": [
                        "browser"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$30/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$30/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "startup",
                        "developer",
                        "hobbyist"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "project",
                    "ref": "kernel/project",
                    "description": "Kernel project + API key for the full platform: cloud browsers, serverless agent apps, managed auth, proxies, pools, and observability",
                    "categories": [
                        "browser",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "developer",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "startup",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "hobbyist",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "project",
                    "envPrefix": "KERNEL_PROJECT",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID"
                    ],
                    "updateableTo": [
                        "project"
                    ]
                }
            ]
        },
        {
            "slug": "laravelcloud",
            "name": "Laravel Cloud",
            "url": "https://cloud.laravel.com",
            "tosUrl": "https://cloud.laravel.com/terms",
            "privacyUrl": "https://cloud.laravel.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/laravelcloud.svg",
            "brandColor": "#0057ff",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "LC",
            "entry": {
                "status": "paid",
                "label": "$20/mo + usage"
            },
            "description": "Managed cloud platform for Laravel apps with built-in hosting, caching, databases, and queue workers.",
            "categories": [
                "compute",
                "cache",
                "database"
            ],
            "pageUrl": "/marketplace/laravelcloud/",
            "searchText": "laravel cloud laravelcloud managed cloud platform for laravel apps with built-in hosting, caching, databases, and queue workers. compute cache database laravelcloud/application laravelcloud/mysql laravelcloud/valkey",
            "plans": [
                {
                    "serviceId": "growth",
                    "ref": "laravelcloud/growth",
                    "description": "Growth — $20/mo + usage",
                    "categories": [
                        "compute"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$20/mo + usage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$20/mo + usage",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "starter",
                        "growth"
                    ]
                },
                {
                    "serviceId": "starter",
                    "ref": "laravelcloud/starter",
                    "description": "Starter — $5/mo + usage",
                    "categories": [
                        "compute"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$5/mo + usage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$5/mo + usage",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "growth",
                        "starter"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "application",
                    "ref": "laravelcloud/application",
                    "description": "Laravel application with a default production environment.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "growth",
                            "status": "paid",
                            "price": "From $6/mo + usage",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "starter",
                            "status": "paid",
                            "price": "From $6/mo + usage",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "application",
                    "envPrefix": "LARAVELCLOUD_APPLICATION",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "application"
                    ]
                },
                {
                    "serviceId": "mysql",
                    "ref": "laravelcloud/mysql",
                    "description": "Managed MySQL database with automated backups and point-in-time recovery.",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "growth",
                            "status": "paid",
                            "price": "From $6.60/mo + usage",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "starter",
                            "status": "paid",
                            "price": "From $6.60/mo + usage",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "mysql",
                    "envPrefix": "LARAVELCLOUD_MYSQL",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "mysql"
                    ]
                },
                {
                    "serviceId": "valkey",
                    "ref": "laravelcloud/valkey",
                    "description": "Managed Valkey cache for session storage, queues, and application caching.",
                    "categories": [
                        "cache"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "growth",
                            "status": "paid",
                            "price": "From $6/mo + usage",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "starter",
                            "status": "paid",
                            "price": "From $6/mo + usage",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "valkey",
                    "envPrefix": "LARAVELCLOUD_VALKEY",
                    "credentialKeys": [
                        "URL",
                        "TOKEN"
                    ],
                    "updateableTo": [
                        "valkey"
                    ]
                }
            ]
        },
        {
            "slug": "metronome",
            "name": "Metronome",
            "url": "https://metronome.com",
            "tosUrl": "https://metronome.com/terms",
            "privacyUrl": "https://metronome.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/metronome.svg",
            "brandColor": "#aee671",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": true,
            "fallbackInitials": "ME",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Usage-based billing infrastructure for SaaS. Meter, price, and invoice based on real product consumption.",
            "categories": [
                "payments"
            ],
            "pageUrl": "/marketplace/metronome/",
            "searchText": "metronome metronome usage-based billing infrastructure for saas. meter, price, and invoice based on real product consumption. payments metronome/sandbox",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "sandbox",
                    "ref": "metronome/sandbox",
                    "description": "Metronome sandbox - usage-based billing platform that provides real-time metering, pricing, billing, and reporting",
                    "categories": [
                        "payments"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "sandbox",
                    "envPrefix": "METRONOME_SANDBOX",
                    "credentialKeys": [
                        "API_KEY",
                        "WEBHOOK_SECRET"
                    ],
                    "updateableTo": [
                        "sandbox"
                    ]
                }
            ]
        },
        {
            "slug": "mixpanel",
            "name": "Mixpanel",
            "url": "https://mixpanel.com",
            "tosUrl": "https://mixpanel.com/terms",
            "privacyUrl": "https://mixpanel.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/mixpanel.svg",
            "brandColor": "#7856ff",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "MI",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Event-based analytics for tracking user actions, building conversion funnels, and measuring retention to make data-driven product decisions.",
            "categories": [
                "analytics"
            ],
            "pageUrl": "/marketplace/mixpanel/",
            "searchText": "mixpanel mixpanel event-based analytics for tracking user actions, building conversion funnels, and measuring retention to make data-driven product decisions. analytics mixpanel/analytics",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "mixpanel/free",
                    "description": "Product analytics up to 1M events and 10k session replays per month",
                    "categories": [
                        "analytics"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "growth",
                        "free"
                    ]
                },
                {
                    "serviceId": "growth",
                    "ref": "mixpanel/growth",
                    "description": "Product analytics starting at 1M events and 20k session replays per month",
                    "categories": [
                        "analytics"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "Starts at $0/month for 1M events, then $0.28 per 1k events",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Starts at $0/month for 1M events, then $0.28 per 1k events",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "free",
                        "growth"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "analytics",
                    "ref": "mixpanel/analytics",
                    "description": "Product analytics for builders. See what users do. Know what's working. Decide what to build next.",
                    "categories": [
                        "analytics"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "growth",
                            "status": "paid",
                            "price": "Starts at $0/month for 1M events, then $0.28 per 1k events",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "analytics",
                    "envPrefix": "MIXPANEL_ANALYTICS",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID",
                        "HOST"
                    ],
                    "updateableTo": [
                        "analytics"
                    ]
                }
            ]
        },
        {
            "slug": "neon",
            "name": "Neon",
            "url": "https://neon.tech",
            "tosUrl": "https://neon.tech/terms",
            "privacyUrl": "https://neon.tech/privacy",
            "iconUrl": "/assets/images/provider-favicons/neon.svg",
            "brandColor": "#34d59a",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "NE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Serverless Postgres with instant provisioning, autoscaling, and database branching.",
            "categories": [
                "database",
                "auth"
            ],
            "pageUrl": "/marketplace/neon/",
            "searchText": "neon neon serverless postgres with instant provisioning, autoscaling, and database branching. database auth neon/postgres",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "neon/free",
                    "description": "Neon Free — serverless Postgres for prototypes and side projects",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "free",
                        "launch"
                    ]
                },
                {
                    "serviceId": "launch",
                    "ref": "neon/launch",
                    "description": "Neon Launch — serverless Postgres for startups and growing teams",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "Usage-based compute and storage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Usage-based compute and storage",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "free",
                        "launch"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "postgres",
                    "ref": "neon/postgres",
                    "description": "Postgres with built-in auth — by Databricks",
                    "categories": [
                        "database",
                        "auth"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "launch",
                            "status": "paid",
                            "price": "Usage-based compute and storage",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "postgres",
                    "envPrefix": "NEON_POSTGRES",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "postgres"
                    ]
                }
            ]
        },
        {
            "slug": "netlify",
            "name": "Netlify",
            "url": "https://netlify.com",
            "tosUrl": "https://netlify.com/terms",
            "privacyUrl": "https://netlify.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/netlify.svg",
            "brandColor": "#05bdba",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "NE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Web platform for building and launching sites and apps with automatic builds, global deployment, serverless backends, and instant scaling.",
            "categories": [
                "compute"
            ],
            "pageUrl": "/marketplace/netlify/",
            "searchText": "netlify netlify web platform for building and launching sites and apps with automatic builds, global deployment, serverless backends, and instant scaling. compute netlify/project",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "project",
                    "ref": "netlify/project",
                    "description": "A hosted website backed by Netlify's global CDN. Includes serverless functions, databases, auth, storage, AI model access, and more.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "project",
                    "envPrefix": "NETLIFY_PROJECT",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "project"
                    ]
                }
            ]
        },
        {
            "slug": "openrouter",
            "name": "OpenRouter",
            "url": "https://openrouter.ai",
            "tosUrl": "https://openrouter.ai/terms",
            "privacyUrl": "https://openrouter.ai/privacy",
            "iconUrl": "/assets/images/provider-favicons/openrouter.svg",
            "brandColor": "#7624f4",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "OP",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Single API to access hundreds of models from OpenAI, Anthropic, Google, Meta, and more. Route to the best model for cost, speed, or capability automatically.",
            "categories": [
                "ai"
            ],
            "pageUrl": "/marketplace/openrouter/",
            "searchText": "openrouter openrouter single api to access hundreds of models from openai, anthropic, google, meta, and more. route to the best model for cost, speed, or capability automatically. ai openrouter/api",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "openrouter/free",
                    "description": "Free — access free AI models on OpenRouter at zero cost, no credit card required.",
                    "categories": [
                        "ai"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pay_as_you_go",
                        "free"
                    ]
                },
                {
                    "serviceId": "pay_as_you_go",
                    "ref": "openrouter/pay_as_you_go",
                    "description": "Pay-as-you-go — per-token usage-based pricing across 500+ models with no minimum commitment.",
                    "categories": [
                        "ai"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$0/mo base, usage-based pricing. See https://openrouter.ai/models for rates.",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$0/mo base, usage-based pricing. See https://openrouter.ai/models for rates.",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pay_as_you_go"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "api",
                    "ref": "openrouter/api",
                    "description": "OpenRouter — browse, compare, and use 500+ AI models from leading providers through a single API. Text, image, video, and audio generation.",
                    "categories": [
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pay_as_you_go",
                            "status": "paid",
                            "price": "$0/mo base, usage-based pricing. See https://openrouter.ai/models for rates.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "api",
                    "envPrefix": "OPENROUTER_API",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "api"
                    ]
                }
            ]
        },
        {
            "slug": "parallel",
            "name": "Parallel",
            "url": "https://parallel.ai",
            "tosUrl": "https://parallel.ai/terms",
            "privacyUrl": "https://parallel.ai/privacy",
            "iconUrl": "/assets/images/provider-favicons/parallel.svg",
            "brandColor": "#1d1c1a",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "PA",
            "entry": {
                "status": "paid",
                "label": "Search API - base request"
            },
            "description": "AI-powered research and analysis engine. Search, synthesize, and extract insights from web and private data sources.",
            "categories": [
                "ai",
                "search"
            ],
            "pageUrl": "/marketplace/parallel/",
            "searchText": "parallel parallel ai-powered research and analysis engine. search, synthesize, and extract insights from web and private data sources. ai search parallel/api",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "api",
                    "ref": "parallel/api",
                    "description": "Parallel - agent-grade web tools and intelligence APIs. One API key, five products: Search, Extract, Task, FindAll, and Monitor.",
                    "categories": [
                        "search",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "product": "search"
                            },
                            "label": "search",
                            "price": "$5 per 1,000 requests (10 results)",
                            "status": "paid",
                            "description": "Search API - base request",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "tier": "additional_results",
                                "product": "search"
                            },
                            "label": "additional_results · search",
                            "price": "+$1 per 1,000 additional page results & excerpts",
                            "status": "paid",
                            "description": "Search API - each result beyond the default 10",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "product": "extract"
                            },
                            "label": "extract",
                            "price": "$1 per 1,000 URLs",
                            "status": "paid",
                            "description": "Extract API",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-3",
                            "configuration": {
                                "processor": "lite",
                                "product": "tasks"
                            },
                            "label": "lite · tasks",
                            "price": "$5 per 1,000 Task Runs",
                            "status": "paid",
                            "description": "Task API - lite processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-4",
                            "configuration": {
                                "processor": "base",
                                "product": "tasks"
                            },
                            "label": "base · tasks",
                            "price": "$10 per 1,000 Task Runs",
                            "status": "paid",
                            "description": "Task API - base processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-5",
                            "configuration": {
                                "processor": "core",
                                "product": "tasks"
                            },
                            "label": "core · tasks",
                            "price": "$25 per 1,000 Task Runs",
                            "status": "paid",
                            "description": "Task API - core processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-6",
                            "configuration": {
                                "processor": "core2x",
                                "product": "tasks"
                            },
                            "label": "core2x · tasks",
                            "price": "$50 per 1,000 Task Runs",
                            "status": "paid",
                            "description": "Task API - core2x processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-7",
                            "configuration": {
                                "processor": "pro",
                                "product": "tasks"
                            },
                            "label": "pro · tasks",
                            "price": "$100 per 1,000 Task Runs",
                            "status": "paid",
                            "description": "Task API - pro processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-8",
                            "configuration": {
                                "processor": "ultra",
                                "product": "tasks"
                            },
                            "label": "ultra · tasks",
                            "price": "$300 per 1,000 Task Runs",
                            "status": "paid",
                            "description": "Task API - ultra processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-9",
                            "configuration": {
                                "processor": "ultra2x",
                                "product": "tasks"
                            },
                            "label": "ultra2x · tasks",
                            "price": "$600 per 1,000 Task Runs",
                            "status": "paid",
                            "description": "Task API - ultra2x processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-10",
                            "configuration": {
                                "processor": "ultra4x",
                                "product": "tasks"
                            },
                            "label": "ultra4x · tasks",
                            "price": "$1,200 per 1,000 Task Runs",
                            "status": "paid",
                            "description": "Task API - ultra4x processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-11",
                            "configuration": {
                                "processor": "ultra8x",
                                "product": "tasks"
                            },
                            "label": "ultra8x · tasks",
                            "price": "$2,400 per 1,000 Task Runs",
                            "status": "paid",
                            "description": "Task API - ultra8x processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-12",
                            "configuration": {
                                "product": "findall",
                                "generator": "preview"
                            },
                            "label": "findall · preview",
                            "price": "$0.10 per query + $0.00 per match",
                            "status": "paid",
                            "description": "FindAll API - preview generator",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-13",
                            "configuration": {
                                "product": "findall",
                                "generator": "base"
                            },
                            "label": "findall · base",
                            "price": "$0.25 per query + $0.03 per match",
                            "status": "paid",
                            "description": "FindAll API - base generator",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-14",
                            "configuration": {
                                "product": "findall",
                                "generator": "core"
                            },
                            "label": "findall · core",
                            "price": "$2.00 per query + $0.15 per match",
                            "status": "paid",
                            "description": "FindAll API - core generator",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-15",
                            "configuration": {
                                "product": "findall",
                                "generator": "pro"
                            },
                            "label": "findall · pro",
                            "price": "$10.00 per query + $1.00 per match",
                            "status": "paid",
                            "description": "FindAll API - pro generator",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-16",
                            "configuration": {
                                "processor": "lite",
                                "product": "monitor"
                            },
                            "label": "lite · monitor",
                            "price": "$3 per 1,000 executions",
                            "status": "paid",
                            "description": "Monitor API - lite processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-17",
                            "configuration": {
                                "processor": "base",
                                "product": "monitor"
                            },
                            "label": "base · monitor",
                            "price": "$10 per 1,000 executions",
                            "status": "paid",
                            "description": "Monitor API - base processor",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Search API - base request",
                    "defaultResourceName": "api",
                    "envPrefix": "PARALLEL_API",
                    "credentialKeys": [
                        "API_KEY",
                        "APP_ID"
                    ],
                    "updateableTo": [
                        "api"
                    ]
                }
            ]
        },
        {
            "slug": "perplexity",
            "name": "Perplexity",
            "url": "https://perplexity.ai",
            "tosUrl": "https://perplexity.ai/terms",
            "privacyUrl": "https://perplexity.ai/privacy",
            "iconUrl": null,
            "brandColor": "#427e8c",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "PE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Web-grounded search API. Answer from the live web with citations, or call the Sonar models for search-native reasoning.",
            "categories": [
                "ai",
                "search"
            ],
            "pageUrl": "/marketplace/perplexity/",
            "searchText": "perplexity perplexity web-grounded search api. answer from the live web with citations, or call the sonar models for search-native reasoning. ai search perplexity/api",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "api",
                    "ref": "perplexity/api",
                    "description": "Perplexity API: web-grounded search and Sonar models, billed by usage.",
                    "categories": [
                        "search",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "api",
                    "envPrefix": "PERPLEXITY_API",
                    "credentialKeys": [
                        "API_KEY",
                        "APP_ID"
                    ],
                    "updateableTo": [
                        "api"
                    ]
                }
            ]
        },
        {
            "slug": "planetscale",
            "name": "PlanetScale",
            "url": "https://planetscale.com",
            "tosUrl": "https://planetscale.com/terms",
            "privacyUrl": "https://planetscale.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/planetscale.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "PL",
            "entry": {
                "status": "paid",
                "label": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS us-east-1"
            },
            "description": "Fully managed database platform for Postgres and Vitess/MySQL, delivering NVMe-backed performance, massive scale through horizontal sharding, developer-friendly features, and enterprise-grade reliability.",
            "categories": [
                "database"
            ],
            "pageUrl": "/marketplace/planetscale/",
            "searchText": "planetscale planetscale fully managed database platform for postgres and vitess/mysql, delivering nvme-backed performance, massive scale through horizontal sharding, developer-friendly features, and enterprise-grade reliability. database planetscale/mysql planetscale/postgresql",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "mysql",
                    "ref": "planetscale/mysql",
                    "description": "Fully managed MySQL database on PlanetScale",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-us-east"
                            },
                            "label": "PS-10 · aws-us-east",
                            "price": "$39.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-us-west"
                            },
                            "label": "PS-10 · aws-us-west",
                            "price": "$39.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-10 · aws-eu-west",
                            "price": "$44.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-3",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-10 · aws-ap-south",
                            "price": "$25.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-4",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-10 · aws-ap-southeast",
                            "price": "$47.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-5",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-10 · aws-ap-northeast",
                            "price": "$47.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-6",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-10 · aws-eu-central",
                            "price": "$47.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-7",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-10 · aws-ap-southeast-2",
                            "price": "$47.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-8",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-10 · aws-sa-east-1",
                            "price": "$62.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-9",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-10 · gcp-us-central1",
                            "price": "$39.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-10",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-10 · aws-eu-west-2",
                            "price": "$46.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-11",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-10 · gcp-us-east4",
                            "price": "$39.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-12",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-10 · gcp-northamerica-northeast1",
                            "price": "$39.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-13",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-10 · gcp-asia-northeast3",
                            "price": "$47.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-14",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-10 · aws-us-east-2",
                            "price": "$39.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-15",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-10 · aws-ca-central-1",
                            "price": "$43.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-16",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-10 · gcp-europe-west1",
                            "price": "$39.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-17",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-10 · gcp-us-east1",
                            "price": "$39.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-18",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-10 · gcp-europe-west4",
                            "price": "$42.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-19",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-us-east"
                            },
                            "label": "PS-20 · aws-us-east",
                            "price": "$59.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-20",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-us-west"
                            },
                            "label": "PS-20 · aws-us-west",
                            "price": "$59.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-21",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-20 · aws-eu-west",
                            "price": "$66.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-22",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-20 · aws-ap-south",
                            "price": "$38.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-23",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-20 · aws-ap-southeast",
                            "price": "$71.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-24",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-20 · aws-ap-northeast",
                            "price": "$71.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-25",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-20 · aws-eu-central",
                            "price": "$71.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-26",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-20 · aws-ap-southeast-2",
                            "price": "$71.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-27",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-20 · aws-sa-east-1",
                            "price": "$94.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-28",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-20 · gcp-us-central1",
                            "price": "$59.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-29",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-20 · aws-eu-west-2",
                            "price": "$69.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-30",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-20 · gcp-us-east4",
                            "price": "$59.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-31",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-20 · gcp-northamerica-northeast1",
                            "price": "$59.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-32",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-20 · gcp-asia-northeast3",
                            "price": "$71.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-33",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-20 · aws-us-east-2",
                            "price": "$59.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-34",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-20 · aws-ca-central-1",
                            "price": "$65.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-35",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-20 · gcp-europe-west1",
                            "price": "$59.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-36",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-20 · gcp-us-east1",
                            "price": "$59.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-37",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-20 · gcp-europe-west4",
                            "price": "$64.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-38",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-us-east"
                            },
                            "label": "PS-40 · aws-us-east",
                            "price": "$99.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-39",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-us-west"
                            },
                            "label": "PS-40 · aws-us-west",
                            "price": "$99.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-40",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-40 · aws-eu-west",
                            "price": "$111.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-41",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-40 · aws-ap-south",
                            "price": "$64.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-42",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-40 · aws-ap-southeast",
                            "price": "$119.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-43",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-40 · aws-ap-northeast",
                            "price": "$119.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-44",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-40 · aws-eu-central",
                            "price": "$119.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-45",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-40 · aws-ap-southeast-2",
                            "price": "$119.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-46",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-40 · aws-sa-east-1",
                            "price": "$158.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-47",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-40 · gcp-us-central1",
                            "price": "$99.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-48",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-40 · aws-eu-west-2",
                            "price": "$116.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-49",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-40 · gcp-us-east4",
                            "price": "$99.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-50",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-40 · gcp-northamerica-northeast1",
                            "price": "$99.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-51",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-40 · gcp-asia-northeast3",
                            "price": "$119.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-52",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-40 · aws-us-east-2",
                            "price": "$99.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-53",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-40 · aws-ca-central-1",
                            "price": "$109.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-54",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-40 · gcp-europe-west1",
                            "price": "$99.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-55",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-40 · gcp-us-east1",
                            "price": "$99.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-56",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-40 · gcp-europe-west4",
                            "price": "$110.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-57",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-us-east"
                            },
                            "label": "PS-80 · aws-us-east",
                            "price": "$179.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-58",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-us-west"
                            },
                            "label": "PS-80 · aws-us-west",
                            "price": "$179.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-59",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-80 · aws-eu-west",
                            "price": "$200.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-60",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-80 · aws-ap-south",
                            "price": "$116.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-61",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-80 · aws-ap-southeast",
                            "price": "$215.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-62",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-80 · aws-ap-northeast",
                            "price": "$215.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-63",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-80 · aws-eu-central",
                            "price": "$215.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-64",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-80 · aws-ap-southeast-2",
                            "price": "$215.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-65",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-80 · aws-sa-east-1",
                            "price": "$286.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-66",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-80 · gcp-us-central1",
                            "price": "$179.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-67",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-80 · aws-eu-west-2",
                            "price": "$209.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-68",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-80 · gcp-us-east4",
                            "price": "$179.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-69",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-80 · gcp-northamerica-northeast1",
                            "price": "$179.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-70",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-80 · gcp-asia-northeast3",
                            "price": "$215.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-71",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-80 · aws-us-east-2",
                            "price": "$179.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-72",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-80 · aws-ca-central-1",
                            "price": "$219.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-73",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-80 · gcp-europe-west1",
                            "price": "$179.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-74",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-80 · gcp-us-east1",
                            "price": "$179.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-75",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-80 · gcp-europe-west4",
                            "price": "$190.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-76",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-us-east"
                            },
                            "label": "PS-160 · aws-us-east",
                            "price": "$349.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-77",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-us-west"
                            },
                            "label": "PS-160 · aws-us-west",
                            "price": "$349.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-78",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-160 · aws-eu-west",
                            "price": "$391.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-79",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-160 · aws-ap-south",
                            "price": "$227.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-80",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-160 · aws-ap-southeast",
                            "price": "$419.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-81",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-160 · aws-ap-northeast",
                            "price": "$419.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-82",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-160 · aws-eu-central",
                            "price": "$419.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-83",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-160 · aws-ap-southeast-2",
                            "price": "$419.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-84",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-160 · aws-sa-east-1",
                            "price": "$558.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-85",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-160 · gcp-us-central1",
                            "price": "$349.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-86",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-160 · aws-eu-west-2",
                            "price": "$408.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-87",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-160 · gcp-us-east4",
                            "price": "$349.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-88",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-160 · gcp-northamerica-northeast1",
                            "price": "$349.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-89",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-160 · gcp-asia-northeast3",
                            "price": "$419.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-90",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-160 · aws-us-east-2",
                            "price": "$349.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-91",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-160 · aws-ca-central-1",
                            "price": "$439.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-92",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-160 · gcp-europe-west1",
                            "price": "$349.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-93",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-160 · gcp-us-east1",
                            "price": "$349.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-94",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-160 · gcp-europe-west4",
                            "price": "$380.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-95",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-us-east"
                            },
                            "label": "PS-320 · aws-us-east",
                            "price": "$699.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-96",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-us-west"
                            },
                            "label": "PS-320 · aws-us-west",
                            "price": "$699.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-97",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-320 · aws-eu-west",
                            "price": "$783.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-98",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-320 · aws-ap-south",
                            "price": "$454.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-99",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-320 · aws-ap-southeast",
                            "price": "$839.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-100",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-320 · aws-ap-northeast",
                            "price": "$839.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-101",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-320 · aws-eu-central",
                            "price": "$839.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-102",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-320 · aws-ap-southeast-2",
                            "price": "$839.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-103",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-320 · aws-sa-east-1",
                            "price": "$1118.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-104",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-320 · gcp-us-central1",
                            "price": "$699.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-105",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-320 · aws-eu-west-2",
                            "price": "$818.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-106",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-320 · gcp-us-east4",
                            "price": "$699.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-107",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-320 · gcp-northamerica-northeast1",
                            "price": "$699.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-108",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-320 · gcp-asia-northeast3",
                            "price": "$839.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-109",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-320 · aws-us-east-2",
                            "price": "$699.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-110",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-320 · aws-ca-central-1",
                            "price": "$769.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-111",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-320 · gcp-europe-west1",
                            "price": "$699.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-112",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-320 · gcp-us-east1",
                            "price": "$699.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-113",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-320 · gcp-europe-west4",
                            "price": "$780.00/month, $0.50/GB storage (10GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS us-east-1",
                    "defaultResourceName": "mysql",
                    "envPrefix": "PLANETSCALE_MYSQL",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "mysql"
                    ]
                },
                {
                    "serviceId": "postgresql",
                    "ref": "planetscale/postgresql",
                    "description": "Fully managed Postgres database on PlanetScale",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-us-east"
                            },
                            "label": "PS-5 · aws-us-east",
                            "price": "$5.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-us-west"
                            },
                            "label": "PS-5 · aws-us-west",
                            "price": "$5.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-5 · aws-eu-west",
                            "price": "$5.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-3",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-5 · aws-ap-south",
                            "price": "$5.00/node/month, $0.14/GB storage (10GB included), $0.10/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-4",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-5 · aws-ap-southeast",
                            "price": "$5.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-5",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-5 · aws-ap-northeast",
                            "price": "$5.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-6",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-5 · aws-eu-central",
                            "price": "$5.00/node/month, $0.15/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-7",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-5 · aws-ap-southeast-2",
                            "price": "$5.00/node/month, $0.15/GB storage (10GB included), $0.11/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-8",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-5 · aws-sa-east-1",
                            "price": "$7.00/node/month, $0.24/GB storage (10GB included), $0.14/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-9",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-5 · gcp-us-central1",
                            "price": "$5.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-10",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-5 · aws-eu-west-2",
                            "price": "$5.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-11",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-5 · gcp-us-east4",
                            "price": "$5.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-12",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-5 · gcp-northamerica-northeast1",
                            "price": "$5.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-13",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-5 · gcp-asia-northeast3",
                            "price": "$5.00/node/month, $0.31/GB storage (10GB included), $0.12/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-14",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-5 · aws-us-east-2",
                            "price": "$5.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-15",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-5 · aws-ca-central-1",
                            "price": "$5.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-16",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-5 · gcp-europe-west1",
                            "price": "$5.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-17",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-5 · gcp-us-east1",
                            "price": "$5.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-18",
                            "configuration": {
                                "cluster": "PS-5",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-5 · gcp-europe-west4",
                            "price": "$6.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (10GB included)",
                            "status": "paid",
                            "description": "PS-5 (1/16 vCPU, 512 MB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-19",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-us-east"
                            },
                            "label": "PS-10 · aws-us-east",
                            "price": "$13.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-20",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-us-west"
                            },
                            "label": "PS-10 · aws-us-west",
                            "price": "$13.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-21",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-10 · aws-eu-west",
                            "price": "$15.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-22",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-10 · aws-ap-south",
                            "price": "$9.00/node/month, $0.14/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-23",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-10 · aws-ap-southeast",
                            "price": "$16.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-24",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-10 · aws-ap-northeast",
                            "price": "$16.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-25",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-10 · aws-eu-central",
                            "price": "$16.00/node/month, $0.15/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-26",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-10 · aws-ap-southeast-2",
                            "price": "$16.00/node/month, $0.15/GB storage (10GB included), $0.11/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-27",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-10 · aws-sa-east-1",
                            "price": "$21.00/node/month, $0.24/GB storage (10GB included), $0.14/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-28",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-10 · gcp-us-central1",
                            "price": "$13.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-29",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-10 · aws-eu-west-2",
                            "price": "$16.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-30",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-10 · gcp-us-east4",
                            "price": "$13.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-31",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-10 · gcp-northamerica-northeast1",
                            "price": "$13.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-32",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-10 · gcp-asia-northeast3",
                            "price": "$16.00/node/month, $0.31/GB storage (10GB included), $0.12/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-33",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-10 · aws-us-east-2",
                            "price": "$13.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-34",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-10 · aws-ca-central-1",
                            "price": "$15.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-35",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-10 · gcp-europe-west1",
                            "price": "$13.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-36",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-10 · gcp-us-east1",
                            "price": "$13.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-37",
                            "configuration": {
                                "cluster": "PS-10",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-10 · gcp-europe-west4",
                            "price": "$14.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-10 (1/8 vCPU, 1 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-38",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-us-east"
                            },
                            "label": "PS-20 · aws-us-east",
                            "price": "$20.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-39",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-us-west"
                            },
                            "label": "PS-20 · aws-us-west",
                            "price": "$20.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-40",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-20 · aws-eu-west",
                            "price": "$22.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-41",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-20 · aws-ap-south",
                            "price": "$13.00/node/month, $0.14/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-42",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-20 · aws-ap-southeast",
                            "price": "$24.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-43",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-20 · aws-ap-northeast",
                            "price": "$24.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-44",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-20 · aws-eu-central",
                            "price": "$24.00/node/month, $0.15/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-45",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-20 · aws-ap-southeast-2",
                            "price": "$24.00/node/month, $0.15/GB storage (10GB included), $0.11/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-46",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-20 · aws-sa-east-1",
                            "price": "$32.00/node/month, $0.24/GB storage (10GB included), $0.14/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-47",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-20 · gcp-us-central1",
                            "price": "$20.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-48",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-20 · aws-eu-west-2",
                            "price": "$23.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-49",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-20 · gcp-us-east4",
                            "price": "$20.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-50",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-20 · gcp-northamerica-northeast1",
                            "price": "$20.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-51",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-20 · gcp-asia-northeast3",
                            "price": "$24.00/node/month, $0.31/GB storage (10GB included), $0.12/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-52",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-20 · aws-us-east-2",
                            "price": "$20.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-53",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-20 · aws-ca-central-1",
                            "price": "$22.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-54",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-20 · gcp-europe-west1",
                            "price": "$20.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-55",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-20 · gcp-us-east1",
                            "price": "$20.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-56",
                            "configuration": {
                                "cluster": "PS-20",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-20 · gcp-europe-west4",
                            "price": "$21.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-20 (1/4 vCPU, 2 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-57",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-us-east"
                            },
                            "label": "PS-40 · aws-us-east",
                            "price": "$33.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-58",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-us-west"
                            },
                            "label": "PS-40 · aws-us-west",
                            "price": "$33.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-59",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-40 · aws-eu-west",
                            "price": "$37.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-60",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-40 · aws-ap-south",
                            "price": "$22.00/node/month, $0.14/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-61",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-40 · aws-ap-southeast",
                            "price": "$40.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-62",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-40 · aws-ap-northeast",
                            "price": "$40.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-63",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-40 · aws-eu-central",
                            "price": "$40.00/node/month, $0.15/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-64",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-40 · aws-ap-southeast-2",
                            "price": "$40.00/node/month, $0.15/GB storage (10GB included), $0.11/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-65",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-40 · aws-sa-east-1",
                            "price": "$53.00/node/month, $0.24/GB storage (10GB included), $0.14/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-66",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-40 · gcp-us-central1",
                            "price": "$33.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-67",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-40 · aws-eu-west-2",
                            "price": "$39.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-68",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-40 · gcp-us-east4",
                            "price": "$33.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-69",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-40 · gcp-northamerica-northeast1",
                            "price": "$33.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-70",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-40 · gcp-asia-northeast3",
                            "price": "$40.00/node/month, $0.31/GB storage (10GB included), $0.12/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-71",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-40 · aws-us-east-2",
                            "price": "$33.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-72",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-40 · aws-ca-central-1",
                            "price": "$37.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-73",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-40 · gcp-europe-west1",
                            "price": "$33.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-74",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-40 · gcp-us-east1",
                            "price": "$33.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-75",
                            "configuration": {
                                "cluster": "PS-40",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-40 · gcp-europe-west4",
                            "price": "$36.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-40 (1/2 vCPU, 4 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-76",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-us-east"
                            },
                            "label": "PS-80 · aws-us-east",
                            "price": "$60.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-77",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-us-west"
                            },
                            "label": "PS-80 · aws-us-west",
                            "price": "$60.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-78",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-80 · aws-eu-west",
                            "price": "$67.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-79",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-80 · aws-ap-south",
                            "price": "$39.00/node/month, $0.14/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-80",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-80 · aws-ap-southeast",
                            "price": "$72.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-81",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-80 · aws-ap-northeast",
                            "price": "$72.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-82",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-80 · aws-eu-central",
                            "price": "$72.00/node/month, $0.15/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-83",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-80 · aws-ap-southeast-2",
                            "price": "$72.00/node/month, $0.15/GB storage (10GB included), $0.11/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-84",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-80 · aws-sa-east-1",
                            "price": "$96.00/node/month, $0.24/GB storage (10GB included), $0.14/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-85",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-80 · gcp-us-central1",
                            "price": "$60.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-86",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-80 · aws-eu-west-2",
                            "price": "$70.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-87",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-80 · gcp-us-east4",
                            "price": "$60.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-88",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-80 · gcp-northamerica-northeast1",
                            "price": "$60.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-89",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-80 · gcp-asia-northeast3",
                            "price": "$72.00/node/month, $0.31/GB storage (10GB included), $0.12/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-90",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-80 · aws-us-east-2",
                            "price": "$60.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-91",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-80 · aws-ca-central-1",
                            "price": "$73.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-92",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-80 · gcp-europe-west1",
                            "price": "$60.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-93",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-80 · gcp-us-east1",
                            "price": "$60.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-94",
                            "configuration": {
                                "cluster": "PS-80",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-80 · gcp-europe-west4",
                            "price": "$61.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-80 (1 vCPU, 8 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-95",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-us-east"
                            },
                            "label": "PS-160 · aws-us-east",
                            "price": "$117.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-96",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-us-west"
                            },
                            "label": "PS-160 · aws-us-west",
                            "price": "$117.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-97",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-160 · aws-eu-west",
                            "price": "$131.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-98",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-160 · aws-ap-south",
                            "price": "$76.00/node/month, $0.14/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-99",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-160 · aws-ap-southeast",
                            "price": "$140.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-100",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-160 · aws-ap-northeast",
                            "price": "$140.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-101",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-160 · aws-eu-central",
                            "price": "$140.00/node/month, $0.15/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-102",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-160 · aws-ap-southeast-2",
                            "price": "$140.00/node/month, $0.15/GB storage (10GB included), $0.11/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-103",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-160 · aws-sa-east-1",
                            "price": "$186.00/node/month, $0.24/GB storage (10GB included), $0.14/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-104",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-160 · gcp-us-central1",
                            "price": "$117.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-105",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-160 · aws-eu-west-2",
                            "price": "$136.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-106",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-160 · gcp-us-east4",
                            "price": "$117.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-107",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-160 · gcp-northamerica-northeast1",
                            "price": "$117.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-108",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-160 · gcp-asia-northeast3",
                            "price": "$140.00/node/month, $0.31/GB storage (10GB included), $0.12/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-109",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-160 · aws-us-east-2",
                            "price": "$117.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-110",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-160 · aws-ca-central-1",
                            "price": "$147.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-111",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-160 · gcp-europe-west1",
                            "price": "$117.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-112",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-160 · gcp-us-east1",
                            "price": "$117.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-113",
                            "configuration": {
                                "cluster": "PS-160",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-160 · gcp-europe-west4",
                            "price": "$120.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-160 (2 vCPUs, 16 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-114",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-us-east"
                            },
                            "label": "PS-320 · aws-us-east",
                            "price": "$233.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS us-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-115",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-us-west"
                            },
                            "label": "PS-320 · aws-us-west",
                            "price": "$233.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS us-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-116",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-eu-west"
                            },
                            "label": "PS-320 · aws-eu-west",
                            "price": "$261.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS eu-west-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-117",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ap-south"
                            },
                            "label": "PS-320 · aws-ap-south",
                            "price": "$152.00/node/month, $0.14/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ap-south-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-118",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ap-southeast"
                            },
                            "label": "PS-320 · aws-ap-southeast",
                            "price": "$280.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ap-southeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-119",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ap-northeast"
                            },
                            "label": "PS-320 · aws-ap-northeast",
                            "price": "$280.00/node/month, $0.15/GB storage (10GB included), $0.10/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ap-northeast-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-120",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-eu-central"
                            },
                            "label": "PS-320 · aws-eu-central",
                            "price": "$280.00/node/month, $0.15/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS eu-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-121",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ap-southeast-2"
                            },
                            "label": "PS-320 · aws-ap-southeast-2",
                            "price": "$280.00/node/month, $0.15/GB storage (10GB included), $0.11/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ap-southeast-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-122",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-sa-east-1"
                            },
                            "label": "PS-320 · aws-sa-east-1",
                            "price": "$373.00/node/month, $0.24/GB storage (10GB included), $0.14/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS sa-east-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-123",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-us-central1"
                            },
                            "label": "PS-320 · gcp-us-central1",
                            "price": "$233.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP us-central1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-124",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-eu-west-2"
                            },
                            "label": "PS-320 · aws-eu-west-2",
                            "price": "$273.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS eu-west-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-125",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-us-east4"
                            },
                            "label": "PS-320 · gcp-us-east4",
                            "price": "$233.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP us-east4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-126",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-northamerica-northeast1"
                            },
                            "label": "PS-320 · gcp-northamerica-northeast1",
                            "price": "$233.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP northamerica-northeast1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-127",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-asia-northeast3"
                            },
                            "label": "PS-320 · gcp-asia-northeast3",
                            "price": "$280.00/node/month, $0.31/GB storage (10GB included), $0.12/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP asia-northeast3",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-128",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-us-east-2"
                            },
                            "label": "PS-320 · aws-us-east-2",
                            "price": "$233.00/node/month, $0.12/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS us-east-2",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-129",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "aws-ca-central-1"
                            },
                            "label": "PS-320 · aws-ca-central-1",
                            "price": "$257.00/node/month, $0.14/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – AWS ca-central-1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-130",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-europe-west1"
                            },
                            "label": "PS-320 · gcp-europe-west1",
                            "price": "$233.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP europe-west1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-131",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-us-east1"
                            },
                            "label": "PS-320 · gcp-us-east1",
                            "price": "$233.00/node/month, $0.24/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP us-east1",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-132",
                            "configuration": {
                                "cluster": "PS-320",
                                "region": "gcp-europe-west4"
                            },
                            "label": "PS-320 · gcp-europe-west4",
                            "price": "$250.00/node/month, $0.26/GB storage (10GB included), $0.06/GB egress (100GB included)",
                            "status": "paid",
                            "description": "PS-320 (4 vCPUs, 32 GB RAM) – GCP europe-west4",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "PS-5 (1/16 vCPU, 512 MB RAM) – AWS us-east-1",
                    "defaultResourceName": "postgresql",
                    "envPrefix": "PLANETSCALE_POSTGRESQL",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "postgresql"
                    ]
                }
            ]
        },
        {
            "slug": "postalform",
            "name": "PostalForm",
            "url": "https://postalform.com",
            "tosUrl": "https://postalform.com/terms",
            "privacyUrl": "https://postalform.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/postalform.svg",
            "brandColor": "#dd0012",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "PO",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Programmable physical mail API. Send letters, postcards, and documents via USPS from your application.",
            "categories": [
                "communications"
            ],
            "pageUrl": "/marketplace/postalform/",
            "searchText": "postalform postalform programmable physical mail api. send letters, postcards, and documents via usps from your application. communications postalform/mail",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "mail",
                    "ref": "postalform/mail",
                    "description": "Agentic postal mail infrastructure for uploading PDFs, quoting mailpieces, routing to the right print-mail rail, tracking status, and receiving signed webhooks.",
                    "categories": [
                        "communications"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "price": "free"
                            },
                            "label": "free",
                            "price": "Test mode includes fake credits and simulated mail events.",
                            "status": "free",
                            "description": "Test mode includes fake credits and simulated mail events.",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "price": "payg"
                            },
                            "label": "payg",
                            "price": "Usage-based postal mail: US letters from $1.80 + $0.20/page B/W or $0.40/page color; postcards from $1.50.",
                            "status": "paid",
                            "description": "Billed per submitted mailpiece through the provisioning API. USPS Certified Mail adds $8.00, Canada Post Registered Mail adds $32.00, and Electronic Return Receipt adds $3.00 for eligible U.S. Certified Mail; international and expedited mail are quoted by route and options.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Test mode includes fake credits and simulated mail events.",
                    "defaultResourceName": "mail",
                    "envPrefix": "POSTALFORM_MAIL",
                    "credentialKeys": [
                        "API_KEY",
                        "SENDER_ID"
                    ],
                    "updateableTo": [
                        "mail"
                    ]
                }
            ]
        },
        {
            "slug": "posthog",
            "name": "PostHog",
            "url": "https://posthog.com",
            "tosUrl": "https://posthog.com/terms",
            "privacyUrl": "https://posthog.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/posthog.svg",
            "brandColor": "#1d4aff",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "PO",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Product analytics with session replay, feature flags, A/B testing, data warehouse, and CDP in one platform.",
            "categories": [
                "ai",
                "analytics",
                "feature_flags",
                "observability"
            ],
            "pageUrl": "/marketplace/posthog/",
            "searchText": "posthog posthog product analytics with session replay, feature flags, a/b testing, data warehouse, and cdp in one platform. ai analytics feature_flags observability posthog/analytics",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "posthog/free",
                    "description": "Free - generous free tier across all PostHog products, no credit card required.",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai",
                        "observability"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pay_as_you_go",
                        "free"
                    ]
                },
                {
                    "serviceId": "pay_as_you_go",
                    "ref": "posthog/pay_as_you_go",
                    "description": "Pay-as-you-go - usage-based pricing across all PostHog products with no minimum commitment.",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai",
                        "observability"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$0/mo base, usage-based pricing, generous free tier. See https://posthog.com/pricing for rates.",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$0/mo base, usage-based pricing, generous free tier. See https://posthog.com/pricing for rates.",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "free",
                        "pay_as_you_go"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "analytics",
                    "ref": "posthog/analytics",
                    "description": "PostHog — product analytics, session replay, realtime destinations, feature flags & experiments, surveys, data warehouse, error tracking, ai observability, logs, posthog ai, replay vision, inbox, posthog desktop (usage-based), emails, and more.",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai",
                        "observability"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pay_as_you_go",
                            "status": "paid",
                            "price": "Usage-based pricing, pay only for what you use.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "analytics",
                    "envPrefix": "POSTHOG_ANALYTICS",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID",
                        "HOST"
                    ],
                    "updateableTo": [
                        "service_ref",
                        "analytics"
                    ]
                }
            ]
        },
        {
            "slug": "prisma",
            "name": "Prisma",
            "url": "https://prisma.io",
            "tosUrl": "https://prisma.io/terms",
            "privacyUrl": "https://prisma.io/privacy",
            "iconUrl": "/assets/images/provider-favicons/prisma.svg",
            "brandColor": "#090a15",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "PR",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Next-generation ORM for Node.js and TypeScript with type-safe database access, migrations, and a visual editor.",
            "categories": [
                "database"
            ],
            "pageUrl": "/marketplace/prisma/",
            "searchText": "prisma prisma next-generation orm for node.js and typescript with type-safe database access, migrations, and a visual editor. database prisma/database",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "prisma/free",
                    "description": "Free: includes 100k queries and 0.5 GiB-month storage per billing cycle; hard limits, no paid overages.",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "business",
                        "starter",
                        "pro",
                        "free"
                    ]
                },
                {
                    "serviceId": "business",
                    "ref": "prisma/business",
                    "description": "Business: includes 50M queries and 100 GiB-month storage per billing cycle; usage beyond the included amounts is billed as metered overages.",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$129.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$129.00 per month",
                            "status": "paid",
                            "description": "Business: includes 50M queries and 100 GiB-month storage per billing cycle; usage beyond the included amounts is billed as metered overages.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "starter",
                        "business",
                        "pro",
                        "free"
                    ]
                },
                {
                    "serviceId": "pro",
                    "ref": "prisma/pro",
                    "description": "Pro: includes 10M queries and 50 GiB-month storage per billing cycle; usage beyond the included amounts is billed as metered overages.",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$49.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$49.00 per month",
                            "status": "paid",
                            "description": "Pro: includes 10M queries and 50 GiB-month storage per billing cycle; usage beyond the included amounts is billed as metered overages.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "business",
                        "starter",
                        "pro",
                        "free"
                    ]
                },
                {
                    "serviceId": "starter",
                    "ref": "prisma/starter",
                    "description": "Starter: includes 1M queries and 10 GiB-month storage per billing cycle; usage beyond the included amounts is billed as metered overages.",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$10.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$10.00 per month",
                            "status": "paid",
                            "description": "Starter: includes 1M queries and 10 GiB-month storage per billing cycle; usage beyond the included amounts is billed as metered overages.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "business",
                        "starter",
                        "pro",
                        "free"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "database",
                    "ref": "prisma/database",
                    "description": "Prisma Postgres — managed Postgres for your project.",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "starter",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "business",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "database",
                    "envPrefix": "PRISMA_DATABASE",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "database"
                    ]
                }
            ]
        },
        {
            "slug": "privy",
            "name": "Privy",
            "url": "https://privy.io",
            "tosUrl": "https://privy.io/terms",
            "privacyUrl": "https://privy.io/privacy",
            "iconUrl": "/assets/images/provider-favicons/privy.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "PR",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Wallet and key-management infrastructure for embedding secure wallets, authentication, and signing policies into apps across EVM, Solana, and Bitcoin.",
            "categories": [
                "auth",
                "payments"
            ],
            "pageUrl": "/marketplace/privy/",
            "searchText": "privy privy wallet and key-management infrastructure for embedding secure wallets, authentication, and signing policies into apps across evm, solana, and bitcoin. auth payments privy/app",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "privy/free",
                    "description": "Privy Free — 0-499 MAU. 50K free monthly wallet signatures and $1M transaction volume included.",
                    "categories": [
                        "auth",
                        "payments"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "core",
                        "scale",
                        "free"
                    ]
                },
                {
                    "serviceId": "scale",
                    "ref": "privy/scale",
                    "description": "Privy Scale — up to 10,000 MAU. 50K free monthly wallet signatures. All Core features included.",
                    "categories": [
                        "auth",
                        "payments"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$499.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$499.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "enterprise",
                        "scale"
                    ]
                },
                {
                    "serviceId": "core",
                    "ref": "privy/core",
                    "description": "Privy Core — up to 2,500 MAU. 50K free monthly wallet signatures. Includes Custom JWT auth, Custom OAuth, fiat on-ramp, and Expo SDK.",
                    "categories": [
                        "auth",
                        "payments"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$299.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$299.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "scale",
                        "core"
                    ]
                },
                {
                    "serviceId": "enterprise",
                    "ref": "privy/enterprise",
                    "description": "Privy Enterprise — contact sales to provision.",
                    "categories": [
                        "auth",
                        "payments"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$2,000.00 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$2,000.00 per month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "enterprise"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "app",
                    "ref": "privy/app",
                    "description": "Auth and wallet functionality for your app",
                    "categories": [
                        "auth",
                        "payments"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "enterprise",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "scale",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "core",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "app",
                    "envPrefix": "PRIVY_APP",
                    "credentialKeys": [
                        "PUBLISHABLE_KEY",
                        "SECRET_KEY",
                        "ISSUER_URL"
                    ],
                    "updateableTo": [
                        "app"
                    ]
                }
            ]
        },
        {
            "slug": "pydantic",
            "name": "Pydantic",
            "url": "https://pydantic.dev",
            "tosUrl": "https://pydantic.dev/terms",
            "privacyUrl": "https://pydantic.dev/privacy",
            "iconUrl": "/assets/images/provider-favicons/pydantic.svg",
            "brandColor": "#e620e9",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "PY",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Logfire observability platform. OpenTelemetry-native monitoring, tracing, and debugging for Python applications and AI agents.",
            "categories": [
                "ai",
                "analytics",
                "feature_flags",
                "observability"
            ],
            "pageUrl": "/marketplace/pydantic/",
            "searchText": "pydantic pydantic logfire observability platform. opentelemetry-native monitoring, tracing, and debugging for python applications and ai agents. ai analytics feature_flags observability pydantic/logfire",
            "plans": [
                {
                    "serviceId": "personal",
                    "ref": "pydantic/personal",
                    "description": "Personal - your free Logfire account, one per email address. Up to 10M logs, spans and metrics per month; use Growth or Team for more seats, projects, retention and included usage.",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai",
                        "observability"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "personal"
                    ]
                },
                {
                    "serviceId": "growth",
                    "ref": "pydantic/growth",
                    "description": "Growth - for scaling teams. Enough seats, guests and projects for your AI Application, up to 90 days retention, priority support, self-service data deletion, HIPAA BAA.",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai",
                        "observability"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$249 per month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$249 per month",
                            "status": "paid",
                            "description": "Enough seats, guests and projects for your AI Application.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "team",
                        "growth"
                    ]
                },
                {
                    "serviceId": "team",
                    "ref": "pydantic/team",
                    "description": "Team - for startups and small teams shipping to prod. 5 seats included (up to 12), 5 projects, 10M records/mo included, 30-day retention.",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai",
                        "observability"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$49 per month (5 seats included + $25 per extra seat)",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$49 per month (5 seats included + $25 per extra seat)",
                            "status": "paid",
                            "description": "Includes 5 seats and 5 projects. Extra seats $25/month each, up to 12 seats.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "growth",
                        "team"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "logfire",
                    "ref": "pydantic/logfire",
                    "description": "A Logfire project - where your traces, logs and metrics land. Provisioning it returns an OTLP write token to start sending data; billed via the account plan.",
                    "categories": [
                        "analytics",
                        "feature_flags",
                        "ai",
                        "observability"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "growth",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "team",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "logfire",
                    "envPrefix": "PYDANTIC_LOGFIRE",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID",
                        "HOST"
                    ],
                    "updateableTo": [
                        "logfire"
                    ]
                }
            ]
        },
        {
            "slug": "railway",
            "name": "Railway",
            "url": "https://railway.app",
            "tosUrl": "https://railway.app/terms",
            "privacyUrl": "https://railway.app/privacy",
            "iconUrl": "/assets/images/provider-favicons/railway.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "RA",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Infrastructure for devs. Deploy servers, databases, and cron jobs with zero ops overhead.",
            "categories": [
                "compute",
                "database",
                "cache",
                "storage"
            ],
            "pageUrl": "/marketplace/railway/",
            "searchText": "railway railway infrastructure for devs. deploy servers, databases, and cron jobs with zero ops overhead. compute database cache storage railway/bucket railway/hosting railway/mongo railway/postgres railway/redis",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "railway/free",
                    "description": "Trial plan with limited resources. 500 hours of compute, 512 MB RAM, shared CPU, 1 GB disk.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pro",
                        "hobby",
                        "free"
                    ]
                },
                {
                    "serviceId": "hobby",
                    "ref": "railway/hobby",
                    "description": "For personal projects. $5/month with $5 included usage. Up to 48 vCPU, 48 GB RAM, 5 replicas, 5 GB disk.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$5/month base + usage-based compute and storage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$5/month base + usage-based compute and storage",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro",
                        "hobby"
                    ]
                },
                {
                    "serviceId": "pro",
                    "ref": "railway/pro",
                    "description": "For teams and production workloads. $20/month with $20 included usage. Up to 1,000 vCPU, 1 TB RAM, 42 replicas, 1 TB disk, Railway Support.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$20/month base + usage-based compute and storage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$20/month base + usage-based compute and storage",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "bucket",
                    "ref": "railway/bucket",
                    "description": "S3-compatible object storage on Railway. Powered by Tigris.",
                    "categories": [
                        "storage"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "hobby",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "bucket",
                    "envPrefix": "RAILWAY_BUCKET",
                    "credentialKeys": [
                        "ACCESS_KEY_ID",
                        "SECRET_ACCESS_KEY",
                        "BUCKET"
                    ],
                    "updateableTo": [
                        "bucket"
                    ]
                },
                {
                    "serviceId": "hosting",
                    "ref": "railway/hosting",
                    "description": "Deploy a GitHub repository (public or private) or Docker image on Railway.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "hobby",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "hosting",
                    "envPrefix": "RAILWAY_HOSTING",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "hosting"
                    ]
                },
                {
                    "serviceId": "mongo",
                    "ref": "railway/mongo",
                    "description": "Managed MongoDB database on Railway.",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "hobby",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "mongo",
                    "envPrefix": "RAILWAY_MONGO",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "mongo"
                    ]
                },
                {
                    "serviceId": "postgres",
                    "ref": "railway/postgres",
                    "description": "Managed PostgreSQL database on Railway.",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "hobby",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "postgres",
                    "envPrefix": "RAILWAY_POSTGRES",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "postgres"
                    ]
                },
                {
                    "serviceId": "redis",
                    "ref": "railway/redis",
                    "description": "Managed Redis cache on Railway.",
                    "categories": [
                        "database",
                        "cache"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "hobby",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "Usage-based. Compute: $0.000463/min/vCPU, Memory: $0.000231/min/GB. Volume storage: $0.25/GB/month.",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "redis",
                    "envPrefix": "RAILWAY_REDIS",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "redis"
                    ]
                }
            ]
        },
        {
            "slug": "render",
            "name": "Render",
            "url": "https://render.com",
            "tosUrl": "https://render.com/terms",
            "privacyUrl": "https://render.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/render.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "RE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Cloud platform for deploying apps, agents, databases, and workers with automatic scaling, zero-downtime deploys, and built-in compliance.",
            "categories": [
                "compute",
                "database"
            ],
            "pageUrl": "/marketplace/render/",
            "searchText": "render render cloud platform for deploying apps, agents, databases, and workers with automatic scaling, zero-downtime deploys, and built-in compliance. compute database render/postgres render/static-site render/web-service",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "postgres",
                    "ref": "render/postgres",
                    "description": "Managed PostgreSQL database instance with pricing based on instance type",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "instance_type": "free"
                            },
                            "label": "free",
                            "price": "256MB RAM, 0.1 CPU, 1 GB storage",
                            "status": "free",
                            "description": "256MB RAM, 0.1 CPU, 1 GB storage",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "instance_type": "basic-256mb"
                            },
                            "label": "basic-256mb",
                            "price": "$6/month",
                            "status": "paid",
                            "description": "256MB RAM, 0.1 CPU, $0.30/GB monthly storage",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "instance_type": "basic-1gb"
                            },
                            "label": "basic-1gb",
                            "price": "$19/month",
                            "status": "paid",
                            "description": "1GB RAM, 0.5 CPU, $0.30/GB monthly storage",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-3",
                            "configuration": {
                                "instance_type": "basic-4gb"
                            },
                            "label": "basic-4gb",
                            "price": "$75/month",
                            "status": "paid",
                            "description": "4GB RAM, 2 CPU, $0.30/GB monthly storage",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "256MB RAM, 0.1 CPU, 1 GB storage",
                    "defaultResourceName": "postgres",
                    "envPrefix": "RENDER_POSTGRES",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "postgres"
                    ]
                },
                {
                    "serviceId": "static-site",
                    "ref": "render/static-site",
                    "description": "Free static site hosting with global CDN",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "static-site",
                    "envPrefix": "RENDER_STATIC_SITE",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "static-site"
                    ]
                },
                {
                    "serviceId": "web-service",
                    "ref": "render/web-service",
                    "description": "Managed web service with pricing based on instance type",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "instance_type": "free"
                            },
                            "label": "free",
                            "price": "512MB RAM, 0.1 CPU",
                            "status": "free",
                            "description": "512MB RAM, 0.1 CPU",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "instance_type": "starter"
                            },
                            "label": "starter",
                            "price": "$7/month",
                            "status": "paid",
                            "description": "512MB RAM, 0.5 CPU",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "instance_type": "standard"
                            },
                            "label": "standard",
                            "price": "$25/month",
                            "status": "paid",
                            "description": "2GB RAM, 1 CPU",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "512MB RAM, 0.1 CPU",
                    "defaultResourceName": "web-service",
                    "envPrefix": "RENDER_WEB_SERVICE",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "web-service"
                    ]
                }
            ]
        },
        {
            "slug": "revenuecat",
            "name": "RevenueCat",
            "url": "https://revenuecat.com",
            "tosUrl": "https://revenuecat.com/terms",
            "privacyUrl": "https://revenuecat.com/privacy",
            "iconUrl": null,
            "brandColor": "#061b31",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "RE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "In-app subscription infrastructure. Manage purchases, paywalls, and subscription analytics across iOS, Android, and web.",
            "categories": [
                "analytics",
                "payments"
            ],
            "pageUrl": "/marketplace/revenuecat/",
            "searchText": "revenuecat revenuecat in-app subscription infrastructure. manage purchases, paywalls, and subscription analytics across ios, android, and web. analytics payments revenuecat/app",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "app",
                    "ref": "revenuecat/app",
                    "description": "RevenueCat app — in-app purchase management, subscription analytics, and paywall tools for your mobile or web app.",
                    "categories": [
                        "analytics",
                        "payments"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "app",
                    "envPrefix": "REVENUECAT_APP",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID",
                        "HOST"
                    ],
                    "updateableTo": [
                        "app"
                    ]
                }
            ]
        },
        {
            "slug": "runloop",
            "name": "Runloop",
            "url": "https://runloop.ai",
            "tosUrl": "https://runloop.ai/terms",
            "privacyUrl": "https://runloop.ai/privacy",
            "iconUrl": "/assets/images/provider-favicons/runloop.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "RU",
            "entry": {
                "status": "paid",
                "label": "First month free, then $250/mo + usage-based pricing"
            },
            "description": "Secure execution infrastructure for AI agents. Isolated micro-VM sandboxes for safe code execution and tool use.",
            "categories": [
                "ai",
                "sandbox"
            ],
            "pageUrl": "/marketplace/runloop/",
            "searchText": "runloop runloop secure execution infrastructure for ai agents. isolated micro-vm sandboxes for safe code execution and tool use. ai sandbox runloop/sandbox",
            "plans": [
                {
                    "serviceId": "pro",
                    "ref": "runloop/pro",
                    "description": "Runloop Pro — cloud sandboxes for production AI workloads at scale",
                    "categories": [
                        "ai",
                        "sandbox"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "First month free, then $250/mo + usage-based pricing",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "First month free, then $250/mo + usage-based pricing",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "basic",
                        "pro"
                    ]
                },
                {
                    "serviceId": "basic",
                    "ref": "runloop/basic",
                    "description": "Runloop Basic — cloud sandboxes with high concurrency and compute",
                    "categories": [
                        "ai",
                        "sandbox"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "Usage-based pricing",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "Usage-based pricing",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro",
                        "basic"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "sandbox",
                    "ref": "runloop/sandbox",
                    "description": "Runloop Sandbox — cloud sandbox environment for Agents and RL workloads. Projects accounts get $300 in trial value",
                    "categories": [
                        "ai",
                        "sandbox"
                    ],
                    "scope": "account",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "basic",
                            "status": "paid",
                            "price": "Usage-based compute and storage, 100 GB storage included",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "Usage-based compute and storage, 1 TB storage included",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "sandbox",
                    "envPrefix": "RUNLOOP_SANDBOX",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "sandbox"
                    ]
                }
            ]
        },
        {
            "slug": "schematic",
            "name": "Schematic",
            "url": "https://schematichq.com",
            "tosUrl": "https://schematichq.com/terms",
            "privacyUrl": "https://schematichq.com/privacy",
            "iconUrl": null,
            "brandColor": "#061b31",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "SC",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Feature management and entitlements platform. Control feature access, run experiments, and manage plan-based entitlements.",
            "categories": [
                "feature_flags"
            ],
            "pageUrl": "/marketplace/schematic/",
            "searchText": "schematic schematic feature management and entitlements platform. control feature access, run experiments, and manage plan-based entitlements. feature_flags schematic/schematic-environment",
            "plans": [
                {
                    "serviceId": "schematic-free",
                    "ref": "schematic/schematic-free",
                    "description": "Schematic Free — feature flags, entitlements, and usage metering",
                    "categories": [
                        "feature_flags"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "schematic-growth",
                        "schematic-free"
                    ]
                },
                {
                    "serviceId": "schematic-growth",
                    "ref": "schematic/schematic-growth",
                    "description": "Schematic Growth — advanced metering & usage-based pricing",
                    "categories": [
                        "feature_flags"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$200/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$200/month",
                            "status": "paid",
                            "description": "Growth",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "schematic-free",
                        "schematic-growth"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "schematic-environment",
                    "ref": "schematic/schematic-environment",
                    "description": "A Schematic environment with API keys. Included with any active plan.",
                    "categories": [
                        "feature_flags"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "schematic-growth",
                            "status": "free",
                            "price": "Free",
                            "isDefault": true
                        },
                        {
                            "planServiceId": "schematic-free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": true
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "schematic-environment",
                    "envPrefix": "SCHEMATIC_SCHEMATIC_ENVIRONMENT",
                    "credentialKeys": [
                        "API_KEY",
                        "ENVIRONMENT_ID"
                    ],
                    "updateableTo": [
                        "schematic-environment"
                    ]
                }
            ]
        },
        {
            "slug": "sentry",
            "name": "Sentry",
            "url": "https://sentry.io",
            "tosUrl": "https://sentry.io/terms/",
            "privacyUrl": "https://sentry.io/privacy/",
            "iconUrl": "/assets/images/provider-favicons/sentry.svg",
            "brandColor": "#4e2a9a",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "SE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Debugging platform that helps teams detect, understand, and fix broken code fast, reducing resolution time from days to minutes.",
            "categories": [
                "observability"
            ],
            "pageUrl": "/marketplace/sentry/",
            "searchText": "sentry sentry debugging platform that helps teams detect, understand, and fix broken code fast, reducing resolution time from days to minutes. observability sentry/project sentry/seer",
            "plans": [
                {
                    "serviceId": "developer",
                    "ref": "sentry/developer",
                    "description": "Sentry Developer -- error monitoring, performance, and session replay",
                    "categories": [
                        "observability"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "team",
                        "business",
                        "developer"
                    ]
                },
                {
                    "serviceId": "business",
                    "ref": "sentry/business",
                    "description": "Sentry Business -- error monitoring, performance, and session replay",
                    "categories": [
                        "observability"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$89/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$89/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "team",
                        "developer",
                        "business"
                    ]
                },
                {
                    "serviceId": "team",
                    "ref": "sentry/team",
                    "description": "Sentry Team -- error monitoring, performance, and session replay",
                    "categories": [
                        "observability"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$29/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$29/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "business",
                        "developer",
                        "team"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "project",
                    "ref": "sentry/project",
                    "description": "Sentry project -- error tracking, performance monitoring, and session replay for your application",
                    "categories": [
                        "observability"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "team",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "business",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "project",
                    "envPrefix": "SENTRY_PROJECT",
                    "credentialKeys": [
                        "API_KEY",
                        "DSN"
                    ],
                    "updateableTo": [
                        "project"
                    ]
                },
                {
                    "serviceId": "seer",
                    "ref": "sentry/seer",
                    "description": "Sentry Seer AI -- automated issue fixes and root cause analysis powered by AI",
                    "categories": [
                        "observability"
                    ],
                    "scope": "account",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "team",
                            "status": "paid",
                            "price": "$40/active contributor/month",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "business",
                            "status": "paid",
                            "price": "$40/active contributor/month",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "seer",
                    "envPrefix": "SENTRY_SEER",
                    "credentialKeys": [
                        "API_KEY",
                        "DSN"
                    ],
                    "updateableTo": [
                        "seer"
                    ]
                }
            ]
        },
        {
            "slug": "shopify",
            "name": "Shopify",
            "url": "https://shopify.com",
            "tosUrl": "https://www.shopify.com/legal/terms",
            "privacyUrl": "https://www.shopify.com/legal/privacy",
            "iconUrl": "/assets/images/provider-favicons/shopify.svg",
            "brandColor": "#95bf47",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "SH",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Shopify is the leading commerce platform powering millions of businesses worldwide. The Shopify app lets developers provision a fully hosted Shopify online store directly from the provisioning API – no separate signup or context switching. Choose a plan, launch your storefront, and manage billing in one place, so you can go from idea to selling in just a few clicks.",
            "categories": [
                "ecommerce"
            ],
            "pageUrl": "/marketplace/shopify/",
            "searchText": "shopify shopify shopify is the leading commerce platform powering millions of businesses worldwide. the shopify app lets developers provision a fully hosted shopify online store directly from the provisioning api – no separate signup or context switching. choose a plan, launch your storefront, and manage billing in one place, so you can go from idea to selling in just a few clicks. ecommerce shopify/store",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "store",
                    "ref": "shopify/store",
                    "description": "Launch your own online store with Shopify. Build your store for free for 4 months. Only pay when you're ready to sell.",
                    "categories": [
                        "ecommerce"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "plan": "trial"
                            },
                            "label": "trial",
                            "price": "Start building for free for 4 months. Subscribe when you are ready to sell.",
                            "status": "free",
                            "description": "Start building for free for 4 months. Subscribe when you are ready to sell.",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "plan": "basic"
                            },
                            "label": "basic",
                            "price": "$1/mo for 3 months (new stores only), then $39/mo. Renews monthly.",
                            "status": "paid",
                            "description": "For solo entrepreneurs. Owner account only. 2.9% + 30¢ online. 2% third-party fee.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "plan": "grow"
                            },
                            "label": "grow",
                            "price": "$1/mo for 3 months (new stores only), then $105/mo. Renews monthly.",
                            "status": "paid",
                            "description": "For small teams. Owner account and 5 staff. 2.7% + 30¢ online. 1% third-party fee.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-3",
                            "configuration": {
                                "plan": "advanced"
                            },
                            "label": "advanced",
                            "price": "$1/mo for 3 months (new stores only), then $399/mo. Renews monthly.",
                            "status": "paid",
                            "description": "For growing global businesses. Owner account and 15 staff. 2.5% + 30¢ online. 0.6% third-party fee.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Start building for free for 4 months. Subscribe when you are ready to sell.",
                    "defaultResourceName": "store",
                    "envPrefix": "SHOPIFY_STORE",
                    "credentialKeys": [
                        "STORE_DOMAIN",
                        "ADMIN_TOKEN",
                        "STOREFRONT_TOKEN"
                    ],
                    "updateableTo": [
                        "store"
                    ]
                }
            ]
        },
        {
            "slug": "spaceship",
            "name": "Spaceship",
            "url": "https://spaceship.com",
            "tosUrl": "https://spaceship.com/terms",
            "privacyUrl": "https://spaceship.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/spaceship.svg",
            "brandColor": "#394efd",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "SP",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Find the perfect domain for your project with Spaceship powered domain registration",
            "categories": [
                "domains"
            ],
            "pageUrl": "/marketplace/spaceship/",
            "searchText": "spaceship spaceship find the perfect domain for your project with spaceship powered domain registration domains spaceship/domain",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "domain",
                    "ref": "spaceship/domain",
                    "description": "Find the perfect domain for your project with Spaceship powered domain registration.",
                    "categories": [
                        "domains"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "domain",
                    "envPrefix": "SPACESHIP_DOMAIN",
                    "credentialKeys": [
                        "API_KEY",
                        "DOMAIN"
                    ],
                    "updateableTo": [
                        "domain"
                    ]
                }
            ]
        },
        {
            "slug": "squarespace",
            "name": "Squarespace",
            "url": "https://squarespace.com",
            "tosUrl": "https://squarespace.com/terms",
            "privacyUrl": "https://squarespace.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/squarespace.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "SQ",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Search domain names and find the right one for your website.",
            "categories": [
                "domains"
            ],
            "pageUrl": "/marketplace/squarespace/",
            "searchText": "squarespace squarespace search domain names and find the right one for your website. domains squarespace/domain",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "domain",
                    "ref": "squarespace/domain",
                    "description": "Register a domain with Squarespace",
                    "categories": [
                        "domains"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "domain",
                    "envPrefix": "SQUARESPACE_DOMAIN",
                    "credentialKeys": [
                        "API_KEY",
                        "DOMAIN"
                    ],
                    "updateableTo": [
                        "domain"
                    ]
                }
            ]
        },
        {
            "slug": "steel",
            "name": "Steel",
            "url": "https://steel.dev",
            "tosUrl": "https://steel.dev/terms",
            "privacyUrl": "https://steel.dev/privacy",
            "iconUrl": null,
            "brandColor": "#061b31",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "ST",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Browser automation API for AI agents. Managed headless browsers with session management, anti-detection, and proxy support.",
            "categories": [
                "browser"
            ],
            "pageUrl": "/marketplace/steel/",
            "searchText": "steel steel browser automation api for ai agents. managed headless browsers with session management, anti-detection, and proxy support. browser steel/browser",
            "plans": [
                {
                    "serviceId": "plan-launch",
                    "ref": "steel/plan-launch",
                    "description": "Steel Launch — usage-based cloud browsers. $30 free signup credit, then pay-as-you-go. Anti-bot/captcha unlocks once a payment method is on file.",
                    "categories": [
                        "browser"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "plan-scale",
                        "plan-launch"
                    ]
                },
                {
                    "serviceId": "plan-scale",
                    "ref": "steel/plan-scale",
                    "description": "Steel Scale — $250/mo platform fee, anti-bot included, higher concurrency, 30-day retention. Usage billed in arrears (browser $0.08/hr, captcha $1/1k, proxy $5/GB, scrape $5/1k).",
                    "categories": [
                        "browser"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$250 / month platform fee + usage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$250 / month platform fee + usage",
                            "status": "paid",
                            "description": "Platform fee billed monthly; usage billed in arrears.",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "plan-launch",
                        "plan-scale"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "browser",
                    "ref": "steel/browser",
                    "description": "A Steel cloud browser workspace (Steel project + API key). Provision to get a STEEL_API_KEY for cloud browser sessions, scrape, screenshots, PDFs, and CAPTCHA solving. Usage is metered and billed to your active plan.",
                    "categories": [
                        "browser"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "plan-launch",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "plan-scale",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "browser",
                    "envPrefix": "STEEL_BROWSER",
                    "credentialKeys": [
                        "API_KEY",
                        "PROJECT_ID"
                    ],
                    "updateableTo": [
                        "browser"
                    ]
                }
            ]
        },
        {
            "slug": "supabase",
            "name": "Supabase",
            "url": "https://supabase.com",
            "tosUrl": "https://supabase.com/terms",
            "privacyUrl": "https://supabase.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/supabase.svg",
            "brandColor": "#3ecf8e",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "SU",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Open source Firebase alternative with managed Postgres, Auth, Storage, Edge Functions, Realtime, and Vector search.",
            "categories": [
                "auth",
                "database",
                "storage"
            ],
            "pageUrl": "/marketplace/supabase/",
            "searchText": "supabase supabase open source firebase alternative with managed postgres, auth, storage, edge functions, realtime, and vector search. auth database storage supabase/project",
            "plans": [
                {
                    "serviceId": "free",
                    "ref": "supabase/free",
                    "description": "Supabase Free Plan: Unlimited API requests • Shared CPU • 500 MB RAM • 50K MAU • 500 MB database space • 5 GB bandwidth • 1 GB file storage",
                    "categories": [
                        "database",
                        "auth",
                        "storage"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "team",
                        "pro",
                        "free"
                    ]
                },
                {
                    "serviceId": "pro",
                    "ref": "supabase/pro",
                    "description": "Supabase Pro Plan: Dedicated CPU • 1 GB RAM • 100K MAU • 8 GB database space • 250 GB bandwidth • 100 GB file storage",
                    "categories": [
                        "database",
                        "auth",
                        "storage"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$25/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$25/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "team",
                        "free",
                        "pro"
                    ]
                },
                {
                    "serviceId": "team",
                    "ref": "supabase/team",
                    "description": "Supabase Team Plan: SOC2 • SSO for Supabase Dashboard • Priority email support & SLAs • 28-day log retention",
                    "categories": [
                        "database",
                        "auth",
                        "storage"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$599/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$599/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro",
                        "free",
                        "team"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "project",
                    "ref": "supabase/project",
                    "description": "A Supabase project with database, auth, and storage",
                    "categories": [
                        "database",
                        "auth",
                        "storage"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "free",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "paid",
                            "price": "$10 per project (first project on Micro compute free)",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "team",
                            "status": "paid",
                            "price": "$10 per project (first project on Micro compute free)",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "project",
                    "envPrefix": "SUPABASE_PROJECT",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "project"
                    ]
                }
            ]
        },
        {
            "slug": "supermemory",
            "name": "Supermemory",
            "url": "https://supermemory.ai",
            "tosUrl": "https://supermemory.ai/terms",
            "privacyUrl": "https://supermemory.ai/privacy",
            "iconUrl": "/assets/images/provider-favicons/supermemory.svg",
            "brandColor": "#1c2026",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "SU",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "AI memory layer for agents and apps. Store, retrieve, and reason over knowledge with vector and semantic search.",
            "categories": [
                "ai",
                "database",
                "search",
                "storage"
            ],
            "pageUrl": "/marketplace/supermemory/",
            "searchText": "supermemory supermemory ai memory layer for agents and apps. store, retrieve, and reason over knowledge with vector and semantic search. ai database search storage supermemory/memory",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "memory",
                    "ref": "supermemory/memory",
                    "description": "Memory for AI agents - context, SuperRAG, file system, profile, and connectors.",
                    "categories": [
                        "database",
                        "search",
                        "ai",
                        "storage"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "plan": "free"
                            },
                            "label": "free",
                            "price": "Free tier",
                            "status": "free",
                            "description": "Free tier",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "plan": "pro"
                            },
                            "label": "pro",
                            "price": "$19/month",
                            "status": "paid",
                            "description": "Pro tier",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "plan": "max"
                            },
                            "label": "max",
                            "price": "$100/month",
                            "status": "paid",
                            "description": "Max tier",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-3",
                            "configuration": {
                                "plan": "scale"
                            },
                            "label": "scale",
                            "price": "$399/month",
                            "status": "paid",
                            "description": "Scale tier",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Free tier",
                    "defaultResourceName": "memory",
                    "envPrefix": "SUPERMEMORY_MEMORY",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "memory"
                    ]
                }
            ]
        },
        {
            "slug": "tabstack",
            "name": "Tabstack",
            "url": "https://tabstack.com",
            "tosUrl": "https://tabstack.com/terms",
            "privacyUrl": "https://tabstack.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/tabstack.svg",
            "brandColor": "#00d230",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "TA",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Search API by Mozilla. Privacy-focused web search and retrieval infrastructure for applications and AI agents.",
            "categories": [
                "ai",
                "browser",
                "search"
            ],
            "pageUrl": "/marketplace/tabstack/",
            "searchText": "tabstack tabstack search api by mozilla. privacy-focused web search and retrieval infrastructure for applications and ai agents. ai browser search tabstack/api",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "api",
                    "ref": "tabstack/api",
                    "description": "Research and web content for AI agents: deep research, URL to clean markdown and structured JSON, and browser automation.",
                    "categories": [
                        "search",
                        "browser",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "plan": "trial"
                            },
                            "label": "trial",
                            "price": "10,000 credits included.",
                            "status": "free",
                            "description": "10,000 credits included.",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "plan": "starter"
                            },
                            "label": "starter",
                            "price": "$10/month",
                            "status": "paid",
                            "description": "100,000 credits included, then $0.30 per 1,000.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "plan": "team"
                            },
                            "label": "team",
                            "price": "$99/month",
                            "status": "paid",
                            "description": "500,000 credits included, then $0.30 per 1,000.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-3",
                            "configuration": {
                                "plan": "pro"
                            },
                            "label": "pro",
                            "price": "$499/month",
                            "status": "paid",
                            "description": "3,000,000 credits included, then $0.25 per 1,000.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "10,000 credits included.",
                    "defaultResourceName": "api",
                    "envPrefix": "TABSTACK_API",
                    "credentialKeys": [
                        "API_KEY",
                        "APP_ID"
                    ],
                    "updateableTo": [
                        "api"
                    ]
                }
            ]
        },
        {
            "slug": "turso",
            "name": "Turso",
            "url": "https://turso.tech",
            "tosUrl": "https://turso.tech/terms",
            "privacyUrl": "https://turso.tech/privacy",
            "iconUrl": "/assets/images/provider-favicons/turso.svg",
            "brandColor": "#183134",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "TU",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "SQLite for the agentic era. Lightweight, replicated databases with built-in vector search and automatic sync.",
            "categories": [
                "database"
            ],
            "pageUrl": "/marketplace/turso/",
            "searchText": "turso turso sqlite for the agentic era. lightweight, replicated databases with built-in vector search and automatic sync. database turso/database",
            "plans": [
                {
                    "serviceId": "starter",
                    "ref": "turso/starter",
                    "description": "100 DBs, 5 GB storage, 500M rows read, 10M rows written, 3 GB syncs, 1-day PITR",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "scaler_overages",
                        "developer",
                        "pro",
                        "developer_overages",
                        "scaler",
                        "pro_overages",
                        "starter"
                    ]
                },
                {
                    "serviceId": "developer",
                    "ref": "turso/developer",
                    "description": "Unlimited DBs (500 active), 9 GB storage, 2.5B rows read, 25M rows written, 10 GB syncs, 10-day PITR",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$5.99/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$5.99/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "scaler_overages",
                        "developer_overages",
                        "pro_overages",
                        "pro",
                        "scaler",
                        "developer"
                    ]
                },
                {
                    "serviceId": "scaler_overages",
                    "ref": "turso/scaler_overages",
                    "description": "Unlimited DBs (2,500 active), 24 GB storage, 100B rows read, 100M rows written, 24 GB syncs, 30-day PITR",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$29/month + overages: $0.05/DB, $0.50/GB storage, $0.80/B rows read, $0.80/M rows written, $0.25/GB syncs",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$29/month + overages: $0.05/DB, $0.50/GB storage, $0.80/B rows read, $0.80/M rows written, $0.25/GB syncs",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro",
                        "pro_overages",
                        "scaler_overages"
                    ]
                },
                {
                    "serviceId": "pro",
                    "ref": "turso/pro",
                    "description": "Unlimited DBs (10,000 active), 50 GB storage, 250B rows read, 250M rows written, 100 GB syncs, 90-day PITR",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$499/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$499/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro_overages",
                        "pro"
                    ]
                },
                {
                    "serviceId": "scaler",
                    "ref": "turso/scaler",
                    "description": "Unlimited DBs (2,500 active), 24 GB storage, 100B rows read, 100M rows written, 24 GB syncs, 30-day PITR",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$29/month",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$29/month",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "scaler_overages",
                        "pro",
                        "pro_overages",
                        "scaler"
                    ]
                },
                {
                    "serviceId": "developer_overages",
                    "ref": "turso/developer_overages",
                    "description": "Unlimited DBs (500 active), 9 GB storage, 2.5B rows read, 25M rows written, 10 GB syncs, 10-day PITR",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$5.99/month + overages: $0.20/DB, $0.75/GB storage, $1/B rows read, $1/M rows written, $0.35/GB syncs",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$5.99/month + overages: $0.20/DB, $0.75/GB storage, $1/B rows read, $1/M rows written, $0.35/GB syncs",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro_overages",
                        "scaler",
                        "scaler_overages",
                        "pro",
                        "developer_overages"
                    ]
                },
                {
                    "serviceId": "pro_overages",
                    "ref": "turso/pro_overages",
                    "description": "Unlimited DBs (10,000 active), 50 GB storage, 250B rows read, 250M rows written, 100 GB syncs, 90-day PITR",
                    "categories": [
                        "database"
                    ],
                    "scope": "account",
                    "status": "paid",
                    "price": "$499/month + overages: $0.025/DB, $0.45/GB storage, $0.75/B rows read, $0.75/M rows written, $0.15/GB syncs",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$499/month + overages: $0.025/DB, $0.45/GB storage, $0.75/B rows read, $0.75/M rows written, $0.15/GB syncs",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro_overages"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "database",
                    "ref": "turso/database",
                    "description": "Free SQLite-based database that's always on: no cold starts. Instant response every time. Concurrent writes. Unlimited databases.",
                    "categories": [
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "developer_overages",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "developer",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "scaler_overages",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro_overages",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "scaler",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "starter",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "database",
                    "envPrefix": "TURSO_DATABASE",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "database"
                    ]
                }
            ]
        },
        {
            "slug": "twilio",
            "name": "Twilio",
            "url": "https://twilio.com",
            "tosUrl": "https://www.twilio.com/en-us/legal/tos",
            "privacyUrl": "https://www.twilio.com/en-us/legal/privacy",
            "iconUrl": "/assets/images/provider-favicons/twilio.svg",
            "brandColor": "#e31e26",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "TW",
            "entry": {
                "status": "paid",
                "label": "$50 starting balance + auto-recharge"
            },
            "description": "Customer engagement platform with programmable communications and data APIs for adding intelligence and security to sales, marketing, service, and growth workflows.",
            "categories": [
                "email"
            ],
            "pageUrl": "/marketplace/twilio/",
            "searchText": "twilio twilio customer engagement platform with programmable communications and data apis for adding intelligence and security to sales, marketing, service, and growth workflows. email twilio/email",
            "plans": [
                {
                    "serviceId": "business",
                    "ref": "twilio/business",
                    "description": "Pay as you go, starting balance includes ~38,400 emails + 3000 free trial emails, automatically top up to $50 when account balance is below $10; great for small and medium-sized businesses; access to full Email capabilities",
                    "categories": [
                        "email"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$50 starting balance + auto-recharge",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$50 starting balance + auto-recharge",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "business"
                    ]
                },
                {
                    "serviceId": "hobbyist",
                    "ref": "twilio/hobbyist",
                    "description": "Pay as you go, starting balance includes ~15,300 emails + 3000 free trial emails, automatically top up to $20 when account balance is below $10; excellent choice for individuals; access to full Email capabilities",
                    "categories": [
                        "email"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$20 starting balance + auto-recharge",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$20 starting balance + auto-recharge",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "hobbyist"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "email",
                    "ref": "twilio/email",
                    "description": "Send emails at scale",
                    "categories": [
                        "email"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "hobbyist",
                            "status": "paid",
                            "price": "Based on selected plan",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "business",
                            "status": "paid",
                            "price": "Based on selected plan",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "email",
                    "envPrefix": "TWILIO_EMAIL",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "email"
                    ]
                }
            ]
        },
        {
            "slug": "upstash",
            "name": "Upstash",
            "url": "https://upstash.com",
            "tosUrl": "https://upstash.com/terms",
            "privacyUrl": "https://upstash.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/upstash.svg",
            "brandColor": "#00c98d",
            "brandIsMono": false,
            "brandInk": "dark",
            "brandIsPale": false,
            "fallbackInitials": "UP",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "The serverless platform for AI agents and modern apps.",
            "categories": [
                "database",
                "ai",
                "cache",
                "messaging",
                "search"
            ],
            "pageUrl": "/marketplace/upstash/",
            "searchText": "upstash upstash the serverless platform for ai agents and modern apps. database ai cache messaging search upstash/qstash upstash/redis upstash/search upstash/vector",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "qstash",
                    "ref": "upstash/qstash",
                    "description": "Upstash QStash - Serverless message queue.",
                    "categories": [
                        "messaging"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "price": "free"
                            },
                            "label": "free",
                            "price": "Free tier: 500 messages/day",
                            "status": "free",
                            "description": "Free tier: 500 messages/day",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "price": "payg"
                            },
                            "label": "payg",
                            "price": "$1 per 100K messages",
                            "status": "paid",
                            "description": "",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Usage-based",
                    "defaultResourceName": "qstash",
                    "envPrefix": "UPSTASH_QSTASH",
                    "credentialKeys": [
                        "API_KEY"
                    ],
                    "updateableTo": [
                        "qstash"
                    ]
                },
                {
                    "serviceId": "redis",
                    "ref": "upstash/redis",
                    "description": "Upstash Redis - Serverless Redis.",
                    "categories": [
                        "cache",
                        "database"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "price": "free"
                            },
                            "label": "free",
                            "price": "Free tier: 500,000 commands/month, 256MB storage",
                            "status": "free",
                            "description": "Free tier: 500,000 commands/month, 256MB storage",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "price": "payg"
                            },
                            "label": "payg",
                            "price": "$0.2 per 100K commands",
                            "status": "paid",
                            "description": "Data transfer included up to monthly limits",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Data transfer included up to monthly limits",
                    "defaultResourceName": "redis",
                    "envPrefix": "UPSTASH_REDIS",
                    "credentialKeys": [
                        "URL",
                        "TOKEN"
                    ],
                    "updateableTo": [
                        "redis"
                    ]
                },
                {
                    "serviceId": "search",
                    "ref": "upstash/search",
                    "description": "Upstash Search - Full-text + semantic search with built-in embeddings.",
                    "categories": [
                        "search"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "price": "free"
                            },
                            "label": "free",
                            "price": "Free tier: 10,000 documents",
                            "status": "free",
                            "description": "Free tier: 10,000 documents",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "price": "payg"
                            },
                            "label": "payg",
                            "price": "$0.05 per 1K search requests, $0.1 per 1K documents indexed",
                            "status": "paid",
                            "description": "",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Usage-based",
                    "defaultResourceName": "search",
                    "envPrefix": "UPSTASH_SEARCH",
                    "credentialKeys": [
                        "API_KEY",
                        "APP_ID"
                    ],
                    "updateableTo": [
                        "search"
                    ]
                },
                {
                    "serviceId": "vector",
                    "ref": "upstash/vector",
                    "description": "Upstash Vector - Serverless vector database.",
                    "categories": [
                        "database",
                        "ai"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "price": "free"
                            },
                            "label": "free",
                            "price": "Free tier: 10,000 vectors, 1,000 queries/day",
                            "status": "free",
                            "description": "Free tier: 10,000 vectors, 1,000 queries/day",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "price": "payg"
                            },
                            "label": "payg",
                            "price": "$0.4 per 100K query/upsert operations",
                            "status": "paid",
                            "description": "",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Usage-based",
                    "defaultResourceName": "vector",
                    "envPrefix": "UPSTASH_VECTOR",
                    "credentialKeys": [
                        "DATABASE_URL",
                        "DATABASE_HOST",
                        "DATABASE_USER",
                        "DATABASE_PASSWORD"
                    ],
                    "updateableTo": [
                        "vector"
                    ]
                }
            ]
        },
        {
            "slug": "vercel",
            "name": "Vercel",
            "url": "https://vercel.com",
            "tosUrl": "https://vercel.com/legal/terms",
            "privacyUrl": "https://vercel.com/legal/privacy-policy",
            "iconUrl": "/assets/images/provider-favicons/vercel.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "VE",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Frontend cloud platform. Deploy to the edge with automatic CI/CD, edge functions, and global CDN.",
            "categories": [
                "compute"
            ],
            "pageUrl": "/marketplace/vercel/",
            "searchText": "vercel vercel frontend cloud platform. deploy to the edge with automatic ci/cd, edge functions, and global cdn. compute vercel/project",
            "plans": [
                {
                    "serviceId": "hobby",
                    "ref": "vercel/hobby",
                    "description": "The perfect starting place for your web app or personal project.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "status": "free",
                    "price": "Free",
                    "tiers": [],
                    "updateableTo": [
                        "pro",
                        "hobby"
                    ]
                },
                {
                    "serviceId": "pro",
                    "ref": "vercel/pro",
                    "description": "Everything you need to build and scale your app.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "status": "paid",
                    "price": "$20/mo + additional usage",
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {},
                            "label": "Option 1",
                            "price": "$20/mo + additional usage",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "updateableTo": [
                        "pro",
                        "hobby"
                    ]
                }
            ],
            "deployables": [
                {
                    "serviceId": "project",
                    "ref": "vercel/project",
                    "description": "An application deployed from a Git repository with automatic deployments on every branch push.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "component",
                    "planOptions": [
                        {
                            "planServiceId": "hobby",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        },
                        {
                            "planServiceId": "pro",
                            "status": "free",
                            "price": "Free",
                            "isDefault": false
                        }
                    ],
                    "tiers": [],
                    "status": "paid",
                    "price": "Depends on plan",
                    "defaultResourceName": "project",
                    "envPrefix": "VERCEL_PROJECT",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "project"
                    ]
                }
            ]
        },
        {
            "slug": "wix",
            "name": "Wix",
            "url": "https://wix.com",
            "tosUrl": "https://wix.com/terms",
            "privacyUrl": "https://wix.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/wix.svg",
            "brandColor": "#000000",
            "brandIsMono": true,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "WI",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Headless web platform for building and managing sites with flexible APIs and enterprise-grade hosting.",
            "categories": [
                "ecommerce"
            ],
            "pageUrl": "/marketplace/wix/",
            "searchText": "wix wix headless web platform for building and managing sites with flexible apis and enterprise-grade hosting. ecommerce wix/headless",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "headless",
                    "ref": "wix/headless",
                    "description": "Use Wix Business to let your customers purchase products and services through your site.",
                    "categories": [
                        "ecommerce"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "plan": "free"
                            },
                            "label": "free",
                            "price": "Free",
                            "status": "free",
                            "description": "",
                            "isDefault": true,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "plan": "premium"
                            },
                            "label": "premium",
                            "price": "paid",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Usage-based",
                    "defaultResourceName": "headless",
                    "envPrefix": "WIX_HEADLESS",
                    "credentialKeys": [
                        "STORE_DOMAIN",
                        "ADMIN_TOKEN",
                        "STOREFRONT_TOKEN"
                    ],
                    "updateableTo": [
                        "headless"
                    ]
                }
            ]
        },
        {
            "slug": "wordpress",
            "name": "WordPress.com",
            "url": "https://wordpress.com",
            "tosUrl": "https://wordpress.com/terms",
            "privacyUrl": "https://wordpress.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/wordpress.svg",
            "brandColor": "#3858e9",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "WO",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Managed WordPress hosting with built-in domains, CDN, built-in AI, automatic updates, and enterprise-grade infrastructure.",
            "categories": [
                "compute",
                "domains"
            ],
            "pageUrl": "/marketplace/wordpress/",
            "searchText": "wordpress.com wordpress managed wordpress hosting with built-in domains, cdn, built-in ai, automatic updates, and enterprise-grade infrastructure. compute domains wordpress/domain wordpress/site",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "domain",
                    "ref": "wordpress/domain",
                    "description": "Domain registration",
                    "categories": [
                        "domains"
                    ],
                    "scope": "project",
                    "selectionMode": "free",
                    "planOptions": [],
                    "tiers": [],
                    "status": "free",
                    "price": "Free",
                    "defaultResourceName": "domain",
                    "envPrefix": "WORDPRESS_DOMAIN",
                    "credentialKeys": [
                        "API_KEY",
                        "DOMAIN"
                    ],
                    "updateableTo": [
                        "domain"
                    ]
                },
                {
                    "serviceId": "site",
                    "ref": "wordpress/site",
                    "description": "Free and Paid fully-managed WordPress sites with unlimited power, unrivaled speed, and rock-solid reliability.",
                    "categories": [
                        "compute"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "plan": "free"
                            },
                            "label": "free",
                            "price": "Launch your site on the web at no cost, with 1 GB of storage, built-in visitor stats, and community support to get you started.",
                            "status": "free",
                            "description": "Launch your site on the web at no cost, with 1 GB of storage, built-in visitor stats, and community support to get you started.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "plan": "personal"
                            },
                            "label": "personal",
                            "price": "$9 per month",
                            "status": "paid",
                            "description": "Install any plugin or theme and make it yours with a custom domain, premium themes, and an ad-free experience. Adds 6 GB of storage.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-2",
                            "configuration": {
                                "plan": "premium"
                            },
                            "label": "premium",
                            "price": "$18 per month",
                            "status": "paid",
                            "description": "Powerful design and customization tools, 4K video uploads, and deeper analytics, including Google Analytics integration. Adds 13 GB of storage.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-3",
                            "configuration": {
                                "plan": "business"
                            },
                            "label": "business",
                            "price": "$40 per month",
                            "status": "paid",
                            "description": "Unlock the full power of managed WordPress and 24/7 priority support: use staging, real-time backups, SFTP/SSH, WP-CLI, and Git. Adds 50 GB of storage.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-4",
                            "configuration": {
                                "plan": "commerce"
                            },
                            "label": "commerce",
                            "price": "$70 per month",
                            "status": "paid",
                            "description": "Everything in Business plus a complete online store. Sell unlimited products with WooCommerce, premium store themes, and zero transaction fees on payments.",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Launch your site on the web at no cost, with 1 GB of storage, built-in visitor stats, and community support to get you started.",
                    "defaultResourceName": "site",
                    "envPrefix": "WORDPRESS_SITE",
                    "credentialKeys": [
                        "API_KEY",
                        "REGION"
                    ],
                    "updateableTo": [
                        "site"
                    ]
                }
            ]
        },
        {
            "slug": "workos",
            "name": "WorkOS",
            "url": "https://workos.com",
            "tosUrl": "https://workos.com/terms",
            "privacyUrl": "https://workos.com/privacy",
            "iconUrl": "/assets/images/provider-favicons/workos.svg",
            "brandColor": "#6363f1",
            "brandIsMono": false,
            "brandInk": "light",
            "brandIsPale": false,
            "fallbackInitials": "WO",
            "entry": {
                "status": "free",
                "label": "Free tier"
            },
            "description": "Infrastructure for selling to enterprise, covering SSO, SCIM, RBAC, Audit Logs, AI governance, and more.",
            "categories": [
                "auth"
            ],
            "pageUrl": "/marketplace/workos/",
            "searchText": "workos workos infrastructure for selling to enterprise, covering sso, scim, rbac, audit logs, ai governance, and more. auth workos/auth",
            "plans": [],
            "deployables": [
                {
                    "serviceId": "auth",
                    "ref": "workos/auth",
                    "description": "WorkOS AuthKit — drop-in authentication with SSO, MFA, and user management.",
                    "categories": [
                        "auth"
                    ],
                    "scope": "project",
                    "selectionMode": "tiered",
                    "planOptions": [],
                    "tiers": [
                        {
                            "id": "tier-0",
                            "configuration": {
                                "environment": "sandbox"
                            },
                            "label": "sandbox",
                            "price": "Free",
                            "status": "free",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        },
                        {
                            "id": "tier-1",
                            "configuration": {
                                "environment": "production"
                            },
                            "label": "production",
                            "price": "Free up to 1M MAU, $2,500/mo per million above",
                            "status": "paid",
                            "description": "",
                            "isDefault": false,
                            "terms": null,
                            "tosUrl": null
                        }
                    ],
                    "status": "paid",
                    "price": "Usage-based",
                    "defaultResourceName": "auth",
                    "envPrefix": "WORKOS_AUTH",
                    "credentialKeys": [
                        "PUBLISHABLE_KEY",
                        "SECRET_KEY",
                        "ISSUER_URL"
                    ],
                    "updateableTo": [
                        "auth"
                    ]
                }
            ]
        }
    ]
};
