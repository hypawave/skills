# Changelog

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
