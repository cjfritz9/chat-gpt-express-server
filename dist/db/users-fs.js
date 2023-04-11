var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import db from './db.js';
export const createUser = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!email || !password) {
            return 'Error: Missing required Email/Password';
        }
        if ((yield isEmailTaken(email)) === true) {
            return 'Error: Email address is taken';
        }
        const SALT_COUNT = 10;
        const hashedPassword = yield bcrypt.hash(password, SALT_COUNT);
        const registrationTime = Date();
        const users = db.collection('users');
        const user = yield users.set({
            email,
            password: hashedPassword,
            tokens: 10,
            last_token_refresh: registrationTime
        });
        console.log('db user response', user);
        return user;
        // return {
        //   id: user.id,
        //   email: user.email,
        //   tokens: user.tokens,
        //   last_token_refresh: user.last_token_refresh
        // };
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
export const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = db.collection('users');
        const snapshot = yield users.where('email', '==', email).get();
        if (!snapshot)
            return 'Error: No user found';
        // console.log('db users coll response', users);
        let user = {};
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
            user = doc.data();
            console.log('user: ', user);
            // @ts-ignore
            delete user.password;
        });
        return user;
        // return {
        //   id: user.id,
        //   email: user.email,
        //   tokens: user.tokens,
        //   last_token_refresh: user.last_token_refresh
        // };
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
export const authenticateUser = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = db.collection('users');
        const user = yield users.where('email', '==', email).get();
        if (!user)
            return 'Error: No user found';
        console.log('db user response', user);
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (passwordMatch) {
            return {
                id: user.id,
                email: user.email,
                tokens: user.tokens,
                last_token_refresh: user.last_token_refresh
            };
        }
        else {
            return 'Error: Invalid Password';
        }
    }
    catch (err) {
        console.error(err);
        return 'Database Error: Check logs';
    }
});
const isEmailTaken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = db.collection('users');
        const user = yield users.where('email', '==', email).get();
        if (user.exists) {
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
