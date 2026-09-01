# AMUN SIGNAL architecture

## Product boundary

AMUN SIGNAL evolves the upstream live-map dashboard into an evidence-first Intelligence Investigation OS. The live map remains a workspace, while Cases become the durable unit of work and Evidence becomes the auditable unit of truth.

## Target domains

1. **Signal ingestion** — connectors normalize public and operator-authorized sources.
2. **Fusion** — signals are correlated by time, location, entity, and source reliability.
3. **Investigations** — cases organize hypotheses, entities, tasks, notes, and watchlists.
4. **Evidence ledger** — immutable revisions record provenance, hashes, timestamps, and custody.
5. **Knowledge graph** — typed relationships connect people, organizations, assets, locations, events, and digital identifiers.
6. **AI co-analyst** — every material claim must cite evidence IDs, show uncertainty, and identify contradictions or gaps.
7. **Reporting** — controlled exports support Markdown, PDF, JSON, CSV, GeoJSON, and STIX 2.1.

## Architectural rules

- New business logic belongs in `backend/domain`, not in the legacy `backend/main.py` monolith.
- Domain models are storage-agnostic and deny unknown input fields.
- Experimental mesh, communications, and privacy features stay isolated and off by default in professional deployments.
- No feature may claim anonymity, privacy, attribution, or certainty beyond what is technically demonstrated.
- Arabic/RTL support is first-class; entity normalization must retain original script and transliterations.
- Connectors use public, licensed, synthetic, or explicitly authorized data only.
- Evidence content is never silently overwritten; corrections create a new revision.

## Migration seams

The first release keeps legacy routes and storage identifiers stable for upstream compatibility. Brand changes are display-layer changes. Subsequent phases extract bounded routers and services behind typed APIs and feature flags.

