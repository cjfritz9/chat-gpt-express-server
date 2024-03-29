import express, { Request, Response } from 'express';
import { ChatRequest } from '../../models/chat-app/types';
import { openai } from '../../openai.js';
const messagesRouter = express.Router();

messagesRouter.post('/send', async (req: Request, res: Response) => {
  const body: ChatRequest = req.body;

  if (!body[1]) {
    res.send({ error: 'Invalid Request, Try Again' });
  } else {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: body
    });
    if (!response.data.choices || !response.data.choices[0].message) {
      res.send({ error: 'Server Error, Wait and Try Again' });
    } else {
      console.log(response.data.choices[0].message?.content);
      console.log(response.data.choices);
      res.send({ success: response.data.choices[0].message?.content });
    }
  }
});

export default messagesRouter;
