import dotenv from 'dotenv';
import pkg from 'pg';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool(
  process.env.NODE_ENV === 'production'
    ? {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        port: 5432
      }
    : {
        connectionString: 'https://localhost:5432/chat-app',
        ssl: undefined
      }
);

export default pool;
