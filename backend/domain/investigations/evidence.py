"""Canonical hashing for evidence integrity and repeatable verification."""

import hashlib
import json
from typing import Any, Mapping


def _canonical_json(content: Mapping[str, Any]) -> bytes:
    return json.dumps(
        content,
        ensure_ascii=False,
        allow_nan=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")


def compute_evidence_hash(content: Mapping[str, Any]) -> str:
    """Return a deterministic SHA-256 digest for JSON-compatible evidence."""

    return hashlib.sha256(_canonical_json(content)).hexdigest()


def verify_evidence_hash(content: Mapping[str, Any], expected_sha256: str) -> bool:
    """Compare an evidence payload with a previously recorded digest."""

    return compute_evidence_hash(content) == expected_sha256.lower()

