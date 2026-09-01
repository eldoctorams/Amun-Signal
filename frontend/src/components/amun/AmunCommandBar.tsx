'use client';

import { Activity, Bot, Boxes, FileCheck2, FolderKanban, Network } from 'lucide-react';
import { AMUN_BRAND } from '@/lib/brand';

const workspaces = [
  { label: 'Mission Control', icon: Activity, active: true },
  { label: 'Cases', icon: FolderKanban, active: false },
  { label: 'Graph', icon: Network, active: false },
  { label: 'Evidence', icon: FileCheck2, active: false },
  { label: 'Entities', icon: Boxes, active: false },
  { label: 'AI Analyst', icon: Bot, active: false },
] as const;

export default function AmunCommandBar() {
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
        {workspaces.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={active ? 'is-active' : undefined}
            type="button"
            disabled={!active}
            title={active ? `${label} workspace` : `${label} — foundation in progress`}
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
