import { describe, expect, it } from 'vitest';
import { buildCase, filterCases, getCaseMetrics, SYNTHETIC_CASES } from '@/lib/investigationWorkspace';

describe('AMUN SIGNAL investigation workspace', () => {
  it('filters cases by status and searchable evidence context', () => {
    expect(filterCases(SYNTHETIC_CASES, 'maritime', 'all')).toHaveLength(1);
    expect(filterCases(SYNTHETIC_CASES, '', 'monitoring')).toHaveLength(1);
    expect(filterCases(SYNTHETIC_CASES, 'missing phrase', 'all')).toEqual([]);
  });

  it('derives portfolio metrics without double counting records', () => {
    expect(getCaseMetrics(SYNTHETIC_CASES)).toEqual({
      active: 2,
      critical: 1,
      entities: 6,
      verifiedEvidence: 4,
    });
  });

  it('creates a safe local case with no invented evidence', () => {
    const created = buildCase('  New exercise  ', '  Authorized training scope  ');
    expect(created.title).toBe('New exercise');
    expect(created.summary).toBe('Authorized training scope');
    expect(created.status).toBe('open');
    expect(created.entities).toEqual([]);
    expect(created.evidence).toEqual([]);
    expect(created.id).toMatch(/^AMUN-\d{4}-\d{8}$/);
  });
});
