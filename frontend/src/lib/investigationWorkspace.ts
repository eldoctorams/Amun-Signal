export type WorkspaceId = 'mission' | 'cases' | 'graph' | 'evidence' | 'entities' | 'analyst';

export type CaseStatus = 'open' | 'monitoring' | 'contained' | 'closed';
export type CasePriority = 'critical' | 'high' | 'medium' | 'low';

export interface InvestigationEntity {
  id: string;
  type: 'person' | 'organization' | 'account' | 'asset' | 'location';
  label: string;
  confidence: number;
  evidenceIds: string[];
}

export interface InvestigationEvidence {
  id: string;
  title: string;
  source: string;
  collectedAt: string;
  integrity: 'verified' | 'pending';
  sha256: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  summary: string;
  status: CaseStatus;
  priority: CasePriority;
  owner: string;
  updatedAt: string;
  tags: string[];
  entities: InvestigationEntity[];
  evidence: InvestigationEvidence[];
}

export const SYNTHETIC_CASES: InvestigationCase[] = [
  {
    id: 'AMUN-2026-001',
    title: 'Synthetic Payment Relay Cluster',
    summary: 'Training scenario linking public indicators to a simulated payment-relay network.',
    status: 'open',
    priority: 'critical',
    owner: 'Investigation Cell Alpha',
    updatedAt: '2026-09-02T12:20:00.000Z',
    tags: ['training', 'financial-crime', 'network'],
    entities: [
      { id: 'ENT-001', type: 'organization', label: 'Synthetic Relay Group', confidence: 0.86, evidenceIds: ['EVD-001', 'EVD-002'] },
      { id: 'ENT-002', type: 'account', label: 'Training Account • 8842', confidence: 0.72, evidenceIds: ['EVD-001'] },
      { id: 'ENT-003', type: 'location', label: 'Cairo Training Zone', confidence: 0.64, evidenceIds: ['EVD-002'] },
    ],
    evidence: [
      { id: 'EVD-001', title: 'Synthetic transaction pattern export', source: 'Authorized training dataset', collectedAt: '2026-09-02T09:10:00.000Z', integrity: 'verified', sha256: 'a983f7c19d01…8d27b390' },
      { id: 'EVD-002', title: 'Public infrastructure observation', source: 'Licensed public source', collectedAt: '2026-09-02T10:45:00.000Z', integrity: 'verified', sha256: '510be21ac58a…c901ee42' },
    ],
  },
  {
    id: 'AMUN-2026-002',
    title: 'Maritime Infrastructure Exercise',
    summary: 'Synthetic exercise for preserving and correlating licensed maritime observations.',
    status: 'monitoring',
    priority: 'high',
    owner: 'Maritime Analysis Desk',
    updatedAt: '2026-09-01T18:05:00.000Z',
    tags: ['training', 'maritime', 'infrastructure'],
    entities: [
      { id: 'ENT-004', type: 'asset', label: 'Training Vessel A-17', confidence: 0.91, evidenceIds: ['EVD-003'] },
      { id: 'ENT-005', type: 'location', label: 'Synthetic Transit Corridor', confidence: 0.77, evidenceIds: ['EVD-003'] },
    ],
    evidence: [
      { id: 'EVD-003', title: 'Licensed position history snapshot', source: 'Licensed maritime feed', collectedAt: '2026-09-01T16:30:00.000Z', integrity: 'verified', sha256: '7c0ad7c87b11…f8d2041a' },
    ],
  },
  {
    id: 'AMUN-2026-003',
    title: 'Authorized Exposure Validation',
    summary: 'Defensive validation of a simulated exposed-service alert and its provenance chain.',
    status: 'contained',
    priority: 'medium',
    owner: 'Defensive Cyber Desk',
    updatedAt: '2026-08-31T14:40:00.000Z',
    tags: ['training', 'defensive', 'provenance'],
    entities: [
      { id: 'ENT-006', type: 'asset', label: 'Lab Gateway 04', confidence: 0.98, evidenceIds: ['EVD-004'] },
    ],
    evidence: [
      { id: 'EVD-004', title: 'Authorized validation record', source: 'AMUN lab environment', collectedAt: '2026-08-31T13:55:00.000Z', integrity: 'verified', sha256: 'db31483f7290…2fd650c8' },
    ],
  },
];

export function filterCases(cases: InvestigationCase[], query: string, status: CaseStatus | 'all') {
  const normalized = query.trim().toLocaleLowerCase();
  return cases.filter((item) => {
    const matchesStatus = status === 'all' || item.status === status;
    const searchable = [item.id, item.title, item.summary, item.owner, ...item.tags]
      .join(' ')
      .toLocaleLowerCase();
    return matchesStatus && (!normalized || searchable.includes(normalized));
  });
}

export function getCaseMetrics(cases: InvestigationCase[]) {
  return {
    active: cases.filter((item) => item.status === 'open' || item.status === 'monitoring').length,
    critical: cases.filter((item) => item.priority === 'critical').length,
    entities: cases.reduce((total, item) => total + item.entities.length, 0),
    verifiedEvidence: cases.reduce(
      (total, item) => total + item.evidence.filter((evidence) => evidence.integrity === 'verified').length,
      0,
    ),
  };
}

export function buildCase(title: string, summary: string): InvestigationCase {
  const now = new Date().toISOString();
  const suffix = now.replace(/\D/g, '').slice(-8);
  return {
    id: `AMUN-${now.slice(0, 4)}-${suffix}`,
    title: title.trim(),
    summary: summary.trim(),
    status: 'open',
    priority: 'medium',
    owner: 'Unassigned',
    updatedAt: now,
    tags: ['new'],
    entities: [],
    evidence: [],
  };
}
