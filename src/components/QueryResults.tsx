import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';

export function QueryResults() {
  const { dbState, selectedTable } = useAppStore();

  if (!selectedTable || !dbState.tables[selectedTable]) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-[#64748B] text-sm">
        No table selected
      </div>
    );
  }

  const tableDef = dbState.tables[selectedTable];
  const data = dbState.data[selectedTable] || [];

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full border-collapse text-sm font-mono">
        <thead className="sticky top-0 bg-[#0A0A0C] z-10">
          <tr className="text-left border-b border-[#334155]">
            {tableDef.columns.map((col, idx) => (
              <th key={idx} className="pb-2 pt-2 px-4 text-[#64748B] font-normal uppercase">
                {col.name} <span className="opacity-50 text-[10px] ml-1">{col.type}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[#E2E8F0]">
          <AnimatePresence>
            {data.map((row, rowIndex) => {
              const rowKey = row['id'] || rowIndex;
              return (
                <motion.tr 
                  key={rowKey}
                  initial={{ opacity: 0, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                  animate={{ opacity: 1, backgroundColor: 'transparent' }}
                  exit={{ opacity: 0, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  transition={{ duration: 0.5 }}
                  className="border-b border-[#1E293B] group hover:bg-[#1E293B]/30 transition-colors"
                >
                  {tableDef.columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-3 px-4 whitespace-nowrap">
                      {(col.name === 'balance' || col.name === 'price') ? `₹${row[col.name]}` : String(row[col.name])}
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </AnimatePresence>
          {data.length === 0 && (
            <tr>
              <td colSpan={tableDef.columns.length} className="px-4 py-12 text-center text-[#64748B] text-sm">
                Table is empty
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
