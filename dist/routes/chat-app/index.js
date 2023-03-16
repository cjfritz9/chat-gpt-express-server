import express from 'express';
import cors from 'cors';
const chatAppRouter = express.Router();
chatAppRouter.use(cors({
    origin: '*'
}));
export default chatAppRouter;
