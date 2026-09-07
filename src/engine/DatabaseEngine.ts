import { DatabaseState, LSN, QueryResult, TableDef, TransactionID, WALEvent } from './types';
import { ParsedStatement, parseSQL } from './SQLParser';

export class DatabaseEngine {
  private state: DatabaseState = { tables: {}, data: {} };
  private wal: WALEvent[] = [];
  private nextLsn: LSN = 1000;
  private activeTransactionId: TransactionID | null = null;
  private nextTransactionNum = 1000;
  private transactionSnapshots: { [id: string]: DatabaseState } = {};

  constructor() {}

  public executeSQL(sql: string): QueryResult {
    try {
      const statements = parseSQL(sql);
      let lastResult: QueryResult = { success: true, message: 'OK' };
      
      for (const stmt of statements) {
        lastResult = this.executeStatement(stmt);
      }
      return lastResult;
    } catch (e: any) {
      return { success: false, error: e.message || String(e) };
    }
  }

  private executeStatement(stmt: ParsedStatement): QueryResult {
    switch (stmt.type) {
      case 'CREATE_TABLE': {
        if (this.state.tables[stmt.table]) {
          throw new Error(`Table ${stmt.table} already exists`);
        }
        this.state.tables[stmt.table] = { name: stmt.table, columns: stmt.columns };
        this.state.data[stmt.table] = [];
        return { success: true, message: `Table ${stmt.table} created.` };
      }
      case 'INSERT': {
        const tableDef = this.state.tables[stmt.table];
        if (!tableDef) throw new Error(`Table ${stmt.table} does not exist`);
        
        const row: any = {};
        for (let i = 0; i < tableDef.columns.length; i++) {
          row[tableDef.columns[i].name] = stmt.values[i];
        }
        
        this.state.data[stmt.table].push(row);
        
        const rowId = row['id'] || stmt.values[0]; // best effort ID
        
        this.recordWAL({
          operation: 'INSERT',
          table: stmt.table,
          rowId,
          changes: Object.keys(row).reduce((acc, key) => {
            acc[key] = { new: row[key] };
            return acc;
          }, {} as any)
        });
        
        return { success: true, message: `1 row inserted.` };
      }
      case 'SELECT': {
        const tableDef = this.state.tables[stmt.table];
        if (!tableDef) throw new Error(`Table ${stmt.table} does not exist`);
        
        let data = this.state.data[stmt.table];
        if (stmt.condition) {
          data = data.filter(r => r[stmt.condition!.column] === stmt.condition!.value);
        }
        return { success: true, data: [...data] };
      }
      case 'UPDATE': {
        const tableDef = this.state.tables[stmt.table];
        if (!tableDef) throw new Error(`Table ${stmt.table} does not exist`);
        
        let updatedCount = 0;
        const data = this.state.data[stmt.table];
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          if (!stmt.condition || row[stmt.condition.column] === stmt.condition.value) {
            const oldRow = { ...row };
            const changes: any = {};
            
            for (const set of stmt.sets) {
              changes[set.column] = { old: oldRow[set.column], new: set.value };
              row[set.column] = set.value;
            }
            
            const rowId = row['id'] || i;
            this.recordWAL({
              operation: 'UPDATE',
              table: stmt.table,
              rowId,
              changes
            });
            updatedCount++;
          }
        }
        return { success: true, message: `${updatedCount} row(s) updated.` };
      }
      case 'DELETE': {
        const tableDef = this.state.tables[stmt.table];
        if (!tableDef) throw new Error(`Table ${stmt.table} does not exist`);
        
        const data = this.state.data[stmt.table];
        const newData = [];
        let deletedCount = 0;
        
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          if (!stmt.condition || row[stmt.condition.column] === stmt.condition.value) {
            const changes: any = {};
            for (const col of Object.keys(row)) {
              changes[col] = { old: row[col] };
            }
            const rowId = row['id'] || i;
            this.recordWAL({
              operation: 'DELETE',
              table: stmt.table,
              rowId,
              changes
            });
            deletedCount++;
          } else {
            newData.push(row);
          }
        }
        this.state.data[stmt.table] = newData;
        return { success: true, message: `${deletedCount} row(s) deleted.` };
      }
      case 'BEGIN': {
        if (this.activeTransactionId) {
          throw new Error('Transaction already in progress');
        }
        this.activeTransactionId = `T${this.nextTransactionNum++}`;
        // Deep copy state for rollback
        this.transactionSnapshots[this.activeTransactionId] = JSON.parse(JSON.stringify(this.state));
        this.recordWAL({ operation: 'BEGIN' });
        return { success: true, message: `Transaction ${this.activeTransactionId} started.` };
      }
      case 'COMMIT': {
        if (!this.activeTransactionId) {
          throw new Error('No active transaction to commit');
        }
        this.recordWAL({ operation: 'COMMIT' });
        delete this.transactionSnapshots[this.activeTransactionId];
        this.activeTransactionId = null;
        return { success: true, message: 'Transaction committed.' };
      }
      case 'ROLLBACK': {
        if (!this.activeTransactionId) {
          throw new Error('No active transaction to rollback');
        }
        this.recordWAL({ operation: 'ROLLBACK' });
        // Restore state
        this.state = JSON.parse(JSON.stringify(this.transactionSnapshots[this.activeTransactionId]));
        delete this.transactionSnapshots[this.activeTransactionId];
        this.activeTransactionId = null;
        return { success: true, message: 'Transaction rolled back.' };
      }
    }
  }

  private recordWAL(partialEvent: Omit<WALEvent, 'lsn' | 'timestamp' | 'transactionId'>) {
    const event: WALEvent = {
      lsn: this.nextLsn++,
      transactionId: this.activeTransactionId || `T${this.nextTransactionNum++}`,
      timestamp: new Date().toISOString(),
      ...partialEvent
    };
    this.wal.push(event);
  }

  public getCurrentState(): DatabaseState {
    return this.state; // Ideally deep copy, but we can pass reference for UI speed
  }

  public getHistory(): WALEvent[] {
    return this.wal;
  }
}
