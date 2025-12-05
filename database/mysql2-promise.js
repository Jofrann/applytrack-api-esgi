// database/mysql2-promise.js
import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',  
  database: 'nje'    
});
