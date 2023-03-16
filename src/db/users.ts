import pool from './pool.js';
import bcrypt from 'bcrypt';
import UserData, { AccountFields } from '../models/chat-app/interfaces';

export const createUser = async ({ email, password }: AccountFields) => {
  try {
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const registrationTime = Date();

    const {
      rows: [user]
    } = await pool.query(
      `
        INSERT INTO USERS (email, password, tokens, lastTokenRefresh),
        VALUES (${email}, ${hashedPassword}, ${10}, ${registrationTime}),
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
      `
    );
    return user;
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
    if (!user) return 'No user found';
    return {
      id: user.id,
      email: user.email,
      tokens: user.tokens,
      lastTokenRefresh: user.lastTokenRefresh
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
    if (!user) return 'No user found';

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return {
        id: user.id,
        email: user.email,
        tokens: user.tokens,
        lastTokenRefresh: user.lastTokenRefresh
      };
    } else {
      return 'Invalid Password';
    }
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};
