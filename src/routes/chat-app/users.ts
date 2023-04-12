import express, { Request, Response } from 'express';
import {
  authenticateUser,
  createUser,
  getUserById
} from '../../db/users.js';
const usersRouter = express.Router();

usersRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const response = await getUserById(id);
    if (typeof response === 'string') {
      const error = response;
      res.send({
        error
      });
    } else {
      const user = response;
      res.send({
        success: `User ${id} found`,
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

usersRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const response = await authenticateUser({ email, password });
    if (typeof response === 'string') {
      const error = response;
      res.send({
        error
      });
    } else {
      const user = response;
      res.send({
        success: 'Authentication successful',
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

usersRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const response = await createUser({ email, password });
    if (typeof response === 'string') {
      const error = response;
      res.send({
        error
      });
    } else {
      const user = response;
      res.send({
        success: 'Registration successful',
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

export default usersRouter;
