import UserData from '../models/chat-app/interfaces.js';
import pool from './pool.js';

export const addTokensByUserId = async (userId: number) => {
  try {
    if ((await canAddTokensToUser(userId)) === false) {
      return 'Unable to add tokens. Try again tomorrow';
    }
    const {
      rows: [user]
    }: UserData = await pool.query(
      `
          UPDATE users
          SET tokens = ${15}
          WHERE id = ${userId}
          RETURNING *;
        `
    );
    return user;
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};

export const getTokensByUserId = async (userId: number) => {
  try {
    const { rows: [tokens] }: UserData = await pool.query(
      `
        SELECT tokens
        FROM users
        WHERE id = ${userId}
      `
    )

    return tokens;
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};

const canAddTokensToUser = async (userId: number) => {
  try {
    const {
      rows: [user]
    }: UserData = await pool.query(
      `
            SELECT *
            FROM users
            WHERE id = ${userId};
          `
    );

    const currentDate = new Date().getDay();
    const lastTokenRefreshDate = new Date(user.lastTokenRefresh).getDay();

    if (!user || !user.id) return 'No User Found';

    if (currentDate !== lastTokenRefreshDate) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};
