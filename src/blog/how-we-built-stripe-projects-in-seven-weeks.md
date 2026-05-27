---
title: "How we built Stripe Projects in seven weeks"
author: "Rami Banna"
date: 2026-04-30
description: "From ideation to developer preview in seven weeks — how AI-powered development, a growing provider network, and a focus on agent infrastructure shaped Stripe Projects."
tags: ["launch", "engineering"]
---

When we first ideated Stripe Projects, we were inspired by Andrej Karpathy's blog post in October 2025 that perfectly captured a frustration every developer knows well: vibecoding an app is easy. Vibe deploying…not so much. The goal was simple: make it easier to go from "I have an idea" to "I have a real stack".

## The bottleneck was not just provisioning

You can go from idea to prototype in minutes. But turning that prototype into a real product still takes too much work. You need a database. Auth. Hosting. Email. Observability. Analytics. Maybe search, queues, AI models, sandboxes, or browser automation. Each one usually means opening another dashboard, creating another account, configuring another service, copying another API key, and figuring out how billing works.

The hard part of provisioning is rarely the API call itself. It's everything around it: account creation, authentication, usage attribution, payments, credentials, and upgrades. The primary reason you are forced to create individual accounts for every service, rather than simply hitting permissionless APIs, is to enable usage attribution and payment.

If an agent can build an app in minutes, the surrounding stack shouldn't take hours to assemble. So we asked: what if developers, and eventually their agents, could provision real production services directly from the terminal?

## From prototype to developer preview in seven weeks

Agents are already helping developers write software. But for agents to do more than generate code, they need a reliable way to interact with the services that software depends on. That means infrastructure providers need a secure path into agentic workflows: a way to let agents request services, receive credentials, configure environments, and support upgrades without unsafe key sharing, brittle browser automation, or one-off integrations for every platform. Stripe Projects is designed to provide that path.

We moved from coding to developer preview in seven weeks. Our entire development lifecycle was AI-powered from day one: prototypes, specs, docs, usability testing, the majority of the code, marketing collateral, even the website. Our engineers sent entire armadas of agents at the problem round the clock, building core APIs and infrastructure.

This speed extended to our partners. In our Slack channels, when we'd report a bug to one of our providers, their engineer would invoke Claude in the channel to fix the problem in real-time. The ecosystem moved at AI-speed in lock-step.

## The network effect

One thing we heard early and often from developers was that they didn't just want to try Stripe Projects themselves — they wanted to integrate it into their own products, workflows, and agent experiences. That changed how we thought about the product.

When we launched developer preview in March, the first wave of providers helped us prove the core idea: developers and agents need a standard way to provision services, receive credentials, and upgrade when they are ready. Stripe Projects is not just a CLI. It is a network for provisioning the developer stack.

Developers get a faster path from idea to infrastructure. Providers get a new distribution surface. Platforms and agents get a standard way to request services, receive credentials, and help users upgrade when they are ready.

Today, there are 32 live providers in the network. The important story isn't the number of providers but what those providers now enable: hosting, databases, auth, analytics, observability, AI models, search, email, browser automation, sandboxes, storage, infrastructure, domain purchases, and more. Breadth matters. Our goal is to create the infrastructure for agent…everything.

## Stripe Projects is now available for everyone

The new group of providers joining the network continue to grow what developers and agents can do:

- **Agentmail** brings email infrastructure into the flow, so products can send transactional and agent-generated email without breaking momentum.
- **Algolia** adds search, one of those capabilities that often starts as "we'll do this later" and then quickly becomes core to the product experience.
- **Auth0** brings more identity options into the network, especially for teams building products that need enterprise-grade authentication.
- **Browserbase** gives agents a browser runtime, an increasingly important primitive for AI workflows that need to navigate, inspect, test, or interact with the web.
- **Daytona** adds development sandboxes: isolated environments where agents and developers can run code, test changes, and make a mess somewhere safe.
- **ElevenLabs** brings voice and audio AI, opening up more room for products that are not just text boxes talking to models.
- **GitLab** adds CI/CD, helping connect the gap between provisioning a stack and actually shipping changes through a real development workflow.
- **Netlify** adds another fast, developer-friendly hosting path for frontend and full-stack applications.
- **Privy** adds wallet and embedded account infrastructure for products building with payments, crypto, or user-owned assets.
- **Render** adds another flexible hosting option for backend, frontend, and full-stack applications.
- **Sentry** adds observability, because the moment your app has users, "it worked locally" stops being a monitoring strategy.
- **Twilio** is starting with email in Stripe Projects, giving developers a way to add email infrastructure from the same flow. The Twilio account users provision can also be used across Twilio's broader communications platform, and over time we expect to bring more of those capabilities into Projects directly.
- **Upstash** adds serverless data infrastructure like Redis and queues, useful for caching, rate limits, background work, and the glue that keeps modern apps responsive.
- **WorkOS** brings another strong enterprise auth and identity option, especially for teams that need SSO, directory sync, and admin-friendly workflows.

You can get started with Stripe Projects from the CLI and explore the providers at [projects.dev/providers](/providers/).

---

*Originally published on [X](https://x.com/mrramibanna/status/2049853493104836711)*
