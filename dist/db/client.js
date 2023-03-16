import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();
const pool = new Pool({
    connectionString: 'https://localhost:5432/chat-app',
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined
});
export default pool;
