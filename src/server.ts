import express, { Express } from 'express';
import cors from 'cors';

export const app: Express = express();
const PORT = process.env._PORT;

app.use(
  cors({
    origin: '*'
  })
);

app.use(express.json());

app.use((req, _res, next) => {
  console.log('<-----Body Logger Start----->');
  console.log(req.body);
  console.log('<-----Body Logger End----->');

  next();
});

import apiRouter from './api.js';
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is healthy`);
});
