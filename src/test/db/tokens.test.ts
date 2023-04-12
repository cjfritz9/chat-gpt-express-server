import { expect } from 'chai';
import * as TF from '../../db/postgres-old-db/tokens-pg.js';
import * as UF from '../../db/postgres-old-db/users-pg.js';

describe('User DB Functions Tests', () => {
  describe('Spend Token By User ID', () => {
    it('Spends a token when supplied valid information', async () => {
      const user = await UF.createUser({
        email: 'test_mail1@test242421.com',
        password: 'abcd1234!'
      });
      //@ts-ignore
      const _user = await TF.spendTokensByUserId(user.id);
      //@ts-ignore
      expect(user.tokens - 1).to.deep.equal(_user.tokens);
      //@ts-ignore
      console.log('spend tokens test', user.tokens, _user.tokens);
    });

    it('Returns an error when supplied a bad ID', async () => {
      const error = await TF.spendTokensByUserId(783341256123);

      expect(error).to.deep.equal('Error: User not found');
      console.log('spend tokens invalid userID test', error);
    });

    it('Returns an error when user has insufficient tokens', async () => {
      const user = await UF.createUser({
        email: 'test_mail2@test242421.com',
        password: 'abcd1234!'
      });
      //@ts-ignore
      const error = await TF.spendTokensByUserId(user.id, user.tokens + 1);
      //@ts-ignore
      expect(error).to.deep.equal('Error: User has insufficient tokens');
      //@ts-ignore
      console.log('spend tokens insufficent funds test', error);
    });
  });

  describe('Refresh Tokens By User ID', () => {
    it('Adds Tokens when supplied valid user ID', async () => {
      const user = await UF.createUser({
        email: 'test_mail3@test242421.com',
        password: 'abcd1234!'
      });
      //@ts-ignore
      const _user = await TF.spendTokensByUserId(user.id);
      //@ts-ignore
      expect(_user.tokens).to.deep.equal(user.tokens - 1);
      const __user = await TF.refreshTokensByUserId({
        //@ts-ignore
        userId: user.id,
        adminOverride: true
      });
      //@ts-ignore
      expect(__user.tokens).to.deep.equal(user.tokens);
      console.log(
        'Token refresh test',
        //@ts-ignore
        user.tokens,
        //@ts-ignore
        _user.tokens,
        //@ts-ignore
        __user.tokens
      );
    });

    it('Does not add tokens when attempted on the same day', async () => {
      const user = await UF.createUser({
        email: 'test_mail4@test242421.com',
        password: 'abcd1234!'
      });
      //@ts-ignore
      const error = await TF.refreshTokensByUserId({ userId: user.id });

      expect(error).to.deep.equal('Unable to add tokens. Try again tomorrow');
      console.log('Token refresh error, daily limit', error);
    });
  });

  describe('Get Tokens By User ID', () => {
    it('Returns user and tokens when provided valid user ID', async () => {
      const user = await UF.createUser({
        email: 'test_mail5@test242421.com',
        password: 'abcd1234!'
      });
      //@ts-ignore
      expect(user.email).to.deep.equal('test_mail5@test242421.com');
      expect(user).to.contain.keys([
        'id',
        'email',
        'tokens',
        'last_token_refresh'
      ]);
    });

    it('Returns error when provided invalid user ID', async () => {
      const error = await TF.getTokensByUserId(622451234);
      //@ts-ignore
      expect(error).to.deep.equal('Error: User not found');
    });
  });
});
