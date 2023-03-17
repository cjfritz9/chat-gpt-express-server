var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expect } from 'chai';
import * as TF from '../../db/tokens.js';
import * as UF from '../../db/users.js';
describe('User DB Functions Tests', () => {
    describe('Spend Token By User ID', () => {
        it('Spends a token when supplied valid information', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UF.createUser({
                email: 'test_mail1@test242421.com',
                password: 'abcd1234!'
            });
            //@ts-ignore
            const _user = yield TF.spendTokensByUserId(user.id);
            //@ts-ignore
            expect(user.tokens - 1).to.deep.equal(_user.tokens);
            //@ts-ignore
            console.log('spend tokens test', user.tokens, _user.tokens);
        }));
        it('Returns an error when supplied a bad ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = yield TF.spendTokensByUserId(783341256123);
            expect(error).to.deep.equal('Error: User not found');
            console.log('spend tokens invalid userID test', error);
        }));
        it('Returns an error when user has insufficient tokens', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UF.createUser({
                email: 'test_mail2@test242421.com',
                password: 'abcd1234!'
            });
            //@ts-ignore
            const error = yield TF.spendTokensByUserId(user.id, user.tokens + 1);
            //@ts-ignore
            expect(error).to.deep.equal('Error: User has insufficient tokens');
            //@ts-ignore
            console.log('spend tokens insufficent funds test', error);
        }));
    });
    describe('Refresh Tokens By User ID', () => {
        it('Adds Tokens when supplied valid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UF.createUser({
                email: 'test_mail3@test242421.com',
                password: 'abcd1234!'
            });
            //@ts-ignore
            const _user = yield TF.spendTokensByUserId(user.id);
            //@ts-ignore
            expect(_user.tokens).to.deep.equal(user.tokens - 1);
            const __user = yield TF.refreshTokensByUserId({
                //@ts-ignore
                userId: user.id,
                adminOverride: true
            });
            //@ts-ignore
            expect(__user.tokens).to.deep.equal(user.tokens);
            console.log('Token refresh test', 
            //@ts-ignore
            user.tokens, 
            //@ts-ignore
            _user.tokens, 
            //@ts-ignore
            __user.tokens);
        }));
        it('Does not add tokens when attempted on the same day', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UF.createUser({
                email: 'test_mail4@test242421.com',
                password: 'abcd1234!'
            });
            //@ts-ignore
            const error = yield TF.refreshTokensByUserId({ userId: user.id });
            expect(error).to.deep.equal('Unable to add tokens. Try again tomorrow');
            console.log('Token refresh error, daily limit', error);
        }));
    });
    describe('Get Tokens By User ID', () => {
        it('Returns user and tokens when provided valid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UF.createUser({
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
        }));
        it('Returns error when provided invalid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = yield TF.getTokensByUserId(622451234);
            //@ts-ignore
            expect(error).to.deep.equal('Error: User not found');
        }));
    });
});
