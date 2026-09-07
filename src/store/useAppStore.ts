import { create } from 'zustand';
import { DatabaseEngine } from '../engine/DatabaseEngine';
import { loadDemoDatabase } from '../engine/DemoData';
import { DatabaseState, WALEvent } from '../engine/types';

interface AppState {
  db: DatabaseEngine;
  dbState: DatabaseState;
  walEvents: WALEvent[];
  isConnected: boolean;
  selectedEvent: WALEvent | null;
  selectedTable: string | null;
  initDb: () => void;
  executeSQL: (sql: string) => { success: boolean; message?: string; data?: any[]; error?: string };
  selectEvent: (event: WALEvent | null) => void;
  selectTable: (table: string | null) => void;
  loadDemo: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  db: new DatabaseEngine(),
  dbState: { tables: {}, data: {} },
  walEvents: [],
  isConnected: false,
  selectedEvent: null,
  selectedTable: null,

  initDb: () => {
    const db = get().db;
    set({
      dbState: JSON.parse(JSON.stringify(db.getCurrentState())),
      walEvents: [...db.getHistory()],
      isConnected: true,
      selectedTable: 'accounts',
    });
  },

  executeSQL: (sql: string) => {
    const db = get().db;
    const result = db.executeSQL(sql);
    
    // Update store state after execution
    set({
      dbState: JSON.parse(JSON.stringify(db.getCurrentState())),
      walEvents: [...db.getHistory()],
    });
    
    return result;
  },
  
  selectEvent: (event) => set({ selectedEvent: event }),
  
  selectTable: (table) => set({ selectedTable: table }),

  loadDemo: () => {
    const db = new DatabaseEngine();
    loadDemoDatabase(db);
    
    const tables = Object.keys(db.getCurrentState().tables);
    const selectedTable = tables.length > 0 ? tables[0] : null;

    set({
      db,
      dbState: JSON.parse(JSON.stringify(db.getCurrentState())),
      walEvents: [...db.getHistory()],
      isConnected: true,
      selectedTable
    });
  }
}));
