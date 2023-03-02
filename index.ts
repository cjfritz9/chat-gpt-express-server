import { Express, Request, Response } from 'express';
import { openai } from './openai';
const express = require('express');

const app: Express = express();
const PORT = process.env.PORT;

app.get('/chatGPT', async (req: Request, res: Response) => {
  console.log(req);
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a name generator' },
      { role: 'user', content: 'Generate a first and last name for a dark souls character using Twitch emotes' }
    ]
  });
  console.log(response.data.choices[0].message?.content);
  
  res.send('ExpressTS server is running');
});

app.listen(PORT, () => {
  console.log(`Server is healthy`);
});
