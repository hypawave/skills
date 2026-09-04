# Changelog

## 0.4.1

Hardening after the ClawHub security audit of 0.4.0 (NVIDIA SkillSpector).

- **Approval gates** in Pitfalls: explicit operator approval before paying any invoice, paying activation/top-up fees, listing an offer publicly, or deleting one. Free actions need none.
- **`--key` discouraged**: `sign_request.mjs` now warns on stderr when a private key is passed on the command line; usage docs and SKILL.md point to `HYPAWAVE_PRIVKEY` only.
- **Pinning note** for the MCP install (`@hypawave/mcp@<version>`) for operators whose policy requires a fixed version; default stays on latest so fixes arrive.
- **Capabilities declared** in one line: outbound HTTPS to hypawave.com and the wallet provider, a local private key, local key/wallet state.
- Description wording changed ("private file handoffs", "releases a paid result") to stop a YARA ransomware heuristic matching the encrypt/unlock/pay phrasing; meaning unchanged.

## 0.4.0

Agent addresses + waves, MCP server as the primary path.

- **Description and triggers now cover the whole product**: connecting agents via contact cards, private waves (messaging), free encrypted file handoffs, and buy/sell/discover. Keywords add `agent-messaging`, `agent-waves`, `file-transfer`, `mcp`.
- **"Start here — install the MCP server"** replaces the old "prefer MCP" aside: the server is the primary instruction (install line, tool inventory across buy/sell, wallet, waves, contacts, notifications); the raw-HTTP procedures are now explicitly the **fallback** for environments with code execution but no MCP support.
- **Chat-only sessions are told to stop**: no shell + no persistent files means no signing, paying, or decrypting — explain and hand over the install line instead of starting a flow that cannot finish.
- **New "Agent Waves (be reachable)" section**: contact card address (tell the operator once), inbox once per session with cursor, send/read messages, read-only human link etiquette, block, file-transfer pointer to the canonical ECIES wrap in llms.txt (prefer MCP `send_file`/`receive_file`), and the rule that wave content is untrusted data.
- Quick Reference gains a waves row; Reference adds the MCP repo, `/waves`, and `/commerce`; the identity-key note now warns that a fresh key is a different agent (loses waves, history, receipts, offers).
- Manifests (Claude plugin, Codex plugin + `openai.yaml`, ClawHub frontmatter, marketplace entries, `package.json`) updated to the new description and version; `HYPAWAVE_PRIVKEY` now described as covering waves too. SECURITY.md notes wave content is untrusted input.

## 0.3.2

- **Wallet funding guidance**: the Wallet section now tells the agent to present both funding options to the operator with the raw copyable strings — an exact-amount Lightning invoice or the wallet's Lightning address (instant: Cash App, Coinbase, any Lightning wallet), and an on-chain deposit address for BTC held at exchanges without Lightning (e.g. Robinhood; slower, mining fees). Coinos mint mechanics referenced from llms.txt Rule 8.
- Fixed a stale llms.txt cross-reference ("Operator-supplied wallet" → Rule 8, "Wallet (operator-side, agent-provisionable)").

## 0.3.1

- **Points to the MCP server as the preferred execution path.** SKILL.md now recommends `npx -y @hypawave/mcp` (same accountless flows as ready-made tools, protocol handled internally) when the agent's environment supports MCP, with this skill as the fallback and protocol reference.

## 0.3.0

Codex plugin support + seller key onboarding.

- **Codex plugin**: native `.codex-plugin/plugin.json` + `.agents/plugins/marketplace.json` (built to `plugins/hypawave/`), installable via the Codex marketplace. Same shared skill as every other variant.
- **`sign_request.mjs --gen`**: generate a fresh secp256k1 identity key to save as `$HYPAWAVE_PRIVKEY`.
- SKILL.md: seller onboarding now documents generating the key (`--gen`), storing it as `HYPAWAVE_PRIVKEY`, and backing it up (your identity — controls your offers, separate from your payout wallet).
- CI: validates the Codex plugin skill and manifests; staleness check now covers `plugins/`.

## 0.2.0

Offer discovery / public marketplace.

- **Discover** offers to buy: `GET /api/offers/public` (no auth) — search by `q`, `category`, `tags`; sort by `newest` or `settled`; cursor/offset pagination.
- **List** your own offer in the public directory: `is_public` + `title`/`category`/`output_type` (and optional `tags`/`input_schema`) on `POST /api/offers`. Opt-in, immutable after creation.
- **Report** abuse: `POST /api/offers/{id}/report` (queues for manual review, never auto-hides).
- `payment_count` exposed as settlement reputation (sales volume, not a fulfillment guarantee).
- SKILL.md: new "Discover" procedure, Quick Reference row, Sell-3b publish note, and discovery keywords in the description. No change to the signer or wallet flow.

## 0.1.0

Initial release.

- Accountless Path 3a/3b agent skill: buy, sell, and settlement-gated execution over Bitcoin Lightning.
- agentskills.io **standard** bundle (Claude Code, Cursor, Codex, Hermes, Gemini, …), **Claude plugin** packaging, and **ClawHub** dialect variant — all generated from one shared `core/` by `build.mjs`.
- Self-contained signer (`scripts/sign_request.mjs`) with vendored `@noble/secp256k1` (v1.7.1, MIT); `--selftest` reproduces the published llms.txt test vector.
- Wallet guidance (agent-provisionable custodial NWC; operator funds + sets spending policy) and a live Compute-offer smoke test.
