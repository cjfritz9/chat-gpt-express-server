var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from './db.js';
import { getUserById } from './users.js';
export const spendTokensByUserId = (userId, spentTokenAmount = 1) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield getUserById(userId);
        if (typeof currentUser === 'string')
            return 'Error: User not found';
        if (currentUser.tokens < spentTokenAmount) {
            return 'Error: User has insufficient tokens';
        }
        yield db
            .collection('users')
            .doc(userId)
            .update({
            tokens: currentUser.tokens - spentTokenAmount
        });
        return {
            id: currentUser.id,
            email: currentUser.email,
            tokens: currentUser.tokens - spentTokenAmount,
            last_token_refresh: currentUser.last_token_refresh
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
        yield db.collection('users').doc(userId).update({
            tokens: 10,
            last_token_refresh: Date()
        });
        return yield getUserById(userId);
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
export const getTokensByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = getUserById(userId);
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
        const user = yield getUserById(userId);
        const currentTime = new Date().getTime();
        const lastTokenRefreshTime = new Date(user.last_token_refresh).getTime();
        if (!user || !user.id)
            return 'No User Found';
        if (currentTime - 86400000 >= lastTokenRefreshTime) {
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
