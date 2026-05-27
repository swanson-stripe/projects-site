---
title: "Provision a production-ready dev stack from your terminal"
author: "Rami Banna"
date: 2026-03-26
description: "Stripe Projects is a new CLI tool that lets you provision real services from the terminal, keep resources in your provider accounts, sync credentials safely, and upgrade to paid tiers."
tags: ["launch", "cli"]
---

The blog post describes how after prototyping with an AI agent, developers face the tedious process of turning a local project into a real environment. You end up opening multiple dashboards for hosting, databases, auth, and analytics, generating keys and pasting them into `.env` files. By the time you're done, you've got resources scattered across providers and credentials spread across files, terminals, and tabs.

The core problem: provisioning a modern app stack is still too manual. Dashboard hopping, brittle guides, and copy/paste credentials create key sprawl. It's worse for AI agents since agents need deterministic steps and real credentials, not screenshots and guesswork.

[Stripe Projects](https://projects.dev) is a new Stripe CLI tool, built with an integration protocol co-designed with developer tool providers, that lets you provision real services from the terminal, keep resources in your provider accounts, sync credentials safely, and upgrade to paid tiers without leaving the terminal.

## Try it yourself

In roughly 10 minutes, you go from a local repo to a working stack backed by provider accounts you own—attaching hosting, a database, auth, analytics, and AI building blocks, then syncing real credentials back into your environment.

### Step 1: Install the Stripe CLI and create a Project

Install the Stripe CLI and the Projects plugin, then initialize:

```bash
brew install stripe/stripe-cli/stripe && stripe plugin install projects
stripe projects init [my-app]
```

#### What you should expect:

- A project is created and populated with `.projects` configurations, a blank `.env`, and relevant agent skills.
- You'll be guided to add new services or link existing provider accounts.
- Your project is configured with a secure credential store that can sync into local dev, CI, or a team secret manager.

#### What is a project?

A project is the unit Stripe Projects manages—a lightweight manifest plus a Stripe-backed record of attached services, owned provider accounts, and required credentials. It's designed to be repeatable across machines and teammates, and deterministic enough for agents to operate safely.

### Step 2: Add services from co-design partners

The integration protocol is being co-designed with popular providers, standardizing provisioning, plan selection/upgrades, and credential handoff so the CLI and agents can operate reliably.

#### Services available in the developer preview:

| Provider | Categories |
| --- | --- |
| [Vercel](https://vercel.com) | Hosting |
| [Railway](https://railway.com) | Hosting, Databases, Storage |
| [Supabase](https://supabase.com) | Databases, Auth |
| [Neon](https://neon.tech) | Databases, Auth |
| [PlanetScale](https://planetscale.com) | Databases |
| [Turso](https://turso.tech) | Databases |
| [Chroma](https://www.trychroma.com) | Vector database |
| [PostHog](https://posthog.com) | Analytics |
| [Clerk](https://clerk.com) | Auth |
| [Runloop](https://www.runloop.ai) | Sandboxes |

Example flow:

```bash
stripe projects catalog

stripe projects add vercel/project
stripe projects add neon/postgres
stripe projects add clerk/auth
stripe projects add railway/bucket
stripe projects add chroma/database
```

#### You should expect:

- Resources are provisioned in your own provider account, with normal access and dashboards.
- Credentials are returned in a format that works for humans and agents.
- Changes are auditable and repeatable.

### Step 3: Upgrade to a paid tier when you're ready

A common flow is starting free, then upgrading once the app is real.

```bash
stripe projects status

stripe projects upgrade <provider>/<service>
```

When upgrading, Projects handles payment without re-entering details across dashboards. You add your payment method to Stripe once. The CLI then tokenizes your payment credentials into a [Shared Payment Token](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens), granting the provider a scoped payment credential for that upgrade. The provider will charge using that token, while your underlying payment credentials stay protected.

In the developer preview, this payment handoff is only available in the US, EU, UK, and Canada, for supported providers and plans.

### Step 4: Sync credentials to your environment

```bash
stripe projects env --pull
```

The biggest security footgun in developer workflows is still key sprawl: keys living in Slack messages, old `.env` files, random notes. Projects treats credentials like first-class infrastructure.

This also benefits teams: onboarding a new engineer becomes a predictable, auditable step instead of a scavenger hunt. Re-syncing credentials on new laptops, dev boxes, or CI environments takes minutes with the same flow every time.

After a sync (values redacted):

```bash
VERCEL_PROJECT_ID=...
NEON_DATABASE_URL=...
CLERK_SECRET_KEY=...
POSTHOG_PROJECT_API_KEY=...
CHROMA_API_KEY=...
```

## Get started from the CLI or through your coding agent

Install and initialize:

```bash
brew install stripe/stripe-cli/stripe && stripe plugin install projects
stripe projects init [my-app]
```

When you initialize, Stripe Projects writes coding-agent skills into your local project directory, giving your agent the context and actions needed to work against your project locally.

You can use the CLI directly or ask your agent for outcomes like setting up hosting, databases, and analytics. The agent uses the same CLI workflow under the hood, so provisioning, upgrades, configuration, and credential sync all happen in a deterministic, auditable way without leaving your terminal.

---

*Originally published on [stripe.dev](https://stripe.dev/blog/production-ready-dev-stack-from-terminal)*
