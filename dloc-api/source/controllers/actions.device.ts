import { addDevice } from '../services/device/addDevice';
import { checkToken } from '../functions/checkToken';
import { deleteDevice } from '../services/device/deleteDevice';
import { DeviceParams } from '../persistence/entities/DeviceParams';
import { DeviceParamsMappers } from '../mappers/DeviceParamsMappers';
import { encriptionHelper } from '../functions/encriptionHelper';
import { getPersistence } from '../persistence/persistence';
import { getTokenAndAuthFromReq } from '../functions/getTokenAndAuthFromReq';
import { Request, Response } from 'express';
import { ResponseCode } from '../enums/ResponseCode';
import { updateDeviceParams } from '../services/device/updateDeviceParams';
import { UserData } from '../models/UserData';

export enum DeviceActionsType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

const deviceActions : DeviceActionsProps = async (type, req, res) => {
  const imei: string = req.params?.id;
  let params: DeviceParams;

  try {
    params = DeviceParamsMappers.fromReqBodyParams(req.body?.params, DeviceParamsMappers.getDefaultValue());
  } catch (error: any) {
    console.error(error.message);
    res.status(ResponseCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
    return;
  }
  
  /** validate user */
  const userData: UserData = await checkToken({ ...getTokenAndAuthFromReq(req), persistence: getPersistence(), encription: encriptionHelper });
  if (!userData.userId) {
    res.status(ResponseCode.UNAUTHORIZED).json({ error: 'unauthorized' });
    return;
  }

  /** validate imei and params */
  if (type !== 'DELETE' && (!params.name || !params.markerColor || !params.pathColor || !params.startTrack || !params.endTrack)) {
    res.status(ResponseCode.BAD_REQUEST).json({ error: 'name, markerColor, pathColor, startTrack and endTrack are required' });
    return;
  }

  /** validate imei */
  if (!imei) res.status(ResponseCode.BAD_REQUEST).json({ error: 'imei is required' });
  /** execute query */ else {
    if (type === DeviceActionsType.ADD) {
      addDevice(imei, userData, req.body?.verificationCode ?? '', params, getPersistence()).then((response) =>
        res.status(response.code).json(response.result)
      );
    } else if (type === DeviceActionsType.UPDATE) {
-      updateDeviceParams(imei, userData.userId, params, getPersistence()).then((response) => res.status(response.code).json(response.result));
    } else if (type === DeviceActionsType.DELETE) {
      deleteDevice(imei, userData.userId, getPersistence()).then((response) => res.status(response.code).json(response.result));
    }
  }
};

export { deviceActions };

interface DeviceActionsProps {
  (type: DeviceActionsType, req: Request, res: Response): void;
}