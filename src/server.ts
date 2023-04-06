import express, { Express } from 'express';
import cors from 'cors';

export const app: Express = express();
const PORT = process.env._PORT || 8080;

app.use(
  cors({
    origin: '*'
  })
);

app.use(express.json());

app.use((req, _res, next) => {
  const bodyCopy = { ...req.body };
  if (bodyCopy.password) {
    bodyCopy.password = 'hidden';
  }

  console.log('<-----Body Logger Start----->');
  console.log('Received: ', new Date().toLocaleString());
  console.log('Request Body: ', bodyCopy);
  console.log('<-----Body Logger End----->');

  next();
});

import apiRouter from './api.js';

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
