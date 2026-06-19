# Security

## What this repo is

Agent Skill bundles (Markdown + a small signing helper) for Hypawave's accountless Lightning paths. There is **no server, no custody, and no funds movement here** — Hypawave is a non-custodial settlement coordinator; buyers pay creators directly over Lightning.

## Security model

- **Your private key never leaves your machine.** The secp256k1 key (read from `HYPAWAVE_PRIVKEY`) is used **only locally** by `scripts/sign_request.mjs` to sign *seller* requests. It is never transmitted, and **no Hypawave endpoint accepts a private key**. The **buyer flow needs no key at all** (it uses capability secrets returned by the API).
- **Non-custodial.** Principal payments go buyer→creator directly; Hypawave never holds principal funds. Only small Hypawave-issued activation fees route to Hypawave.
- **Settlement is the only gate.** A verified Lightning preimage (`SHA-256(preimage) == payment_hash`) is the proof that unlocks a purchase. Always confirm settlement before unlocking.
- **No bundled runtime dependencies.** The signer vendors `@noble/secp256k1` v1.7.1 (pinned, independently audited, MIT) under `scripts/vendor/` — so the bundle needs **no `npm install` and makes no install-time network calls**. The only network calls at runtime are the documented Hypawave API requests over HTTPS.
- **Spending is operator-governed.** The skill instructs agents to stay within an operator-defined spending cap / approval policy before paying; Hypawave enforces no limits.

## Verifying the bundle

- The signer self-test reproduces the published llms.txt test vector:
  ```bash
  node dist/standard/hypawave/scripts/sign_request.mjs --selftest
  ```
- The skill metadata validates against the open standard:
  ```bash
  npx --yes skills-ref validate dist/standard/hypawave
  ```
- Source is open in `core/` + `variants/` + `build.mjs`; every bundle is generated from that source (`node build.mjs`).

## Reporting a vulnerability

Email **security@hypawave.com** (or support@hypawave.com). Please do not open a public issue for security-sensitive reports. We aim to acknowledge within a few business days.
