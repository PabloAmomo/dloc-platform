import { checkToken } from '../functions/checkToken';
import { DeviceActionsType, deviceActions } from './actions.device';
import { DeviceSharedActionsType, deviceSharedActions } from './actions.deviceShared';
import { encriptionHelper } from '../functions/encriptionHelper';
import { getDevice } from '../services/device/getDevice';
import { getDevices } from '../services/device/getDevices';
import { getPersistence } from '../persistence/persistence';
import { getTokenAndAuthFromReq } from '../functions/getTokenAndAuthFromReq';
import { ImageActionsType, imageActions } from './actions.image';
import { ResponseCode } from '../enums/ResponseCode';
import { UserData } from '../models/UserData';
import express, { Request, Response } from 'express';

const routers = express.Router();

/** -------------- */
/** Devices        */
/** -------------- */
routers.get('/devices', async (req, res, next) => {
  const imei: string = req.query?.id?.toString() ?? '';
  const interval: number = parseInt(req.query?.interval?.toString() ?? '1') ?? 1;

  /** validate user */
  const userData: UserData | undefined = await validateUser(req, res);
  if (!userData) return;

  /* Get all devices (or one if ?id=xxxx) with interval */
  if (imei) getDevice(imei, userData.userId, getPersistence()).then((response) => res.status(response.code).json(response.result));
  else getDevices(interval, userData.userId, getPersistence()).then((response) => res.status(response.code).json(response.result));
});

/** -------------- */
/** Devices/Shared */
/** -------------- */
routers.post('/devices/shared/:id', async (req, res, next) => deviceSharedActions(DeviceSharedActionsType.ADD, req, res));
routers.delete('/devices/shared/:id', async (req, res, next) => deviceSharedActions(DeviceSharedActionsType.DELETE, req, res));

/** ----------------- */
/** Devices/:id/image */
/** ----------------- */
routers.get('/devices/image', async (req, res, next) => imageActions(ImageActionsType.GET, req, res));
routers.get('/devices/:id/image/download', async (req, res, next) => imageActions(ImageActionsType.DOWNLOAD, req, res));
routers.get('/devices/:id/image', async (req, res, next) => imageActions(ImageActionsType.GET, req, res));
routers.post('/devices/:id/image', async (req, res, next) => imageActions(ImageActionsType.UPLOAD, req, res));
routers.delete('/devices/:id/image', async (req, res, next) => imageActions(ImageActionsType.DELETE, req, res));

/** -------------- */
/** Devices/:id    */
/** -------------- */
routers.get('/devices/:id', async (req, res, next) => {
  const imei: string = req.params?.id;

  /** validate user */
  const userData: UserData | undefined = await validateUser(req, res);
  if (!userData) return;

  /** validate imei and get positions */
  if (!imei) res.status(ResponseCode.BAD_REQUEST).json({ error: 'imei is required' });
  else getDevice(imei, userData.userId, getPersistence()).then((response) => res.status(response.code).json(response.result));
});
routers.put('/devices/:id', async (req, res, next) => deviceActions(DeviceActionsType.UPDATE, req, res));
routers.post('/devices/:id', async (req, res, next) => deviceActions(DeviceActionsType.ADD, req, res));
routers.delete('/devices/:id', async (req, res, next) => deviceActions(DeviceActionsType.DELETE, req, res));

export default routers;

const validateUser = async (req: Request, res: Response): Promise<undefined | UserData> => {
  const userData: UserData = await checkToken({ ...getTokenAndAuthFromReq(req), persistence: getPersistence(), encription: encriptionHelper });
  if (!userData.userId) {
    res.status(ResponseCode.UNAUTHORIZED).json({ error: 'unauthorized' });
    return;
  }
  return userData;
};
