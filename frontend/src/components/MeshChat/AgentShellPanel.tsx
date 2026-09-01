'use client';



import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Terminal } from 'lucide-react';

import { Terminal as XTerm } from '@xterm/xterm';

import { FitAddon } from '@xterm/addon-fit';

import '@xterm/xterm/css/xterm.css';

import { mintAgentShellWsToken, resolveAgentShellWsUrl } from '@/lib/agentShellWs';



const SHELL_FONT_PX = 14;

const CWD_STORAGE_KEY = 'sb_agent_shell_cwd';

const INTRO_ACK_KEY = 'sb_agent_shell_intro_ack';



type Props = {

  active: boolean;

  expanded: boolean;

  onExpandedChange: (expanded: boolean) => void;

};



function readStoredCwd(): string {

  if (typeof window === 'undefined') return '';

  try {

    return window.localStorage.getItem(CWD_STORAGE_KEY) || '';

  } catch {

    return '';

  }

}



function readIntroAcknowledged(): boolean {

  if (typeof window === 'undefined') return false;

  try {

    return window.localStorage.getItem(INTRO_ACK_KEY) === '1';

  } catch {

    return false;

  }

}



function ShellIntro({ onAcknowledge }: { onAcknowledge: () => void }) {

  return (

    <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-5 py-8 text-center border-l-2 border-cyan-800/20 bg-[#04070b]">

      <div className="w-full max-w-sm border border-cyan-900/40 bg-cyan-950/10 px-5 py-6">

        <div className="inline-flex items-center justify-center w-10 h-10 border border-cyan-700/40 bg-black/30 text-cyan-300 mb-4">

          <Terminal size={18} />

        </div>

        <div className="text-sm font-mono tracking-[0.22em] text-cyan-300 mb-3">OPERATOR SHELL</div>

        <p className="text-[13px] font-mono text-[var(--text-secondary)] leading-[1.75] text-left">

          Connect your own agent CLIs here — OpenClaw, Codex, Gemini, or whatever you run locally.

        </p>

        <p className="mt-3 text-[13px] font-mono text-[var(--text-secondary)] leading-[1.75] text-left">

          The session opens in your AMUN SIGNAL workspace by default. Use it for repo scripts, mesh

          tools, or any terminal workflow you already rely on.

        </p>

        <button

          type="button"

          onClick={onAcknowledge}

          className="mt-5 w-full px-4 py-2.5 text-sm font-mono tracking-[0.18em] text-cyan-200 border border-cyan-600/50 bg-cyan-950/30 hover:bg-cyan-950/50 hover:border-cyan-400/60 transition-colors"

        >

          OPEN SHELL

        </button>

      </div>

    </div>

  );

}



export default function AgentShellPanel({ active, expanded, onExpandedChange }: Props) {

  const hostRef = useRef<HTMLDivElement>(null);

  const termRef = useRef<XTerm | null>(null);

  const fitRef = useRef<FitAddon | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const [introAcknowledged, setIntroAcknowledged] = useState(false);

  const [status, setStatus] = useState<'idle' | 'connecting' | 'open' | 'error'>('idle');

  const [statusDetail, setStatusDetail] = useState('');

  const [cwd, setCwd] = useState('');



  const shellReady = active && introAcknowledged;



  useEffect(() => {

    setIntroAcknowledged(readIntroAcknowledged());

  }, [active]);



  const acknowledgeIntro = useCallback(() => {

    try {

      window.localStorage.setItem(INTRO_ACK_KEY, '1');

    } catch {

      // still allow in-session access if storage is blocked

    }

    setIntroAcknowledged(true);

  }, []);



  const disconnect = useCallback(() => {

