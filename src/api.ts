import express from 'express';
const apiRouter = express.Router();

import chatAppRouter from './routes/chat-app.js';
apiRouter.use('/chat-app', chatAppRouter);

import eldenRingRandomizer from './routes/elden-ring-randomizer.js';
apiRouter.use('/elden-ring-randomizer', eldenRingRandomizer);

export default apiRouter;
