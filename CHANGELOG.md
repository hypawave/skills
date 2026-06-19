# Changelog

## 0.1.0

Initial release.

- Accountless Path 3a/3b agent skill: buy, sell, and settlement-gated execution over Bitcoin Lightning.
- agentskills.io **standard** bundle (Claude Code, Cursor, Codex, Hermes, Gemini, …), **Claude plugin** packaging, and **ClawHub** dialect variant — all generated from one shared `core/` by `build.mjs`.
- Self-contained signer (`scripts/sign_request.mjs`) with vendored `@noble/secp256k1` (v1.7.1, MIT); `--selftest` reproduces the published llms.txt test vector.
- Wallet guidance (agent-provisionable custodial NWC; operator funds + sets spending policy) and a live Compute-offer smoke test.
