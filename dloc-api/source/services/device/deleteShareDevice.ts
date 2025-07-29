import { createErrorResponse } from '../../functions/createErrorResponse';
import { createOkResponse } from '../../functions/createOkResponse';
import { createSharedImei } from '../../functions/createSharedImei';
import { DeleteShareDeviceCodeResult } from '../../persistence/models/DeleteShareDeviceCodeResult';
import { DeviceOwnerStates } from '../../enums/DeviceOwnerStates';
import { DeviceParams } from '../../persistence/entities/DeviceParams';
import { DeviceUser } from '../../persistence/entities/DeviceUser';
import { encriptionHelper } from '../../functions/encriptionHelper';
import { getDeviceOwnerState } from '../../persistence/mySql/getDeviceOwnerState';
import { GetDeviceOwnerStateResult } from '../../persistence/models/GetDeviceWonerStateResult';
import { GetDeviceResult } from '../../persistence/models/GetDeviceResult';
import { Persistence } from '../../persistence/_Persistence';
import { Response } from '../../models/Response';
import { ResponseCode } from '../../enums/ResponseCode';
import { sendDeleteSharedDeviceEmail } from '../../functions/sendDeleteSharedDeviceEmail';

const deleteShareDevice = async (imei: string, userId: string, email: string, persistence: Persistence): Promise<Response> => {
  const errorRetVal = { deleted: false };

  /** Get the device */
  const responseDevice: GetDeviceResult = await persistence.getDevice(imei, userId, encriptionHelper);
  const device: DeviceUser = responseDevice?.results?.[0] as DeviceUser;
  const message = responseDevice?.error?.message ?? '';
  if (!device || message === 'device not found') return createErrorResponse(ResponseCode.NOT_FOUND, 'device not found', errorRetVal);
  else if (message !== '') return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, message, errorRetVal);

  /** Create de imei to share encripted in MD5 */
  const sharedImeiId = createSharedImei(imei, email);
  const deviceParams: DeviceParams = JSON.parse(device.params);
  const name = deviceParams.name;

  /** Get device State */
  const getDeviceOwnerStateResult: GetDeviceOwnerStateResult = await getDeviceOwnerState(imei);

  /** Check errors */
  if (getDeviceOwnerStateResult.state === DeviceOwnerStates.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, 'error consulting availability', errorRetVal);
  if (getDeviceOwnerStateResult.state === DeviceOwnerStates.notfound) return createErrorResponse(ResponseCode.NOT_FOUND, 'device not found', errorRetVal);
  if (getDeviceOwnerStateResult.userAssigned !== userId) return createErrorResponse(ResponseCode.UNAUTHORIZED, 'user not authorized to delete this device', errorRetVal);

  /** Delete */
  const deleteShareDeviceResult = await persistence.deleteShareDevice(imei, sharedImeiId);

  /** Remove verification code */
  const deleteShareDeviceCodeResult: DeleteShareDeviceCodeResult = await persistence.deleteShareDeviceCode(sharedImeiId);

  /** Check errors */
  if (deleteShareDeviceResult.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, deleteShareDeviceResult.error.message, errorRetVal);
  if (!deleteShareDeviceResult.results) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, 'error deleting shared device', errorRetVal);

  if (deleteShareDeviceCodeResult.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, deleteShareDeviceCodeResult.error.message, errorRetVal);
  if (!deleteShareDeviceCodeResult.results) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, 'error deleting shared device code', errorRetVal);

  /** Send email */
  await sendDeleteSharedDeviceEmail(email, name);

  /** Return results */
  return createOkResponse({ deleted: true });
};

export { deleteShareDevice };
