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
export const addTokensByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((yield canAddTokensToUser(userId)) === false) {
            return 'Unable to add tokens. Try again tomorrow';
        }
        const { rows: [user] } = yield pool.query(`
          UPDATE users
          SET tokens = ${15}
          WHERE id = ${userId}
          RETURNING *;
        `);
        return user;
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
export const getTokensByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: [tokens] } = yield pool.query(`
        SELECT tokens
        FROM users
        WHERE id = ${userId}
      `);
        return tokens;
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
        const lastTokenRefreshDate = new Date(user.lastTokenRefresh).getDay();
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
