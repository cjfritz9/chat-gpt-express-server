import { Express, Request, Response } from 'express';
import { openai } from './openai';
const cors = require('cors');
const express = require('express');

export const app: Express = express();
const PORT = process.env._PORT;

app.use(
  cors({
    origin: 'https://eldencreator.com'
  })
);

app.use(express.json());

app.post('/chat-gpt/eldenring/names', async (req: Request, res: Response) => {
  const prompt: string = req.body.prompt;

  if (!prompt) {
    res.send('Invalid Prompt, Try Again');
  } else {
    console.log(prompt);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You are a name generator. You generate first and last names given a theme. You only generate one name. Your generated names must be less than 16 total characters. You reply only the name in the form of a CamelCase string with no spaces between names. If you cannot do this your exact reply will be 'Error'"
        },
        {
          role: 'user',
          content: `Theme: ${prompt}`
        }
      ]
    });
    if (!response.data.choices || !response.data.choices[0].message) {
      res.send('Server Error, Wait and Try Again');
    } else {
      console.log(response.data.choices[0].message?.content);
      console.log(response.data.choices);
      res.send(response.data.choices[0].message?.content);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is healthy`);
});
