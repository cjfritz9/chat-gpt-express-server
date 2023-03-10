const express = require('express');
const apiRouter = express.Router();
const chatAppRouter = require('./routes/chat-app');
apiRouter.use('/chat-app', chatAppRouter);
const eldenRingRandomizer = require('./routes/chat-app');
apiRouter.use('/elden-ring-randomizer', eldenRingRandomizer);
export default apiRouter;
