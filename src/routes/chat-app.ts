import { Request, Response } from 'express';
const express = require('express');
const chatAppRouter = express.Router();

chatAppRouter.post('/send', async (req: Request, res: Response) => {
  console.log(req.body);
  res.send({ msg: 'working' });
});

export default chatAppRouter;
