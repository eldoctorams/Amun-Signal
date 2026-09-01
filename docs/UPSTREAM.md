# Upstream synchronization

AMUN SIGNAL is derived from Shadowbroker and retains the complete upstream Git history.

- Upstream: `https://github.com/BigBodyCobain/Shadowbroker.git`
- Product repository target: `https://github.com/eldoctorams/amun-signal`
- Transformation branch: `amun/phase-0-foundation`

Keep `upstream/main` read-only. Integrate upstream security and reliability fixes through reviewed merge branches, then run frontend tests/build and backend CI smoke tests. Do not automatically overwrite AMUN domain, brand, or investigation UX changes.

