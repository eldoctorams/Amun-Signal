"""Typed, storage-agnostic models for AMUN SIGNAL investigations."""

from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class CaseStatus(str, Enum):
    OPEN = "open"
    MONITORING = "monitoring"
    CLOSED = "closed"
    ARCHIVED = "archived"


class Confidence(str, Enum):
    UNKNOWN = "unknown"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CONFIRMED = "confirmed"


class EntityType(str, Enum):
    PERSON = "person"
    ORGANIZATION = "organization"
    LOCATION = "location"
    ASSET = "asset"
    EVENT = "event"
    DIGITAL_IDENTIFIER = "digital_identifier"
    UNKNOWN = "unknown"


class InvestigationModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class SourceProvenance(InvestigationModel):
    source_name: str = Field(min_length=1, max_length=160)
    source_url: HttpUrl
    retrieved_at: datetime = Field(default_factory=utc_now)
    event_time: datetime | None = None
    collector: str = Field(default="manual", min_length=1, max_length=120)
    license: str | None = Field(default=None, max_length=120)

    @field_validator("retrieved_at", "event_time")
    @classmethod
    def timestamps_must_be_timezone_aware(cls, value: datetime | None) -> datetime | None:
        if value is not None and value.tzinfo is None:
            raise ValueError("evidence timestamps must include a timezone")
        return value


class Entity(InvestigationModel):
    id: UUID = Field(default_factory=uuid4)
    type: EntityType = EntityType.UNKNOWN
    canonical_name: str = Field(min_length=1, max_length=240)
    aliases: list[str] = Field(default_factory=list)
    attributes: dict[str, Any] = Field(default_factory=dict)
    confidence: Confidence = Confidence.UNKNOWN
    created_at: datetime = Field(default_factory=utc_now)


class Relationship(InvestigationModel):
    id: UUID = Field(default_factory=uuid4)
    source_entity_id: UUID
    target_entity_id: UUID
    predicate: str = Field(min_length=1, max_length=120)
    confidence: Confidence = Confidence.UNKNOWN
    evidence_ids: list[UUID] = Field(default_factory=list)
    observed_at: datetime | None = None


class EvidenceRecord(InvestigationModel):
    id: UUID = Field(default_factory=uuid4)
    case_id: UUID
    title: str = Field(min_length=1, max_length=240)
    content_type: str = Field(default="application/json", min_length=1, max_length=120)
    content: dict[str, Any]
    provenance: SourceProvenance
    confidence: Confidence = Confidence.UNKNOWN
    sha256: str | None = Field(default=None, pattern=r"^[a-f0-9]{64}$")
    created_at: datetime = Field(default_factory=utc_now)


class Case(InvestigationModel):
    id: UUID = Field(default_factory=uuid4)
    title: str = Field(min_length=1, max_length=240)
    summary: str = Field(default="", max_length=4000)
    status: CaseStatus = CaseStatus.OPEN
    priority: int = Field(default=3, ge=1, le=5)
    tags: list[str] = Field(default_factory=list)
    entity_ids: list[UUID] = Field(default_factory=list)
    evidence_ids: list[UUID] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

