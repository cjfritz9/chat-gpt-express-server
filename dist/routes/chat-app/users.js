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
import { authenticateUser, createUser, getUserById } from '../../db/users.js';
const usersRouter = express.Router();
usersRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const response = yield getUserById(+id);
        if (typeof response === 'string') {
            const error = response;
            res.send({
                error
            });
        }
        else {
            const user = response;
            res.send({
                success: `User ${id} found`,
                user
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
usersRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const response = yield authenticateUser({ email, password });
        if (typeof response === 'string') {
            const error = response;
            res.send({
                error
            });
        }
        else {
            const user = response;
            res.send({
                success: 'Authentication successful',
                user
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
usersRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const response = yield createUser({ email, password });
        if (typeof response === 'string') {
            const error = response;
            res.send({
                error
            });
        }
        else {
            const user = response;
            res.send({
                success: 'Registration successful',
                user
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
export default usersRouter;
