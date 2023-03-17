var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { getTokensByUserId, refreshTokensByUserId, spendTokensByUserId } from '../../db/tokens.js';
const tokensRouter = express.Router();
tokensRouter.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const response = yield getTokensByUserId(+userId);
        if (typeof response === 'string') {
            const error = response;
            res.send({
                error
            });
        }
        else {
            const user = response;
            res.send({
                success: `User ${userId} found`,
                availableTokens: user.tokens
            });
        }
    }
    catch (err) {
        console.error(err);
        res.send({
            error: err
        });
    }
}));
tokensRouter.post('/subtract', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount } = req.body;
        const response = amount === undefined
            ? yield spendTokensByUserId(+userId)
            : yield spendTokensByUserId(+userId, amount);
        if (typeof response === 'string') {
            const error = response;
            res.send({
                error
            });
        }
        else {
            const user = response;
            res.send({
                success: `User ${userId} found`,
                remainingTokens: user.tokens
            });
        }
    }
    catch (err) {
        console.error(err);
        res.send({
            error: err
        });
    }
}));
tokensRouter.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const response = yield refreshTokensByUserId({ userId: +userId });
        if (typeof response === 'string') {
            const error = response;
            res.send({
                error
            });
        }
        else {
            const user = response;
            res.send({
                success: `User ${userId} found`,
                remainingTokens: user.tokens
            });
        }
    }
    catch (err) {
        console.error(err);
        res.send({
            error: err
        });
    }
}));
export default tokensRouter;
