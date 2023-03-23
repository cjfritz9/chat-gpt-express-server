import dotenv from 'dotenv';
import pkg from 'pg';
dotenv.config();

const connectionString = process.env.NODE_ENV === 'production'
? process.env.DB_URL
: 'https://localhost:5432/chat-app';

const { Pool } = pkg;

const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined
});

export default pool;
