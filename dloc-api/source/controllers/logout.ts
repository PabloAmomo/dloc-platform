import { encriptionHelper } from '../functions/encriptionHelper';
import { getPersistence } from '../persistence/persistence';
import { logoutUser } from '../functions/logoutUser';
import { ResponseCode } from '../enums/ResponseCode';
import express, { Request, Response } from 'express';

const routers = express.Router();

routers.get('/logout', async (req: Request, res: Response, next) => {
  await logoutUser(req, getPersistence(), encriptionHelper);
  res.status(ResponseCode.OK).json({ message: 'ok' });
});

export default routers;