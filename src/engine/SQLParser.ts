export type ParsedStatement = 
  | { type: 'CREATE_TABLE'; table: string; columns: { name: string; type: string }[] }
  | { type: 'INSERT'; table: string; values: any[] }
  | { type: 'SELECT'; table: string; condition?: { column: string; value: any } }
  | { type: 'UPDATE'; table: string; sets: { column: string; value: any }[]; condition?: { column: string; value: any } }
  | { type: 'DELETE'; table: string; condition?: { column: string; value: any } }
  | { type: 'BEGIN' }
  | { type: 'COMMIT' }
  | { type: 'ROLLBACK' };

export function parseSQL(sql: string): ParsedStatement[] {
  
  const statements: ParsedStatement[] = [];
  
  
  const rawStmts = sql.split(';').map(s => s.replace(/\s+/g, ' ').trim()).filter(s => s.length > 0);
  
  for (let raw of rawStmts) {
    
    if (/^BEGIN$/i.test(raw)) { statements.push({ type: 'BEGIN' }); continue; }
    if (/^COMMIT$/i.test(raw)) { statements.push({ type: 'COMMIT' }); continue; }
    if (/^ROLLBACK$/i.test(raw)) { statements.push({ type: 'ROLLBACK' }); continue; }
    
    
    const createMatch = raw.match(/^CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*)\)$/i);
    if (createMatch) {
      const table = createMatch[1];
      const colsRaw = createMatch[2].split(',').map(c => c.trim());
      const columns = colsRaw.map(c => {
        const parts = c.split(/\s+/);
        return { name: parts[0], type: parts[1] };
      });
      statements.push({ type: 'CREATE_TABLE', table, columns });
      continue;
    }
    
    
    const insertMatch = raw.match(/^INSERT\s+INTO\s+(\w+)\s+VALUES\s*\(([\s\S]*)\)$/i);
    if (insertMatch) {
      const table = insertMatch[1];
      const valsRaw = insertMatch[2].split(',').map(v => v.trim());
      const values = valsRaw.map(v => {
        if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
        if (v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1);
        if (!isNaN(Number(v))) return Number(v);
        return v;
      });
      statements.push({ type: 'INSERT', table, values });
      continue;
    }
    
    
    const selectMatch = raw.match(/^SELECT\s+\*\s+FROM\s+(\w+)(?:\s+WHERE\s+(\w+)\s*=\s*([\s\S]*))?$/i);
    if (selectMatch) {
      const table = selectMatch[1];
      let condition = undefined;
      if (selectMatch[2] && selectMatch[3]) {
        let val: any = selectMatch[3].trim();
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1);
        } else if (!isNaN(Number(val))) {
          val = Number(val);
        }
        condition = { column: selectMatch[2], value: val };
      }
      statements.push({ type: 'SELECT', table, condition });
      continue;
    }
    
    
    
    const updateMatch = raw.match(/^UPDATE\s+(\w+)\s+SET\s+([\s\S]*?)(?:\s+WHERE\s+(\w+)\s*=\s*([\s\S]*))?$/i);
    if (updateMatch) {
      const table = updateMatch[1];
      const setsRaw = updateMatch[2].split(',').map(s => s.trim());
      const sets = setsRaw.map(s => {
        const parts = s.split('=').map(p => p.trim());
        let val: any = parts[1];
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1);
        } else if (!isNaN(Number(val))) {
          val = Number(val);
        }
        return { column: parts[0], value: val };
      });
      
      let condition = undefined;
      if (updateMatch[3] && updateMatch[4]) {
        let val: any = updateMatch[4].trim();
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1);
        } else if (!isNaN(Number(val))) {
          val = Number(val);
        }
        condition = { column: updateMatch[3], value: val };
      }
      statements.push({ type: 'UPDATE', table, sets, condition });
      continue;
    }
    
    
    const deleteMatch = raw.match(/^DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(\w+)\s*=\s*(.*))?$/i);
    if (deleteMatch) {
      const table = deleteMatch[1];
      let condition = undefined;
      if (deleteMatch[2] && deleteMatch[3]) {
        let val: any = deleteMatch[3].trim();
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1);
        } else if (!isNaN(Number(val))) {
          val = Number(val);
        }
        condition = { column: deleteMatch[2], value: val };
      }
      statements.push({ type: 'DELETE', table, condition });
      continue;
    }
    
    throw new Error(`Syntax Error: Unrecognized statement: ${raw}`);
  }
  
  return statements;
}
