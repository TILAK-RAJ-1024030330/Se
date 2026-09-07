import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sidebar } from './Sidebar';
import { SQLConsole } from './SQLConsole';
import { QueryResults } from './QueryResults';
import { Timeline } from './Timeline';
import { TransactionPanel } from './TransactionPanel';
import { EventInspector } from './EventInspector';

export function Workspace() {
  const { loadDemo, initDb, isConnected, walEvents } = useAppStore();

  useEffect(() => {
    if (!isConnected) {
      loadDemo();
    }
  }, [isConnected, loadDemo]);

  if (!isConnected) return null;

  const lastEvent = walEvents[walEvents.length - 1];

  return (
    <div className="flex flex-col w-screen h-screen bg-[#0A0A0C] text-[#E2E8F0] overflow-hidden font-sans select-none">
      <nav className="flex items-center justify-between px-6 py-3 border-b border-[#1E293B] bg-[#0F172A]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-xl font-bold tracking-tighter">REPLAY<span className="text-blue-400">DB</span></span>
          </div>
          <div className="h-4 w-[1px] bg-[#334155] mx-2"></div>
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-[#1E293B] text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE ENGINE ACTIVE
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono text-[#94A3B8]">
          <div>LSN: <span className="text-white font-bold">{lastEvent?.lsn || '-'}</span></div>
          <div>TX_ID: <span className="text-white font-bold">{lastEvent?.transactionId || '-'}</span></div>
          <div>UPTIME: <span className="text-white">ACTIVE</span></div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col relative min-w-0">
          <div className="h-1/3 p-4 border-b border-[#1E293B] bg-[#020617] flex flex-col">
             <SQLConsole />
          </div>

          <div className="h-2/3 flex flex-col p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#111827] via-[#0A0A0C] to-[#0A0A0C]">
             <div className="flex items-center gap-2 mb-4">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Current State</div>
                <div className="h-[1px] flex-1 bg-[#1E293B]"></div>
             </div>
             <QueryResults />
             
             <div className="mt-auto flex flex-col pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Temporal Event Stream (WAL)</div>
                  <div className="text-[10px] text-blue-400">Click to inspect</div>
                </div>
                <Timeline />
             </div>
          </div>
        </main>

        <aside className="w-80 border-l border-[#1E293B] bg-[#0F172A]/50 flex flex-col">
          <TransactionPanel />
          <div className="h-px bg-[#1E293B] w-full"></div>
          <EventInspector />
        </aside>
      </div>

      <footer className="px-6 py-2 border-t border-[#1E293B] bg-[#020617] text-[10px] text-[#475569] flex justify-between items-center">
        <div>&copy; 2024 ReplayDB Foundation &bull; Project Milestone 1/3</div>
        <div className="flex gap-4">
          <span>PostgreSQL Wire Mock v0.3.1</span>
          <span className="text-emerald-500">● STORAGE_LOCAL_VFS: OK</span>
        </div>
      </footer>
    </div>
  );
}

