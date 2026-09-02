'use client';

import { Activity, Bot, Boxes, FileCheck2, FolderKanban, Network } from 'lucide-react';
import { AMUN_BRAND } from '@/lib/brand';
import type { WorkspaceId } from '@/lib/investigationWorkspace';

const workspaces = [
  { id: 'mission', label: 'Mission Control', icon: Activity, enabled: true },
  { id: 'cases', label: 'Cases', icon: FolderKanban, enabled: true },
  { id: 'graph', label: 'Graph', icon: Network, enabled: false },
  { id: 'evidence', label: 'Evidence', icon: FileCheck2, enabled: true },
  { id: 'entities', label: 'Entities', icon: Boxes, enabled: true },
  { id: 'analyst', label: 'AI Analyst', icon: Bot, enabled: false },
] as const;

interface AmunCommandBarProps {
  activeWorkspace: WorkspaceId;
  onSelectWorkspace: (workspace: WorkspaceId) => void;
}

export default function AmunCommandBar({ activeWorkspace, onSelectWorkspace }: AmunCommandBarProps) {
  return (
    <header className="amun-command-bar" aria-label="AMUN SIGNAL workspace navigation">
      <a className="amun-command-brand" href={AMUN_BRAND.website} target="_blank" rel="noreferrer">
        <span className="amun-mark" aria-hidden="true">
          <span />
        </span>
        <span>
          <strong>{AMUN_BRAND.name}</strong>
          <small>{AMUN_BRAND.product}</small>
        </span>
      </a>

      <nav className="amun-workspaces" aria-label="Investigation workspaces">
        {workspaces.map(({ id, label, icon: Icon, enabled }) => (
          <button
            key={label}
            className={activeWorkspace === id ? 'is-active' : undefined}
            type="button"
            disabled={!enabled}
            onClick={() => onSelectWorkspace(id)}
            aria-current={activeWorkspace === id ? 'page' : undefined}
            title={enabled ? `${label} workspace` : `${label} — planned capability`}
          >
            <Icon size={14} strokeWidth={1.7} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="amun-operational-state" title="Local intelligence runtime">
        <span className="amun-live-dot" />
        <span>LOCAL NODE</span>
      </div>
    </header>
  );
}
