from datetime import datetime
from uuid import uuid4

import pytest
from pydantic import ValidationError

from domain.investigations import SourceProvenance, compute_evidence_hash, verify_evidence_hash


def test_evidence_hash_is_deterministic_across_key_order() -> None:
    first = {"signal": "AMUN", "score": 91, "locations": ["Cairo", "Alexandria"]}
    second = {"locations": ["Cairo", "Alexandria"], "score": 91, "signal": "AMUN"}

    digest = compute_evidence_hash(first)

    assert digest == compute_evidence_hash(second)
    assert verify_evidence_hash(second, digest)


def test_evidence_hash_preserves_unicode() -> None:
    assert compute_evidence_hash({"name": "أمون"}) == compute_evidence_hash({"name": "أمون"})


def test_provenance_rejects_naive_timestamps() -> None:
    with pytest.raises(ValidationError, match="timezone"):
        SourceProvenance(
            source_name="Public source",
            source_url="https://example.com/report",
            retrieved_at=datetime(2026, 9, 1, 12, 0),
        )


def test_provenance_accepts_auditable_source() -> None:
    provenance = SourceProvenance(
        source_name="Public source",
        source_url="https://example.com/report",
        collector=f"operator:{uuid4()}",
    )

    assert provenance.retrieved_at.tzinfo is not None

