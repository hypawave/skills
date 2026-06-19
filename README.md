# Hypawave Agent Skill

A portable [Agent Skill](https://agentskills.io) that teaches autonomous agents to **buy and sell** over Hypawave's accountless Lightning paths (3a / 3b). One shared core, assembled into platform bundles.

Non-custodial and dependency-free — see [SECURITY.md](SECURITY.md) for the trust model.

## Install (users)

- **Claude Code** — add this repo as a plugin marketplace, then install:
  ```
  /plugin marketplace add hypawave/skills
  /plugin install hypawave@hypawave
  ```
  Or use it standalone: copy `dist/standard/hypawave/` into `~/.claude/skills/`.
- **Cursor / Codex / Gemini / other agentskills.io tools** — point them at `dist/standard/hypawave/` (a standard Agent Skill folder).
- **Hermes** — `hermes skills tap add hypawave/skills` then install, or the maintainer publishes with `hermes skills publish dist/standard/hypawave --to github --repo hypawave/skills` (confirm exact flags with `hermes skills publish --help`).
- **ClawHub** — `clawhub skill publish dist/clawhub/hypawave`.

## Two variants (verified)

agentskills.io is the open standard (originally Anthropic's), and **Claude Code, Cursor, Codex, Gemini CLI, Hermes, GitHub Copilot, and ~40 other tools consume it**. So one standard file covers almost everything; only ClawHub uses its own dialect.

| Bundle | Frontmatter | Serves |
|---|---|---|
| `dist/standard/hypawave/` | agentskills.io standard | Claude Code (standalone), Cursor, Codex, Hermes Skills Hub, Gemini, Copilot, … |
| `dist/claude/` | same standard skill, wrapped in a plugin | Claude marketplace **distribution** (`.claude-plugin/plugin.json` + `skills/hypawave/`) |
| `dist/clawhub/hypawave/` | ClawHub dialect (`metadata.openclaw`, no `license` field) | ClawHub only |

There are only **two SKILL.md frontmatters** (standard + clawhub). Claude is a *packaging* of the standard skill, not a third file.

## Layout

```
core/
  SKILL.md            ← canonical body + shared frontmatter (name, description)
  scripts/sign_request.mjs   ← secp256k1 signing helper (self-test: --selftest)
variants/
  standard/frontmatter.yml   ← agentskills.io extras: license, compatibility, metadata
  clawhub/frontmatter.yml    ← ClawHub extras: version, metadata.openclaw
  claude/plugin.json          ← Claude plugin manifest (wraps the standard skill)
build.mjs · package.json (dep-free) · LICENSE (MIT-0) · README.md · SECURITY.md · CHANGELOG.md
.claude-plugin/marketplace.json   ← Claude marketplace (source: ./dist/claude)
.github/workflows/validate.yml    ← CI: build + skills-ref validate + signer self-test
dist/                 ← generated bundles (do not edit by hand)
```

Body + `scripts/` are copied verbatim into every bundle — they can't drift. Only the frontmatter + packaging differ. Edit `core/`, then rebuild.

## Build

```bash
node build.mjs        # → dist/{standard,claude,clawhub}
```

`build.mjs` fails fast if `name`/`description` violate the agentskills.io constraints, and names every skill directory `hypawave` (the spec requires the directory name to equal `name`).

## Publish

- **agentskills.io ecosystem** (Cursor, Codex, Hermes Skills Hub, Gemini, …) — publish `dist/standard/hypawave/`. Validate first: `npx skills-ref validate dist/standard/hypawave` (passes).
- **Claude** — `dist/standard/hypawave/SKILL.md` works standalone in `~/.claude/skills/` (also `skills-ref`-valid). For marketplace distribution, the repo-root `.claude-plugin/marketplace.json` already lists the plugin (`source: ./dist/claude`), so users run `/plugin marketplace add hypawave/skills`. For the public catalog, submit to `anthropics/claude-plugins-community` (the review runs `claude plugin validate` + safety screening).
- **ClawHub** — `clawhub skill publish dist/clawhub/hypawave`. **Do not** validate this bundle with `skills-ref` — ClawHub is a separate format (top-level `version`, `metadata.openclaw`) that the agentskills.io validator intentionally rejects; ClawHub validates it at publish time.

## Verification status

- **Endpoints/fields** cross-checked against `llms.txt` + `openapi.json`; nothing invented.
- **Signing helper** reproduces the published llms.txt test vector (run `node core/scripts/sign_request.mjs --selftest`).
- **Frontmatter** verified against each spec:
  - agentskills.io: `name` ≤64 (lowercase/alnum/single-hyphen, matches dir), `description` ≤1024, `license`/`compatibility`/`metadata` optional; unknown fields tolerated; `metadata` values are strings.
  - ClawHub: `license` is **not** a frontmatter field (registry-wide MIT-0; per-skill overrides unsupported) — omitted. The `metadata.openclaw.install` block was dropped — the signer's secp256k1 library is vendored, so nothing needs installing. `version` is semver.
  - Hermes: folded into the standard variant (its `platforms` field is an OS enum — macos/linux/windows — not agent frameworks, and it accepts base agentskills.io skills).

## Notes

- The buyer flow needs **no key**; only seller (signed) operations read `HYPAWAVE_PRIVKEY`, which never leaves the machine. The bundled signer is self-contained (secp256k1 is vendored under `scripts/vendor/`) — it needs only Node 18+, no install.
- `llms.txt` and `openapi.json` at hypawave.com remain authoritative; the skill links to them rather than duplicating the manual.
