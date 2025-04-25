import { AddDeviceResult } from '../../persistence/models/AddDeviceResult';
import { createErrorResponse } from '../../functions/createErrorResponse';
import { createOkResponse } from '../../functions/createOkResponse';
import { createSharedImei } from '../../functions/createSharedImei';
import { deleteShareDeviceCode } from '../../persistence/mySql/deleteShareDeviceCode';
import { DeleteShareDeviceCodeResult } from '../../persistence/models/DeleteShareDeviceCodeResult';
import { DeviceOwnerStates } from '../../enums/DeviceOwnerStates';
import { DeviceParams } from '../../persistence/entities/DeviceParams';
import { encriptionHelper } from '../../functions/encriptionHelper';
import { getDeviceOwnerState } from '../../persistence/mySql/getDeviceOwnerState';
import { GetDeviceOwnerStateResult } from '../../persistence/models/GetDeviceWonerStateResult';
import { Persistence } from '../../persistence/_Persistence';
import { Response } from '../../models/Response';
import { ResponseCode } from '../../enums/ResponseCode';
import { UserData } from '../../models/UserData';

const addDevice = async (imei: string, userData: UserData, verificationCode: string, deviceParams: DeviceParams, persistence: Persistence): Promise<Response> => {
  const errorRetVal = { added: false };

  /** Check if device is available */
  const getDeviceOwnerStateResult: GetDeviceOwnerStateResult = await getDeviceOwnerState(imei);

  /** Check errors */
  if (getDeviceOwnerStateResult.state === DeviceOwnerStates.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, 'error consulting availability', errorRetVal);
  else if (getDeviceOwnerStateResult.state === DeviceOwnerStates.assigned) return createErrorResponse(ResponseCode.BAD_REQUEST, 'device already assigned', errorRetVal);
  else if (getDeviceOwnerStateResult.state === DeviceOwnerStates.notfound) return createErrorResponse(ResponseCode.NOT_FOUND, 'error consulting availability', errorRetVal);
  else if (getDeviceOwnerStateResult.isCloned && getDeviceOwnerStateResult.verificationCode !== verificationCode)
    return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, 'invalid verification code', errorRetVal);

  /** Check for cloned device if the imei is correcto for the user email */
  if (getDeviceOwnerStateResult.isCloned) {
    const sharedImei = createSharedImei(getDeviceOwnerStateResult.clonedImei , userData.email);
    if (sharedImei !== imei) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, 'invalid imei', errorRetVal);
  }

  /** Delete shared code if device is a cloned device */
  if (getDeviceOwnerStateResult.isCloned) {
    const deleteShareDeviceCodeResult: DeleteShareDeviceCodeResult = await deleteShareDeviceCode(imei);
    if (deleteShareDeviceCodeResult.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, deleteShareDeviceCodeResult.error.message, errorRetVal);
  }

  /** Add the device */
  const response: AddDeviceResult = await persistence.addDevice(imei, userData.userId, deviceParams, encriptionHelper);
  if (response?.error?.message) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, response.error.message, errorRetVal);

  /** All Ok */
  return createOkResponse({ added: true });
};

export { addDevice };
