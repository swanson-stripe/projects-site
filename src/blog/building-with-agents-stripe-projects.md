---
title: "From init to deploy: building with agents and Stripe Projects"
author: "Anna Spysz"
date: 2026-04-29
description: "How we used Stripe Projects CLI, OpenRouter, and Vercel to build an internal tool that reduced transcript editing time by 4x."
tags: ["agents", "build"]
---

Stripe Projects CLI, OpenRouter, and Vercel were used to build an internal tool that reduced transcript editing time by 4x.

## The problem: too many transcripts!

The Developer Relations team at Stripe produces many videos for the Stripe Developers YouTube channel. All videos need accurate subtitles since the original English captions are then used by Google to build 22 language translations and 16 voice dubs. Auto-captioning tools make mistakes with proper nouns and technical terms, requiring human review.

The team calculated it takes between 1.5 and 2 times as many minutes to edit auto-generated subtitles as the length of the video, meaning 30-40 minutes editing subtitles for a 20-minute video — a repetitive task well-suited for an agent.

## The solution: an agentic transcription app

### Planning

Requirements for the transcription app:

- Hosted accessibly for teammates with built-in auth to prevent unauthorized token usage
- An API providing access to different LLM models, with cheaper options for simple transcripts and advanced models available as needed
- Stripe Projects CLI to link all providers and environment variables in one place
- A clean single-page UI with dark mode support

The initial prompt asked for a web application with a split layout: original transcript input on the top left, chat instructions on the bottom left, and fixed transcript on the right half. It specified using Stripe Projects CLI and referenced an example JSON file.

The resulting plan included TODOs:

- Implementing a split-pane transcription/chat/output UI with session-only state
- Creating routes for the request/response contract for iterative transcript fixing
- Adding a `transcriptAgent` with a system prompt and helpers
- Wiring the frontend to new API routes
- Comprehensive testing

### Setup

Project scaffolding was created with `npx create-next-app@latest transcription-fixer`, then Projects was initialized:

```shell
stripe projects init
```

This scaffolds files like `AGENTS.md` and directories with skills and rules for agents, plus a `.projects/state.json` file as the source of truth for integrations.

Vercel was linked with an existing account:

```shell
stripe projects add vercel/projects
```

The resulting `.projects/state.json`:

```json
{
  "version": 1,
  "providers": {
    "vercel": {
      "name": "Vercel"
    }
  },
  "resources": {
    "vercel-project": {
      "name": "vercel-project",
      "providerName": "Vercel",
      "serviceId": "project"
    }
  }
}
```

### Adding the app logic

OpenRouter was added as an AI provider. Setup required:

1. Adding a payment method in the Stripe Dashboard
2. Running `stripe projects add openrouter/api`

Running `stripe projects status` confirmed both providers were linked, showing OpenRouter and Vercel as linked services. The local `.env` file was auto-populated with `OPENROUTER_API_KEY` and `OPENROUTER_TYPE` with correct values.

### Let the agent cook (with recipes)

The bulk of time was spent composing the system prompt for the transcription agent. The agent was given tools like `search_stripe_documentation` using Stripe's MCP server and a few-shot example from a previously hand-fixed transcript.

The final system prompt defined the agent as "an expert transcription cleanup agent" with critical formatting requirements to preserve line structure, whitespace, timestamps, speaker labels, and ordering. It included default cleanups for removing leading filler utterances ("uh", "um", etc.) and output requirements to return only the fixed transcript without markdown fences or commentary.

### Results

Benchmark results using a 771-line meetup talk script:

| Model | Time | Accuracy | Tokens |
| --- | --- | --- | --- |
| Auto (google/gemini-3-flash-preview) | 40.22s | 85% | 31,724 tokens |
| Google Gemini 2.5 Pro | 90.54s | 99% | 36,486 tokens, 4,814 reasoning |
| Claude Sonnet 4.5 | 137.67s | 90% | 25,781 tokens |
| Claude Opus 4.5 - thinking | 298.57s | 95% | 35,348 tokens, 4,452 reasoning |

The 20-minute talk went from 30+ minutes of editing to about two minutes of generated edits plus 2-3 minutes of human review — a 4x reduction. Total testing cost over several days of building: $2.54.

### Going live

Environment variables needed to be added to Vercel's production environment. Two options:

1. Vercel CLI with `vercel env add [NAME] [ENVIRONMENT]` (one by one)
2. Vercel Dashboard import of `.env` file

The former was chosen since only `OPENROUTER_API_KEY` was needed. Deployment was done with `vercel --prod`.

## Next steps

Future plans include adding agent memory via a database for storing previously accepted transcriptions. Running `stripe projects catalog` lists database providers including:

| Provider | Pricing |
| --- | --- |
| `chroma/database` | Paid |
| `cloudflare/d1` | Free & Paid |
| `neon/postgres` | Free & Paid |
| `planetscale/mysql` | Paid |
| `planetscale/postgresql` | Paid |
| `railway/postgres` | Free & Paid |
| `supabase/project` | Free & Paid |
| `turso/database` | Free & Paid |
| `upstash/redis` | Free & Paid |

Teammates can pull correct API keys with:

```shell
stripe projects env --pull
```

Credential rotation is handled with:

```shell
stripe projects rotate <provider>/<service>
```

Get started at [projects.dev](https://projects.dev/).

---

*Originally published on [stripe.dev](https://stripe.dev/blog/building-with-agents-stripe-projects)*
