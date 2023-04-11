import UserData, { AccountFields } from '../models/chat-app/interfaces';
import bcrypt from 'bcrypt';
import db from './db.js';

export const createUser = async ({ email, password }: AccountFields) => {
  try {
    if (!email || !password) {
      return 'Error: Missing required Email/Password';
    }
    if ((await isEmailTaken(email)) === true) {
      return 'Error: Email address is taken';
    }
    const SALT_COUNT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const registrationTime = Date();

    const users: any = db.collection('users');
    const user: any = await users.set({
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
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const users: any = db.collection('users');
    const snapshot: any = await users.where('email', '==', email).get();

    if (!snapshot) return 'Error: No user found';
    // console.log('db users coll response', users);
    let user = {};
    snapshot.forEach((doc: any) => {
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
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};

export const authenticateUser = async ({ email, password }: AccountFields) => {
  try {
    const users: any = db.collection('users');
    const user: any = await users.where('email', '==', email).get();
    if (!user) return 'Error: No user found';

    console.log('db user response', user);

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

const isEmailTaken = async (email: string) => {
  try {
    const users: any = db.collection('users');
    const user: any = await users.where('email', '==', email).get();
    if (user.exists) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};
