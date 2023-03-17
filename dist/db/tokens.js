var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from './pool.js';
import { getUserById } from './users.js';
export const spendTokensByUserId = (userId, spentTokenAmount = 1) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield getUserById(userId);
        if (typeof currentUser === 'string')
            return 'Error: User not found';
        if (currentUser.tokens < spentTokenAmount) {
            return 'Error: User has insufficient tokens';
        }
        const { rows: [user] } = yield pool.query(`
          UPDATE users
          SET tokens = tokens - ${spentTokenAmount}
          WHERE id = ${userId}
          RETURNING *;
        `);
        return {
            id: user.id,
            email: user.email,
            tokens: user.tokens,
            last_token_refresh: user.last_token_refresh
        };
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
export const refreshTokensByUserId = ({ userId, adminOverride = false }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((yield canAddTokensToUser(userId)) === false &&
            adminOverride === false) {
            return 'Unable to add tokens. Try again tomorrow';
        }
        const { rows: [user] } = yield pool.query(`
          UPDATE users
          SET tokens = 10
          WHERE id = ${userId}
          RETURNING *;
        `);
        return {
            id: user.id,
            email: user.email,
            tokens: user.tokens,
            last_token_refresh: user.last_token_refresh
        };
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
export const getTokensByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: [user] } = yield pool.query(`
        SELECT *
        FROM users
        WHERE id = ${userId}
      `);
        if (!user)
            return 'Error: User not found';
        return user;
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
const canAddTokensToUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: [user] } = yield pool.query(`
            SELECT *
            FROM users
            WHERE id = ${userId};
          `);
        const currentDate = new Date().getDay();
        const lastTokenRefreshDate = new Date(user.last_token_refresh).getDay();
        if (!user || !user.id)
            return 'No User Found';
        if (currentDate !== lastTokenRefreshDate) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});