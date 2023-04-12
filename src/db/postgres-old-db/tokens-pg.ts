import pool from './pool-pg.js';
import { getUserById } from './users-pg.js';

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
    }: any = await pool.query(
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
    }: any = await pool.query(
      `
          UPDATE users
          SET tokens = 10, last_token_refresh = '${Date()}'
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
    }: any = await pool.query(
      `
        SELECT *
        FROM users
        WHERE id = ${userId}
      `
    );
    if (!user) return 'Error: User not found';
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
    }: any = await pool.query(
      `
            SELECT *
            FROM users
            WHERE id = ${userId};
          `
    );

    const currentTime = new Date().getTime();
    const lastTokenRefreshTime = new Date(user.last_token_refresh).getTime();

    if (!user || !user.id) return 'No User Found';

    if (currentTime - 86400000 >= lastTokenRefreshTime) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};
