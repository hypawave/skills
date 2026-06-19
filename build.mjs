#!/usr/bin/env node
/**
 * Assemble platform bundles from one shared core.
 *
 *   core/SKILL.md        canonical body + shared frontmatter (name, description)
 *   core/scripts/        bundled helpers (identical in every bundle)
 *   variants/standard/   agentskills.io frontmatter extras (license, compatibility, metadata)
 *   variants/clawhub/    ClawHub dialect extras (version, metadata.openclaw)
 *   variants/claude/     Claude plugin manifest (wraps the STANDARD skill)
 *        ↓ build
 *   dist/
 *     standard/hypawave/        ← agentskills.io: Claude, Cursor, Codex, Hermes, Gemini, … (one file, ~40 tools)
 *     claude/                   ← Claude plugin packaging of the standard skill (for marketplace distribution)
 *     clawhub/hypawave/         ← ClawHub's own dialect (metadata.openclaw; no `license` field)
 *
 * Only two SKILL.md frontmatter variants exist (standard + clawhub); Claude is a
 * packaging of the standard one, not a third file. Body + scripts are copied
 * verbatim, so they can never drift. The agentskills.io spec requires the skill
 * directory name to equal `name`, so every bundle's skill dir is `hypawave/`.
 * No dependencies — Node 18+ builtins only.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const coreDir = path.join(root, "core");
const variantsDir = path.join(root, "variants");
const distDir = path.join(root, "dist");

// 1. Load the core: split frontmatter from body; capture shared name + description.
const coreRaw = fs.readFileSync(path.join(coreDir, "SKILL.md"), "utf8");
const m = coreRaw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!m) throw new Error("core/SKILL.md is missing YAML frontmatter");
const coreFront = m[1];
const body = m[2].replace(/^\n+/, "");
const name = (coreFront.match(/^name:\s*(.+)$/m) || [])[1]?.trim();
const description = (coreFront.match(/^description:\s*(.+)$/m) || [])[1]?.trim();
if (!name || !description) throw new Error("core frontmatter must define name and description");

// agentskills.io constraints (fail fast rather than ship an invalid skill).
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64)
  throw new Error(`invalid name "${name}" — lowercase alphanumeric + single hyphens, <=64 chars`);
if (description.length > 1024) throw new Error(`description is ${description.length} chars (>1024)`);
// The description is emitted as an unquoted YAML plain scalar; ": " and " #" would
// break parsing (this exact bug shipped once and was caught by skills-ref).
if (description.includes(": ") || description.includes(" #"))
  throw new Error('description contains a YAML-unsafe sequence (": " or " #") — reword it');

const sharedHead = `name: ${name}\ndescription: ${description}`;
const standardFront = sharedHead + readExtra("standard");
const clawhubFront = sharedHead + readExtra("clawhub");

const writeFile = (p, c) => (fs.mkdirSync(path.dirname(p), { recursive: true }), fs.writeFileSync(p, c));
const emitSkill = (frontmatter, skillDir) => {
  writeFile(path.join(skillDir, "SKILL.md"), `---\n${frontmatter}\n---\n\n${body}`);
  // Recursive: scripts/ includes a vendored vendor/ subdir (self-contained signing lib).
  fs.cpSync(path.join(coreDir, "scripts"), path.join(skillDir, "scripts"), { recursive: true });
};
function readExtra(variant) {
  const p = path.join(variantsDir, variant, "frontmatter.yml");
  return fs.existsSync(p) ? "\n" + fs.readFileSync(p, "utf8").trim() : "";
}
const copyLicense = (dir) => fs.copyFileSync(path.join(root, "LICENSE"), path.join(dir, "LICENSE"));

fs.rmSync(distDir, { recursive: true, force: true });

// 2. Standard (agentskills.io) — the universal bundle. Skill dir name == `name`.
{
  const base = path.join(distDir, "standard");
  emitSkill(standardFront, path.join(base, name));
  copyLicense(path.join(base, name));
}

// 3. Claude — plugin packaging of the STANDARD skill (for marketplace distribution).
{
  const base = path.join(distDir, "claude");
  emitSkill(standardFront, path.join(base, "skills", name));
  writeFile(
    path.join(base, ".claude-plugin", "plugin.json"),
    fs.readFileSync(path.join(variantsDir, "claude", "plugin.json"), "utf8")
  );
  copyLicense(base);
}

// 4. ClawHub — its own dialect. Skill dir name == `name`.
{
  const base = path.join(distDir, "clawhub");
  emitSkill(clawhubFront, path.join(base, name));
  copyLicense(path.join(base, name));
}

console.log("Built bundles → dist/{standard,claude,clawhub}");
console.log(`  shared body: ${body.length} chars · name: ${name} (${name.length}/64) · description: ${description.length}/1024`);
