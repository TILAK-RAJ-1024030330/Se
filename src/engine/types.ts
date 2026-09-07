export type LSN = number;
export type TransactionID = string;

export interface WALEvent {
  lsn: LSN;
  transactionId: TransactionID | null;
  timestamp: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'BEGIN' | 'COMMIT' | 'ROLLBACK';
  table?: string;
  rowId?: any;
  changes?: {
    [column: string]: { old?: any; new?: any };
  };
}

export interface ColumnDef {
  name: string;
  type: string;
}

export interface TableDef {
  name: string;
  columns: ColumnDef[];
}

export interface DatabaseState {
  tables: Record<string, TableDef>;
  data: Record<string, any[]>;
}

export interface QueryResult {
  success: boolean;
  message?: string;
  data?: any[];
  error?: string;
}
