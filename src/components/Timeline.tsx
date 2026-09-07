import React, { useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import { WALEvent } from '../engine/types';

export function Timeline() {
  const { walEvents, selectedEvent, selectEvent } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [walEvents.length]);

  return (
    <div 
      ref={scrollRef}
      className="flex items-center gap-1 overflow-x-auto h-24 no-scrollbar"
    >
      {walEvents.map((event, idx) => {
        const isSelected = selectedEvent?.lsn === event.lsn;
        return (
          <React.Fragment key={event.lsn}>
            <TimelineNode 
              event={event} 
              isSelected={isSelected}
              onClick={() => selectEvent(isSelected ? null : event)}
            />
            {idx < walEvents.length - 1 && (
               <div className={cn("flex-none w-4 h-px", isSelected || selectedEvent?.lsn === walEvents[idx + 1].lsn ? "bg-blue-500/50" : "bg-[#1E293B]")}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TimelineNode({ event, isSelected, onClick }: { key?: any, event: WALEvent, isSelected: boolean, onClick: () => void }) {
  const time = new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (isSelected) {
    return (
      <div 
        className="flex-none w-48 p-3 rounded border border-blue-500/40 bg-blue-900/10 shadow-[0_0_15px_rgba(59,130,246,0.1)] cursor-pointer"
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div className="text-[10px] text-blue-300">{time}</div>
          <div className="px-1 bg-blue-500 text-[8px] text-white rounded">ACTIVE</div>
        </div>
        <div className="text-xs font-bold text-white uppercase mt-1">{event.operation} {event.table && `(${event.table})`}</div>
        {event.changes && Object.entries(event.changes).map(([col, change]) => (
          <div key={col} className="text-[11px] font-mono mt-1 text-red-300">
             {change.old !== undefined ? (col === 'balance' || col === 'price' ? `₹${change.old}` : change.old) : ''} → {change.new !== undefined ? (col === 'balance' || col === 'price' ? `₹${change.new}` : change.new) : ''}
          </div>
        )).slice(0, 1)}
        <div className="text-[10px] text-blue-400 mt-2 font-mono">TX_ID: {event.transactionId}</div>
      </div>
    );
  }

  return (
    <div 
      className="flex-none w-32 p-3 rounded border border-[#1E293B] bg-[#020617] cursor-pointer hover:bg-[#1E293B]/50 transition-colors opacity-80"
      onClick={onClick}
    >
      <div className="text-[10px] text-[#64748B]">{time}</div>
      <div className="text-xs font-bold text-[#E2E8F0]">{event.operation}</div>
      <div className="text-[10px] text-blue-500 font-mono mt-1">{event.transactionId}</div>
    </div>
  );
}
