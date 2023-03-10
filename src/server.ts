import { Express } from 'express';

const express = require('express');
const cors = require('cors');

export const app: Express = express();
const PORT = process.env._PORT;

app.use(
  cors({
    origin: 'https://eldencreator.com'
  })
);

app.use(express.json());

app.use((req, _res, next) => {
  console.log('<-----Body Logger Start----->');
  console.log(req.body);
  console.log('<-----Body Logger End----->');

  next();
});

const apiRouter = require('./index');
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is healthy`);
});
