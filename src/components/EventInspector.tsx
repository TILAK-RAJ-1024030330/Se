import React from 'react';
import { useAppStore } from '../store/useAppStore';

export function EventInspector() {
  const { selectedEvent } = useAppStore();

  if (!selectedEvent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#64748B] text-sm p-4 text-center">
        Select a node in the Temporal Event Stream to inspect its properties.
      </div>
    );
  }

  return (
    <>
      <div className="p-4 border-b border-[#1E293B] bg-[#020617]">
        <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1">Inspector</div>
        <div className="text-sm font-bold text-white flex justify-between items-center">
          <span>{selectedEvent.operation}</span>
          <span className="text-xs font-mono text-blue-400">#{selectedEvent.lsn}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
           <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2">Metadata</div>
           <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className="text-[#94A3B8]">Table:</div>
              <div className="text-white text-right font-mono">{selectedEvent.table || '-'}</div>
              <div className="text-[#94A3B8]">TX ID:</div>
              <div className="text-blue-400 text-right font-mono">{selectedEvent.transactionId}</div>
              <div className="text-[#94A3B8]">Time:</div>
              <div className="text-white text-right font-mono">
                {new Date(selectedEvent.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}
              </div>
           </div>
        </div>

        {selectedEvent.changes && Object.keys(selectedEvent.changes).length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2">State Diff</div>
            <div className="bg-[#020617] border border-[#1E293B] rounded p-2 overflow-x-auto text-[11px] font-mono whitespace-pre text-[#94A3B8]">
              {JSON.stringify(selectedEvent.changes, null, 2)}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#1E293B] bg-[#020617] flex justify-center">
        <button 
          disabled
          className="w-full px-4 py-2 bg-[#1E293B] text-[#94A3B8] text-xs font-bold rounded flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <div className="w-2 h-2 rounded-full border border-[#94A3B8]"></div>
          REWIND TO LSN (LOCKED)
        </button>
      </div>
    </>
  );
}
