# AMUN SIGNAL contributor instructions

- Product name is **AMUN SIGNAL**. Never use "Horus" in product names, modules, examples, or UI copy.
- Preserve AGPL-3.0, upstream notices, Git history, and `DATA-ATTRIBUTION.md`.
- Keep legacy protocol and storage identifiers stable unless a migration is included.
- Put new business logic in bounded modules under `backend/domain` or `backend/services`; do not expand the legacy monolith.
- AI-generated findings must cite evidence IDs and expose confidence, contradictions, and missing information.
- Use only public, licensed, synthetic, or explicitly authorized data. Do not add covert access, credential capture, or unauthorized surveillance behavior.
- New features require focused tests. Before merging, run frontend tests/build and relevant backend tests.

