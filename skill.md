---
name: stripe-projects
description: |
  Use when the user wants to provision infrastructure or third-party services via Stripe Projects.
  Trigger phrases include: "I need a database", "set up auth", "add caching", "give me a Postgres",
  "provision Redis", "add analytics", "set me up with Supabase", "I need hosting",
  "add a vector DB", "connect Sentry", "get me an API key for X", "sign up for a service",
  "set up monitoring", "what services are available", "show me the catalog",
  "what can I provision", "how do I get credentials for X", "browse providers",
  or any mention of projects.dev, the Stripe Projects catalog, or
  adding/provisioning/connecting a cloud service to a project.
user-invocable: true
allowed-tools:
  - Bash(stripe *)
  - Bash(which stripe)
  - Bash(brew install *)
  - Bash(brew upgrade *)
  - Bash(scoop *)
  - Bash(sudo apt *)
  - Bash(sudo yum *)
  - Bash(curl *)
  - Bash(docker run *)
  - Bash(jq *)
  - WebFetch
  - Skill
  - Read
---

# Stripe Projects — Service Provisioning

Provision third-party services (databases, auth, hosting, analytics, caching, AI, observability) and retrieve API keys/tokens using the Stripe Projects CLI plugin.

> **Token budget:** Keep this skill lean. Only load supplementary context (auth-flow details, etc.) when the specific topic arises.

## Workflow

### Step 1: Ensure Stripe CLI + Projects Plugin

Check if the Stripe CLI is available and at the minimum version:

```bash
which stripe && stripe --version
```

If it's not installed, install based on the user's platform:

**macOS (Homebrew):**

```bash
brew install stripe/stripe-cli/stripe
```

**Linux (Debian/Ubuntu via APT):**

```bash
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

**Linux (RPM-based via YUM):**

```bash
echo -e "[Stripe]\nname=stripe\nbaseurl=https://packages.stripe.dev/stripe-cli-rpm-local/\nenabled=1\ngpgcheck=0" >> /etc/yum.repos.d/stripe.repo
sudo yum install stripe
```

**Windows (Scoop):**

```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Docker:**

```bash
docker run --rm -it stripe/stripe-cli:latest
```

If installed but the version is below 1.40.0, upgrade:

**macOS (Homebrew):**

```bash
brew upgrade stripe/stripe-cli/stripe
```

For other platforms, follow https://docs.stripe.com/stripe-cli/upgrade.

Then ensure the Projects plugin is installed:

```bash
stripe plugin install projects
```

### Step 2: Search the Catalog

Confirm the requested provider/service exists:

```bash
stripe projects search <query> --json
```

If `result_count` is 0, tell the user the service wasn't found and stop.

If the user's request is vague (e.g., "I need a database"), browse the catalog to suggest options:

```bash
stripe projects catalog --json
```

### Step 3: Initialize a Project

Check if a project is already initialized:

```bash
stripe projects status --json
```

If it's not initialized:

```bash
stripe projects init --json --auto-confirm
```

If the user isn't authenticated, the CLI will redirect them to a browser. Display:

> Stripe Projects is redirecting you to the browser to authenticate.
> - If you have an existing Stripe account, log in with your credentials.
> - If you're new, you can create a free Stripe Projects account in seconds.
>
> Complete the sign-in in your browser, then come back here and let me know when you're done.

Wait for the user to confirm before proceeding. Don't attempt to automate the OAuth browser flow. Don't store or relay tokens manually — the CLI manages its own credential store.

**Important:** `stripe projects init` installs the `stripe-projects-cli` skill locally at `.claude/skills/stripe-projects-cli`. This skill contains the full post-init command reference.

### Step 4: Hand Off to stripe-projects-cli

Verify the skill was installed:

```bash
test -f .claude/skills/stripe-projects-cli/SKILL.md && echo "OK" || echo "MISSING"
```

If `MISSING`: re-run `stripe projects init --json --auto-confirm` — the skill is bundled with the Projects plugin and installed during init.

If `OK`: use the locally-installed `stripe-projects-cli` skill (invoke via the Skill tool with name `stripe-projects-cli`) to continue the workflow — adding services, managing credentials, and configuring the project.

### Step 5: Summarize and Suggest

After a successful service addition, provide output in this format:

| Field | Value |
|-------|-------|
| Provider | `<provider name>` |
| Service | `<service type>` |
| Tier | `<tier>` |
| Env vars | `<variable names only — never values>` |

Then suggest 3–5 complementary services from different categories in the catalog (e.g., if user added a database, suggest auth, hosting, or observability). Only reference services that actually appear in `stripe projects catalog --json` output — don't fabricate commands or provider names.

## Non-Interactive Mode

Always use `--json --auto-confirm` flags to suppress interactive prompts. If a paid service requires confirmation, add `--confirm-paid-service`.

## CLI as Source of Truth

The CLI manages all state under `.projects/` and generates `.env` files. Don't hand-edit these files. If you need to inspect project state, use the appropriate CLI command:

| Task | Command |
|------|---------|
| View provisioned services | `stripe projects status --json` |
| List env var names | `stripe projects env --json` |
| Check project health | `stripe projects status --json` |
| Browse available services | `stripe projects catalog --json` |

Only inspect `.projects/` or `.env` directly if the user explicitly asks you to — the CLI is authoritative, so manual edits may be overwritten.

## Error Handling

| Error code | Cause | Recovery |
|------------|-------|----------|
| `JSON_REQUIRES_AUTH` | User isn't authenticated | Tell user they must run `stripe projects init` interactively |
| `NO_PROJECT_CONFIG` | Project isn't initialized in this directory | Run `stripe projects init --json --auto-confirm` |
| `PROVIDER_NOT_LINKED` | Provider requires OAuth linking | Run `stripe projects link <provider>` — this may open a browser |
| `UNKNOWN_ERROR` | Unexpected failure | Show the full error message to the user and suggest running with `--debug` for diagnostics |
| Service not in catalog | Query returned 0 results | Tell user; suggest `stripe projects catalog --json` to browse alternatives |
| CLI not found | Stripe CLI isn't installed | Install per platform instructions above |
