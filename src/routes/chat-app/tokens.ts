import express, { Request, Response } from 'express';
import { getTokensByUserId, refreshTokensByUserId, spendTokensByUserId } from '../../db/tokens.js';

const tokensRouter = express.Router();

tokensRouter.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const response = await getTokensByUserId(+userId);
    if (typeof response === 'string') {
      const error = response;
      res.send({
        error
      });
    } else {
      const user = response;
      res.send({
        success: `User ${userId} found`,
        availableTokens: user.tokens
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      error: err
    });
  }
});

tokensRouter.post('/subtract', async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;

    const response =
      amount === undefined
        ? await spendTokensByUserId(+userId)
        : await spendTokensByUserId(+userId, amount);
    
    if (typeof response === 'string') {
      const error = response;
      res.send({
        error
      });
    } else {
      const user = response;
      res.send({
        success: `User ${userId} found`,
        remainingTokens: user.tokens
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      error: err
    });
  }
});

tokensRouter.post('/add', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const response = await refreshTokensByUserId({userId: +userId});
    
    if (typeof response === 'string') {
      const error = response;
      res.send({
        error
      });
    } else {
      const user = response;
      console.log(user)
      res.send({
        success: `Tokens added for user ${userId}`,
        user
      });
    }
  } catch (err) {
    console.error(err);
    res.send({
      error: err
    });
  }
});

export default tokensRouter;
