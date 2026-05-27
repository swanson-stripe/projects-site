---
title: "Learnings from init to deploy"
author: "Anna Spysz"
date: 2026-05-04
description: "Practical takeaways from building a transcription app with agentic workflows and Stripe Projects — from planning to PR review."
tags: ["agents", "learnings"]
---

This post follows up on a previous piece about building a transcription app using Stripe Projects, OpenRouter, and Vercel. The app processes video subtitle files through an AI agent via the OpenRouter API, using a system prompt and tool calls to Stripe documentation to ensure correct spelling and capitalization, then returns a properly formatted transcription file.

This was my first experience using an agent to carry a project from `init` to deploy, and here are my takeaways.

## Always have a plan

The parallel to pre-agentic software engineering is clear: features started with design documents containing architecture changes, features, and UX flows. This remains true even when agents write and review the doc.

A good agent-designed plan should include a goal, data flow understanding, architecture section, and task list. The agent designs this based on requirements; the engineer's job is to read it thoroughly and make changes based on judgment.

For example, when the agent asked about streaming, I followed up asking whether our Vercel-hosted NextJS app could support streaming for transcripts running thousands of lines. The agent responded:

> Streaming is the only architecture that can realistically handle long auto-generated subtitle transcripts on Vercel.

The agent explained that non-streaming serverless functions are capped at 10s on Hobby and 60s on Pro, and must return full responses within that window, meaning long transcripts would routinely get cut off as 504 errors. I verified this and implemented streaming successfully.

## Do your own research

[Stripe Projects](https://projects.dev) makes adding new services very easy, which can tempt you to skip research on which service to use. Being new to OpenRouter, I wasn't initially aware of its [Free Models Router](https://openrouter.ai/openrouter/free) and later revised my implementation to first try a free model, only using paid ones if the user chooses.

Taking time for a solid plan up front saves debugging time later. The same applies to choosing providers and learning their APIs.

## Don't skimp on models

The transcription app initially offered three tiers: free, auto, and Claude. The free model results were disappointing — rather than following system prompt instructions to stick to the original script, it condensed a 700-line script into a 100-line summary:

```
1
00:00:00,360 --> 00:00:07,200
Hello, Dublin. My name is Anna Spysz. And today I'll show you how to integrate Stripe payments seamlessly.

2
00:00:07,200 --> 00:00:13,880
Stripe offers three options: payment links, embedded buttons, or custom development. Choose based on your needs.

[...]

17
00:01:54,709 --> 00:02:01,690
Done! Your site now accepts payments smoothly.
```

It at least kept the (now inaccurate) timestamps. These results led to removing the free option entirely, defaulting to `openrouter/auto`. Further testing showed reasoning models were far more accurate, leading to swapping Claude Sonnet 4.5 for Claude Opus 4.5 - thinking.

The same principle applies to choosing models for planning and building features. Higher-quality thinking models should be used for planning and reviewing where possible, with less complex models acceptable for implementation if they follow the plan.

## Check in your agent files

My previous instinct was to add `.agents/` or `.cursor/` contents to `.gitignore`. However, I noticed that `stripe projects init` only added `.env` and cache files to `.gitignore` while keeping agent-specific files committed.

The reasoning: if teammates are both using agents, they want shared knowledge (skills) and shared rules for code consistency. Just as you wouldn't add `eslint.config` to `.gitignore`, you shouldn't add `AGENTS.md`.

## Be your own adversary

Beyond reading agent-created plans carefully, you need to review agent-created code before checking it in — but you don't need to be the first reviewer. I maintain `agents/pr-reviewer.md`, an agent persona following our organization's best practices for PR reviews, including internal tools, style guides, testing coverage, accessibility, and security guidelines.

After the agent completes all plan tasks, spin up another agent with the `pr-reviewer` persona and ask it to review changes compared to `main`. Importantly, give it opportunity to say "LGTM" — agents will find issues if told to, and can be just as guilty of over-engineering as humans.

If problems are found, the agent lists them by severity. The engineer should then review the code themselves, assess whether they agree with identified issues, and potentially find better solutions. Then ask the agent to address agreed-upon issues before reviewing the entire changeset prior to PR submission.

## Get started with Projects

Get started at [projects.dev](https://projects.dev/):

```shell
stripe projects init
```

This single command gives agents access to a growing list of service providers.

---

*Originally published on [stripe.dev](https://stripe.dev/blog/learnings-from-building-with-agents-stripe-projects)*
