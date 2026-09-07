import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

export function Sidebar() {
  const { dbState, selectedTable, selectTable, walEvents } = useAppStore();
  const tables = Object.values(dbState.tables);

  return (
    <aside className="w-64 border-r border-[#1E293B] bg-[#0F172A]/50 flex flex-col h-full">
      <div className="p-4 overflow-y-auto">
        <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-4">Schema / Tables</div>
        <ul className="space-y-1">
          {tables.map(table => {
            const rowCount = dbState.data[table.name]?.length || 0;
            const isSelected = selectedTable === table.name;
            return (
              <li key={table.name}>
                <button
                  onClick={() => selectTable(table.name)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded transition-colors duration-200",
                    isSelected
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "hover:bg-[#1E293B] text-[#94A3B8]"
                  )}
                >
                  <span className="text-sm">{table.name}</span>
                  <span className="text-[10px] opacity-60">{rowCount} rows</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="mt-auto p-4 border-t border-[#1E293B] bg-[#020617]">
        <div className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-3">Roadmap Milestone 2</div>
        <div className="space-y-2 opacity-60">
          <div className="flex items-center gap-2 text-[11px]"><div className="w-2 h-2 rounded-full border border-amber-500"></div> Time-Travel Queries</div>
          <div className="flex items-center gap-2 text-[11px]"><div className="w-2 h-2 rounded-full border border-amber-500"></div> Snapshot Isolation</div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-amber-200"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Full Rewind Engine</div>
        </div>
      </div>
    </aside>
  );
}
