import { expect } from 'chai';
import * as UF from '../../db/postgres-old-db/users-pg.js';

describe('User DB Functions Tests', () => {
  describe('Create User', () => {
    it('Creates a new user & returns their details when all given information is valid', async () => {
      const user = await UF.createUser({
        email: 'testmail@test242421.com',
        password: 'abcd1234!'
      });
      expect(user).to.have.all.keys([
        'id',
        'email',
        'tokens',
        'last_token_refresh'
      ]);
    });

    it('Does not create a user when missing required fields', async () => {
      //@ts-ignore
      const user1 = await UF.createUser({
        password: 'abcd1234!'
      });
      //@ts-ignore
      const user2 = await UF.createUser({
        email: 'testmail2@test242421.com'
      });
      expect(user1).to.deep.equal('Error: Missing required Email/Password');
      expect(user2).to.deep.equal('Error: Missing required Email/Password');
    });

    it('Does not create an additional user with the same email', async () => {
      const user = await UF.createUser({
        email: 'testmail@test242421.com',
        password: 'abcd1234!'
      });
      expect(user).to.deep.equal('Database Error: Check logs');
    });
  });

  describe('Get User By ID', () => {
    it('Returns the correct user given their ID', async () => {
      const user = await UF.createUser({
        email: 'testmail3@test242421.com',
        password: 'abcd1234!'
      });

      //@ts-ignore
      const _user = await UF.getUserById(user.id);
      //@ts-ignore
      expect(_user.email).to.deep.equal(user.email);
    });

    it('Returns an error when provided the ID of a nonexistent user', async () => {
      const error = await UF.getUserById(1341414412343132);
      console.log('test', error);
      expect(error).to.deep.equal('Error: No user found');
    });

    it('Does not return the user password', async () => {
      const user = await UF.createUser({
        email: 'testmail4@test242421.com',
        password: 'abcd1234!'
      });
      //@ts-ignore
      const _user = await UF.getUserById(user.id);
      console.log('test', _user);
      expect(_user).to.not.haveOwnProperty('password');
    });
  });

  describe('User Authentication', () => {
    it('Returns the user when provided a matching username and password', async () => {
      const user = await UF.createUser({
        email: 'testmail5@test242421.com',
        password: 'abcd12345!'
      });
      const _user = await UF.authenticateUser({
        email: 'testmail5@test242421.com',
        password: 'abcd12345!'
      });
      expect(_user).to.deep.equal(user);
    });

    it('Returns an appropriate error when provided the incorrect password', async () => {
      await UF.createUser({
        email: 'testmail6@test242421.com',
        password: 'abcd12345!'
      });
      const error = await UF.authenticateUser({
        email: 'testmail6@test242421.com',
        password: 'abcd12342!'
      });
      expect(error).to.deep.equal('Error: Invalid Password');
    });

    it('Returns an appropriate error when provided a non-matching email', async () => {
      const error = await UF.authenticateUser({
        email: 'thisIsntEvenAnEmail',
        password: '0'
      });
      expect(error).to.deep.equal('Error: No user found');
    });
  });
});
