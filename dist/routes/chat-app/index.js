import express from 'express';
import cors from 'cors';
const chatAppRouter = express.Router();
chatAppRouter.use(cors({
    origin: '*'
}));
import messagesRouter from './messages.js';
chatAppRouter.use('/messages', messagesRouter);
import usersRouter from './users.js';
chatAppRouter.use('/users', usersRouter);
import tokensRouter from './tokens.js';
chatAppRouter.use('/tokens', tokensRouter);
export default chatAppRouter;
