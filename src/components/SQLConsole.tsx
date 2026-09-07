import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export function SQLConsole() {
  const { executeSQL } = useAppStore();
  const [query, setQuery] = useState('SELECT * FROM accounts;');
  const [lastResult, setLastResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleRun = () => {
    if (!query.trim()) return;
    const result = executeSQL(query);
    setLastResult(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleRun();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">SQL Console</div>
        <div className="flex gap-2">
          <button 
            onClick={handleRun}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow-lg shadow-emerald-900/20 transition-colors"
          >
            RUN [CTRL+↵]
          </button>
          <button 
            onClick={() => setQuery('')}
            className="px-3 py-1 bg-[#1E293B] text-[#94A3B8] hover:text-white text-xs font-bold rounded transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>
      <div className="w-full flex-1 p-4 bg-[#0A0A0C] border border-[#334155] rounded-lg relative overflow-hidden flex flex-col">
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 w-full bg-transparent text-blue-300 font-mono text-sm focus:outline-none resize-none leading-relaxed placeholder:text-[#64748B]"
          placeholder="Type SQL query here... (e.g. SELECT * FROM accounts;)"
        />
        {lastResult && (
          <div className={`mt-2 text-xs font-mono border-t pt-2 ${lastResult.success ? 'text-emerald-400 border-[#334155]' : 'text-red-400 border-[#334155]'}`}>
            {lastResult.success ? `✓ ${lastResult.message || 'Query executed successfully.'}` : `✗ Error: ${lastResult.error}`}
          </div>
        )}
      </div>
    </>
  );
}
