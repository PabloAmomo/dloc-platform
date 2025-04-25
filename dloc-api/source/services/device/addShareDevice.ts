import { AddShareDeviceCodeResult } from '../../persistence/models/AddShareDeviceCodeResult';
import { AddShareDeviceResult } from '../../persistence/models/AddShareDeviceResult';
import { createErrorResponse } from '../../functions/createErrorResponse';
import { createOkResponse } from '../../functions/createOkResponse';
import { createSharedImei } from '../../functions/createSharedImei';
import { DeviceParams } from '../../persistence/entities/DeviceParams';
import { DeviceUser } from '../../persistence/entities/DeviceUser';
import { encriptionHelper } from '../../functions/encriptionHelper';
import { GetDeviceResult } from '../../persistence/models/GetDeviceResult';
import { Persistence } from '../../persistence/_Persistence';
import { Response } from '../../models/Response';
import { ResponseCode } from '../../enums/ResponseCode';
import { sendAddSharedDeviceEmail } from '../../functions/sendAddSharedDeviceEmail';
import * as crypto from 'crypto';

const addShareDevice = async (imei: string, userId: string, email: string, persistence: Persistence): Promise<Response> => {
  const errorRetVal = { added: false };

  const response: GetDeviceResult = await persistence.getDevice(imei, userId, encriptionHelper);
  const device: DeviceUser = response?.results?.[0] as DeviceUser;

  const message = response?.error?.message ?? '';
  if (!device || message === 'device not found') return createErrorResponse(ResponseCode.NOT_FOUND, message, errorRetVal);
  else if (message !== '') return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, message, errorRetVal);

  /** Is a shared device */
  if (device.isShared) return createErrorResponse(ResponseCode.BAD_REQUEST, 'device is shared device', errorRetVal);

  /** Create de imei to share encripted in MD5 */
  const sharedImeiId = createSharedImei(imei, email);
  const verificationCode = crypto.createHash('sha256').update(crypto.randomBytes(20).toString('hex')).digest('hex');
  const deviceParams: DeviceParams = JSON.parse(device.params);
  const { name, markerColor, pathColor, startTrack, endTrack } = deviceParams;

  /** Share device */
  const addShareDeviceResult: AddShareDeviceResult = await persistence.addShareDevice(
    imei,
    userId,
    sharedImeiId,
    { name, markerColor, pathColor, startTrack, endTrack, sharedWiths: [], hasImage: false },
    encriptionHelper
  );
  if (addShareDeviceResult.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, addShareDeviceResult.error.message, errorRetVal);
  if (!addShareDeviceResult.results) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, 'error sharing device', errorRetVal);

  /** Add verification code */
  const addShareDeviceCodeResult: AddShareDeviceCodeResult = await persistence.addShareDeviceCode(sharedImeiId, verificationCode);
  if (addShareDeviceCodeResult.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, addShareDeviceCodeResult.error.message, errorRetVal);
  if (!addShareDeviceCodeResult.results) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, 'error adding verification code', errorRetVal);

  /** Send email */
  await sendAddSharedDeviceEmail(email, sharedImeiId, deviceParams.name, verificationCode);

  /** Return results */
  return createOkResponse({ shared: true });
};

export { addShareDevice };
