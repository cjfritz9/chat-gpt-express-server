import pool from './pool.js';
import bcrypt from 'bcrypt';
import UserData, { AccountFields } from '../models/chat-app/interfaces';

export const createUser = async ({ email, password }: AccountFields) => {
  try {
    if (!email || !password) {
      return 'Error: Missing required Email/Password'
    }
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const registrationTime = Date();    

    const {
      rows: [user]
    } = await pool.query(
      `
        INSERT INTO USERS (email, password, tokens, last_token_refresh)
        VALUES ('${email}', '${hashedPassword}', ${10}, '${registrationTime}')
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
      `
    );

    return {
      id: user.id,
      email: user.email,
      tokens: user.tokens,
      last_token_refresh: user.last_token_refresh
    };
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};

export const getUserById = async (userId: number) => {
  try {
    const {
      rows: [user]
    }: UserData = await pool.query(
      `
        SELECT *
        FROM users
        WHERE id = ${userId}
      `
    );
    if (!user) return 'Error: No user found';
    return {
      id: user.id,
      email: user.email,
      tokens: user.tokens,
      last_token_refresh: user.last_token_refresh
    };
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};

export const authenticateUser = async ({ email, password }: AccountFields) => {
  try {
    const {
      rows: [user]
    }: UserData = await pool.query(
      `
        SELECT *
        FROM users
        WHERE email = '${email}'
      `
    );
    if (!user) return 'Error: No user found';

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return {
        id: user.id,
        email: user.email,
        tokens: user.tokens,
        last_token_refresh: user.last_token_refresh
      };
    } else {
      return 'Error: Invalid Password';
    }
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};
