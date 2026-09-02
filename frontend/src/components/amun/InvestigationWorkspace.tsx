'use client';

import { useEffect, useMemo, useState } from 'react';
import { Boxes, CheckCircle2, FileCheck2, FolderKanban, Plus, Search, ShieldCheck, X } from 'lucide-react';
import {
  buildCase,
  filterCases,
  getCaseMetrics,
  SYNTHETIC_CASES,
  type CaseStatus,
  type InvestigationCase,
  type WorkspaceId,
} from '@/lib/investigationWorkspace';

const STORAGE_KEY = 'amun_investigation_cases_v1';

interface InvestigationWorkspaceProps {
  workspace: WorkspaceId;
  onClose: () => void;
}

function readCases(): InvestigationCase[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as InvestigationCase[]) : SYNTHETIC_CASES;
  } catch {
    return SYNTHETIC_CASES;
  }
}

export default function InvestigationWorkspace({ workspace, onClose }: InvestigationWorkspaceProps) {
  const [cases, setCases] = useState<InvestigationCase[]>(SYNTHETIC_CASES);
  const [selectedId, setSelectedId] = useState(SYNTHETIC_CASES[0].id);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<CaseStatus | 'all'>('all');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => setCases(readCases()), []);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(cases)), [cases]);

  const visibleCases = useMemo(() => filterCases(cases, query, status), [cases, query, status]);
  const selected = cases.find((item) => item.id === selectedId) ?? visibleCases[0] ?? cases[0];
  const metrics = useMemo(() => getCaseMetrics(cases), [cases]);

  const createCase = () => {
    if (!title.trim() || !summary.trim()) return;
    const next = buildCase(title, summary);
    setCases((current) => [next, ...current]);
    setSelectedId(next.id);
    setTitle('');
    setSummary('');
    setCreating(false);
  };

  return (
    <section className="amun-investigation-shell" aria-label="AMUN SIGNAL Investigation Workspace">
      <div className="amun-investigation-heading">
        <div>
          <span className="amun-eyebrow">EVIDENCE-FIRST OPERATIONS</span>
          <h1>Investigation Workspace</h1>
          <p>Structure cases, connect entities, and preserve evidence provenance.</p>
        </div>
        <div className="amun-heading-actions">
          <span className="amun-synthetic-label"><ShieldCheck size={13} /> SYNTHETIC TRAINING DATA</span>
          <button type="button" className="amun-icon-button" onClick={onClose} aria-label="Return to Mission Control"><X size={17} /></button>
        </div>
      </div>

      <div className="amun-metric-grid">
        <article><FolderKanban /><span>ACTIVE CASES</span><strong>{metrics.active}</strong></article>
        <article><ShieldCheck /><span>CRITICAL PRIORITY</span><strong>{metrics.critical}</strong></article>
        <article><Boxes /><span>LINKED ENTITIES</span><strong>{metrics.entities}</strong></article>
        <article><FileCheck2 /><span>VERIFIED EVIDENCE</span><strong>{metrics.verifiedEvidence}</strong></article>
      </div>

      <div className="amun-investigation-grid">
        <aside className="amun-case-index">
          <div className="amun-case-tools">
            <label><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cases…" /></label>
            <select value={status} onChange={(event) => setStatus(event.target.value as CaseStatus | 'all')} aria-label="Filter by status">
              <option value="all">All statuses</option><option value="open">Open</option><option value="monitoring">Monitoring</option><option value="contained">Contained</option><option value="closed">Closed</option>
            </select>
            <button type="button" className="amun-primary-button" onClick={() => setCreating(true)}><Plus size={14} /> New case</button>
          </div>
          <div className="amun-case-list styled-scrollbar">
            {visibleCases.map((item) => (
              <button type="button" key={item.id} onClick={() => setSelectedId(item.id)} className={item.id === selected?.id ? 'is-selected' : undefined}>
                <span className={`amun-priority is-${item.priority}`} />
                <span><small>{item.id}</small><strong>{item.title}</strong><em>{item.owner}</em></span>
                <i>{item.status}</i>
              </button>
            ))}
            {!visibleCases.length && <p className="amun-empty-state">No cases match this view.</p>}
          </div>
        </aside>

        <main className="amun-case-detail styled-scrollbar">
          {selected && <>
            <header><div><span>{selected.id}</span><h2>{selected.title}</h2><p>{selected.summary}</p></div><b className={`is-${selected.priority}`}>{selected.priority}</b></header>
            <div className="amun-case-meta"><span>OWNER <b>{selected.owner}</b></span><span>STATUS <b>{selected.status}</b></span><span>UPDATED <b>{new Date(selected.updatedAt).toLocaleDateString('en-GB')}</b></span></div>

            {(workspace === 'cases' || workspace === 'entities') && <section className="amun-detail-section">
              <div className="amun-section-title"><Boxes size={15} /><h3>Entities</h3><span>{selected.entities.length} linked</span></div>
              <div className="amun-entity-grid">{selected.entities.map((entity) => <article key={entity.id}><span>{entity.type}</span><strong>{entity.label}</strong><small>{Math.round(entity.confidence * 100)}% confidence · {entity.evidenceIds.length} evidence links</small><meter min="0" max="1" value={entity.confidence} /></article>)}</div>
              {!selected.entities.length && <p className="amun-empty-state">No entities linked yet.</p>}
            </section>}

            {(workspace === 'cases' || workspace === 'evidence') && <section className="amun-detail-section">
              <div className="amun-section-title"><FileCheck2 size={15} /><h3>Evidence ledger</h3><span>{selected.evidence.length} records</span></div>
              <div className="amun-evidence-list">{selected.evidence.map((evidence) => <article key={evidence.id}><CheckCircle2 size={16} /><div><span>{evidence.id}</span><strong>{evidence.title}</strong><small>{evidence.source} · {new Date(evidence.collectedAt).toLocaleString('en-GB')}</small></div><code>{evidence.sha256}</code></article>)}</div>
              {!selected.evidence.length && <p className="amun-empty-state">No evidence preserved yet.</p>}
            </section>}
          </>}
        </main>
      </div>

      {creating && <div className="amun-dialog-backdrop" role="presentation"><form className="amun-case-dialog" onSubmit={(event) => { event.preventDefault(); createCase(); }}><span className="amun-eyebrow">NEW INVESTIGATION</span><h2>Create case</h2><label>Case title<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} maxLength={90} required /></label><label>Purpose and scope<textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={280} required /></label><p>New cases remain local to this browser until a governed backend is configured.</p><div><button type="button" onClick={() => setCreating(false)}>Cancel</button><button className="amun-primary-button" type="submit">Create case</button></div></form></div>}
    </section>
  );
}
