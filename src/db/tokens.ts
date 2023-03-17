import UserData from '../models/chat-app/interfaces.js';
import pool from './pool.js';
import { getUserById } from './users.js';

export const spendTokensByUserId = async (
  userId: number,
  spentTokenAmount = 1
) => {
  try {
    const currentUser = await getUserById(userId);
    if (typeof currentUser === 'string') return 'Error: User not found';
    if (currentUser.tokens < spentTokenAmount) {
      return 'Error: User has insufficient tokens';
    }
    const {
      rows: [user]
    }: UserData = await pool.query(
      `
          UPDATE users
          SET tokens = tokens - ${spentTokenAmount}
          WHERE id = ${userId}
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

export const refreshTokensByUserId = async ({
  userId,
  adminOverride = false
}: {
    userId: number;
    adminOverride?: boolean;
}) => {
  try {
    if (
      (await canAddTokensToUser(userId)) === false &&
      adminOverride === false
    ) {
      return 'Unable to add tokens. Try again tomorrow';
    }
    const {
      rows: [user]
    }: UserData = await pool.query(
      `
          UPDATE users
          SET tokens = 10
          WHERE id = ${userId}
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

export const getTokensByUserId = async (userId: number) => {
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
    if (!user) return 'Error: User not found'
    return user;
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
    const lastTokenRefreshDate = new Date(user.last_token_refresh).getDay();

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
