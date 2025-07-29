import { addShareDevice } from '../services/device/addShareDevice';
import { checkToken } from '../functions/checkToken';
import { deleteShareDevice } from '../services/device/deleteShareDevice';
import { encriptionHelper } from '../functions/encriptionHelper';
import { getPersistence } from '../persistence/persistence';
import { getTokenAndAuthFromReq } from '../functions/getTokenAndAuthFromReq';
import { Request, Response } from 'express';
import { ResponseCode } from '../enums/ResponseCode';
import { UserData } from '../models/UserData';

export enum DeviceSharedActionsType {
  ADD = 'ADD',
  DELETE = 'DELETE',
}

const deviceSharedActions: DeviceSharedActionsProps = async (type, req, res) => {
  const imei: string = req.params?.id;
  const email: string = req.body?.email ?? '';

  /** validate user */
  const userData: UserData = await checkToken({ ...getTokenAndAuthFromReq(req), persistence: getPersistence(), encription: encriptionHelper });
  if (!userData.userId) {
    res.status(ResponseCode.UNAUTHORIZED).json({ error: 'unauthorized' });
    return;
  }

  /** validate imei and email */
  if (!imei || imei === '' || !email || email === '') {
    res.status(ResponseCode.BAD_REQUEST).json({ error: 'imei and email is required' });
    return;
  }

  /** execute */
  if (type === 'ADD') {
    addShareDevice(imei, userData.userId, email, getPersistence()).then((response) => res.status(response.code).json(response.result));
  } else if (type === 'DELETE') {
    deleteShareDevice(imei, userData.userId, email, getPersistence()).then((response) => res.status(response.code).json(response.result));
  }
};

export { deviceSharedActions };

interface DeviceSharedActionsProps {
  (type: DeviceSharedActionsType, req: Request, res: Response): void;
}
