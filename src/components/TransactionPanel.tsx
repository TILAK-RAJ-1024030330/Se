import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import { WALEvent } from '../engine/types';

export function TransactionPanel() {
  const { walEvents, selectEvent, selectedEvent } = useAppStore();

  const txns = walEvents.reduce((acc, event) => {
    if (event.transactionId) {
      if (!acc[event.transactionId]) acc[event.transactionId] = [];
      acc[event.transactionId].push(event);
    }
    return acc;
  }, {} as Record<string, WALEvent[]>);

  const txnList = Object.entries(txns).reverse();

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="p-4 border-b border-[#1E293B] bg-[#020617] flex justify-between items-center">
        <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Transactions</div>
        <div className="text-[10px] text-[#64748B]">{txnList.length}</div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {txnList.map(([txId, events]) => {
          const isSelected = selectedEvent?.transactionId === txId;
          const statusEvent = events.find(e => e.operation === 'COMMIT' || e.operation === 'ROLLBACK');
          const status = statusEvent ? statusEvent.operation : 'ACTIVE';
          
          return (
            <button
              key={txId}
              onClick={() => {
                const e = events[events.length - 1];
                selectEvent(isSelected ? null : e);
              }}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded text-left transition-colors",
                isSelected ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-[#1E293B] border border-transparent"
              )}
            >
              <div>
                <div className="text-[11px] font-mono font-bold text-[#E2E8F0]">{txId}</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">{events.length} ops</div>
              </div>
              <div className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded",
                status === 'COMMIT' ? "text-emerald-400 bg-emerald-400/10" : 
                status === 'ROLLBACK' ? "text-red-400 bg-red-400/10" : 
                "text-amber-400 bg-amber-400/10"
              )}>
                {status}
              </div>
            </button>
          )
        })}
        {txnList.length === 0 && (
          <div className="text-center p-4 text-[#64748B] text-[10px]">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}
