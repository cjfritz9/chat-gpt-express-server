import { AccountFields } from '../models/chat-app/interfaces';
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
    const res: any = await users.add({
      email,
      password: hashedPassword,
      tokens: 10,
      last_token_refresh: registrationTime
    });

    return {
      id: res.id,
      email,
      tokens: 10,
      last_token_refresh: registrationTime
    };
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};

export const getUserById = async (userId: string) => {
  try {
    const docRef: any = db.collection('users').doc(userId);
    const userDoc: any = await docRef.get();

    if (userDoc.empty) return 'Error: No user found';

    let user = userDoc.data();
    Object.assign(user, { id: userDoc.id });
    delete user.password;

    return user;
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
    let user: any = {};
    snapshot.forEach((doc: any) => {
      Object.assign(user, { id: doc.id });
      Object.assign(user, doc.data());
      delete user.password;
    });
    return user;
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};

export const authenticateUser = async ({ email, password }: AccountFields) => {
  try {
    const users: any = db.collection('users');
    const userDoc: any = await users.where('email', '==', email).get();
    if (userDoc.empty) {
      return 'Error: No user found';
    }

    let user: any = {};
    userDoc.forEach((doc: any) => {
      Object.assign(user, { id: doc.id });
      Object.assign(user, doc.data());
    });

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
    const userDoc: any = await users.where('email', '==', email).get();
    if (userDoc.empty) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error(err);
    return 'Database Error: Check logs';
  }
};
