---
title: "How to provision your full dev stack from the command line"
author: "Rami Banna"
date: 2026-05-15
description: "A database, hosting, auth, and monitoring — provisioned, credentials wired, and ready to use — in about ten minutes. Here's exactly how."
tags: ["tutorial", "cli"]
---

*A database, hosting, auth, and monitoring—provisioned, credentials wired, and ready to use—in about ten minutes. Here's exactly how.*

---

There's a specific kind of friction that kills side projects before they ship: the infrastructure setup loop.

You know it. You create a new repo, open your editor, write three lines of code—and then spend the next two hours creating accounts, navigating dashboards, generating API keys, copying connection strings into `.env` files, and realizing you got the variable name wrong. By the time you're actually building, you've lost the thread.

This post is about skipping that. Specifically, how to go from an empty directory to a fully provisioned dev stack—Postgres database, hosted deployment, auth provider, error monitoring—using the Stripe CLI, without touching a single dashboard.

---

## What you'll end up with

By the end of this guide, you'll have:

- A **Postgres database** (Neon), live and connected
- A **hosting deployment** (Vercel), wired to your repo
- **Auth** (Clerk), configured and credential-synced
- **Error monitoring** (Sentry), capturing exceptions from day one
- A `.env` file with every credential in it, ready to use
- All of it billed through Stripe—one payment method on file, spend across every provider visible in one place

Time to complete: roughly 10 minutes, mostly waiting for services to provision.

---

## Prerequisites

You'll need the Stripe CLI and the Projects plugin:

```bash
# Install the Stripe CLI
brew install stripe/stripe-cli/stripe

# Install the Projects plugin
stripe plugin install projects
```

Log in to Stripe:

```bash
stripe login
```

If you don't have a Stripe account, you can create one at [dashboard.stripe.com](https://dashboard.stripe.com). You won't need to enable payments—Projects works independently of your payment integration.

---

## Step 1: Initialize your project

Navigate to your project directory—or create a new one—and initialize it:

```bash
mkdir my-app && cd my-app
stripe projects init
```

This creates a lightweight project manifest that tracks which services are attached to this directory. It's the anchor for everything that follows.

---

## Step 2: Provision a database

Add a Postgres database from Neon:

```bash
stripe projects add neon/postgres
```

What's happening behind the scenes: Stripe Projects calls the Neon API, creates a real Neon project in your account, generates a connection string, and writes it to your local project vault and `.env` file.

You'll see something like:

```
✓ Created neon/postgres
  DATABASE_URL=postgresql://user:password@ep-cool-name-123.us-east-2.aws.neon.tech/neondb?sslmode=require
  Written to .env
```

That's a live, accessible database. Open your app and start connecting to it.

Prefer Supabase? The command is the same pattern:

```bash
stripe projects add supabase/postgres
```

Or if you want a lightweight edge database:

```bash
stripe projects add turso/database
```

You can also add a Redis-compatible cache (useful for sessions, queues, rate limiting):

```bash
stripe projects add upstash/redis
```

---

## Step 3: Set up hosting

Add a Vercel project:

```bash
stripe projects add vercel/project
```

This creates a Vercel project linked to your Stripe account. Credentials and project identifiers are written to your `.env`. When you're ready to deploy, connect your repo in the Vercel dashboard—your environment variables will already be there.

Prefer a different host? Stripe Projects covers several:

```bash
stripe projects add netlify/site     # Netlify
stripe projects add railway/project  # Railway
stripe projects add render/service   # Render
stripe projects add fly/app          # Fly.io
```

Pick the one that fits your stack. They all follow the same pattern: one command, credentials in `.env`.

---

## Step 4: Add auth

Authentication is one of the highest-effort parts of a new stack. Add Clerk:

```bash
stripe projects add clerk/auth
```

You'll get your Clerk publishable key and secret key written to `.env` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (or the equivalent for your framework). No Clerk dashboard setup required to get started.

If you're using WorkOS instead (common for B2B products):

```bash
stripe projects add workos/auth
```

---

## Step 5: Set up error monitoring

Add Sentry before you ship, not after your first incident:

```bash
stripe projects add sentry/monitor
```

Your `SENTRY_DSN` and `SENTRY_AUTH_TOKEN` are written to `.env`. Initialize the Sentry SDK in your app and exceptions will start flowing immediately.

---

## Step 6: Sync your environment

If you've run multiple `projects add` commands, pull all credentials into a single `.env` file:

```bash
stripe projects env --pull
```

Your `.env` now looks something like:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
SENTRY_DSN=https://...@sentry.io/...
VERCEL_PROJECT_ID=prj_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

Every variable is real. Every service is live. You didn't navigate a single dashboard.

---

## A note on credentials

Stripe Projects writes your credentials to a local vault in addition to `.env`. This means you can repull your `.env` at any time with `stripe projects env --pull`, even if you delete the file. It also means you should treat your vault like you treat your other secrets—don't commit it to source control.

Add `.env` to your `.gitignore` if you haven't already:

```bash
echo ".env" >> .gitignore
```

When you're ready to set up a staging environment, Projects supports named environments with their own isolated credential sets:

```bash
stripe projects env create staging --output .env.staging
```

This provisions a fresh set of credentials for each service—a separate Neon database, a separate Sentry project, and so on—written to `.env.staging`. Your local dev environment and your staging environment stay cleanly separated, with no manual credential juggling required.

---

## What your stack looks like

Five commands (plus the initial setup) got you here:

```bash
stripe projects init
stripe projects add neon/postgres
stripe projects add vercel/project
stripe projects add clerk/auth
stripe projects add sentry/monitor
stripe projects env --pull
```

You have a full production-capable dev stack. The services are real—not sandboxed, not simulated. You can start writing application code immediately.

All five providers run their billing through Stripe. One payment method, and you can monitor and manage spend across all of them from a single place.

---

## What to add next

Stripe Projects has 33 providers across every category you'll need. Common additions at this point:

**AI inference:** `stripe projects add openrouter/ai` — OpenRouter gives you access to every major model (OpenAI, Anthropic, Gemini, and more) with a single API key. Your `OPENROUTER_API_KEY` is in `.env` in seconds.

**Analytics:** `stripe projects add posthog/analytics` or `stripe projects add mixpanel/analytics`

**Background jobs:** `stripe projects add inngest/functions`

**Transactional email:** `stripe projects add agentmail/email`

**Vector database (for RAG):** `stripe projects add chroma/database`

The full catalog is at [projects.dev/providers](https://projects.dev/providers). All of them follow the same pattern. Add what you need, when you need it.

---

## For coding agents

If you're working with a coding agent—Cursor, Claude Code, GitHub Copilot Workspace, Codex—Stripe Projects is designed to be invoked non-interactively. That means your agent can run `stripe projects add` as part of its build loop, provision the services it needs, and get structured credentials back without opening a browser or waiting on a human to copy-paste an API key.

---

## Wrapping up

Provisioning a dev stack used to mean an afternoon of dashboard work before you could write a line of application code. It doesn't have to.

Stripe Projects gives you a CLI catalog of every service you're likely to need, provisions real instances with a single command, and handles the credential management automatically. The goal is simple: more time building, less time configuring.

```bash
stripe plugin install projects
```

*Browse the full [provider catalog](https://projects.dev/providers), or follow the [quickstart](https://projects.dev) to get your first service running in under two minutes.*
