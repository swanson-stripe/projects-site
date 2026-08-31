/**
 * Recomputes the skill digest in src/.well-known/agent-skills/index.json from
 * skill.md.
 *
 * The digest lets an agent verify it fetched the skill it was promised. It had
 * already gone stale — a verifying client would have treated /skill.md as
 * tampered and refused it. Run this after editing skill.md:
 *
 *     npm run sync:skill
 *
 * `npm test` fails if the two fall out of sync.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL = path.join(ROOT, "skill.md");
const INDEX = path.join(ROOT, "src/.well-known/agent-skills/index.json");

/* Hash the raw bytes — a client verifies what it downloaded, not a re-encoding. */
export function digestOf(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

const expected = digestOf(fs.readFileSync(SKILL));
const index = JSON.parse(fs.readFileSync(INDEX, "utf8"));
const skill = index.skills.find((entry) => entry.url === "/skill.md");

if (!skill) {
  throw new Error("No skill entry with url \"/skill.md\" in the agent-skills index.");
}

if (skill.digest === expected) {
  console.log(`unchanged: digest already matches skill.md (${expected})`);
  process.exit(0);
}

console.log(`was: ${skill.digest}`);
console.log(`now: ${expected}`);
skill.digest = expected;
fs.writeFileSync(INDEX, `${JSON.stringify(index, null, 2)}\n`);
console.log("synced:    src/.well-known/agent-skills/index.json");
