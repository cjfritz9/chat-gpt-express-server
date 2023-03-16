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
import bcrypt from 'bcrypt';
export const createUser = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SALT_COUNT = 10;
        const hashedPassword = yield bcrypt.hash(password, SALT_COUNT);
        const registrationTime = Date();
        const { rows: [user] } = yield pool.query(`
        INSERT INTO USERS (email, password, tokens, lastTokenRefresh),
        VALUES (${email}, ${hashedPassword}, ${10}, ${registrationTime}),
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
      `);
        return user;
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
export const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: [user] } = yield pool.query(`
        SELECT *
        FROM users
        WHERE id = ${userId}
      `);
        if (!user)
            return 'No user found';
        return {
            id: user.id,
            email: user.email,
            tokens: user.tokens,
            lastTokenRefresh: user.lastTokenRefresh
        };
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
export const authenticateUser = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows: [user] } = yield pool.query(`
        SELECT *
        FROM users
        WHERE email = '${email}'
      `);
        if (!user)
            return 'No user found';
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (passwordMatch) {
            return {
                id: user.id,
                email: user.email,
                tokens: user.tokens,
                lastTokenRefresh: user.lastTokenRefresh
            };
        }
        else {
            return 'Invalid Password';
        }
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
