import { DatabaseEngine } from './DatabaseEngine';

export function loadDemoDatabase(db: DatabaseEngine) {
  const scripts = [
    `CREATE TABLE customers (id INT, name TEXT, tier TEXT)`,
    `CREATE TABLE accounts (id INT, name TEXT, balance INT)`,
    `CREATE TABLE orders (id INT, customer_id INT, status TEXT)`,
    `CREATE TABLE products (id INT, name TEXT, price INT)`,
    
    `INSERT INTO customers VALUES (1, 'Alice', 'Gold')`,
    `INSERT INTO customers VALUES (2, 'Bob', 'Silver')`,
    `INSERT INTO customers VALUES (3, 'Charlie', 'Bronze')`,
    
    `INSERT INTO accounts VALUES (1, 'Alice', 10000)`,
    `INSERT INTO accounts VALUES (2, 'Bob', 7500)`,
    `INSERT INTO accounts VALUES (3, 'Charlie', 12500)`,
    
    `INSERT INTO products VALUES (1, 'Laptop', 1500)`,
    `INSERT INTO products VALUES (2, 'Phone', 800)`,
    
    `BEGIN`,
    `UPDATE accounts SET balance = 9500 WHERE id = 1`,
    `INSERT INTO orders VALUES (101, 1, 'Processing')`,
    `COMMIT`,
    
    `BEGIN`,
    `UPDATE accounts SET balance = 8500 WHERE id = 1`,
    `UPDATE orders SET status = 'Shipped' WHERE id = 101`,
    `COMMIT`,
    
    `BEGIN`,
    `UPDATE accounts SET balance = 7500 WHERE id = 1`,
    `COMMIT`,
    
    `BEGIN`,
    `UPDATE accounts SET balance = 0 WHERE id = 1`,
    `COMMIT`
  ];

  for (const script of scripts) {
    db.executeSQL(script);
  }
}
