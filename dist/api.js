import express from 'express';
const apiRouter = express.Router();
import chatAppRouter from './routes/chat-app/index.js';
apiRouter.use('/chat-app', chatAppRouter);
import eldenRingRandomizer from './routes/elden-ring-randomizer/names.js';
apiRouter.use('/elden-ring-randomizer', eldenRingRandomizer);
export default apiRouter;
