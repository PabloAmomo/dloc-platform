import { createErrorResponse } from '../../functions/createErrorResponse';
import { createOkResponse } from '../../functions/createOkResponse';
import { DeleteDeviceResult } from '../../persistence/models/DeleteDeviceResult';
import { DeviceOwnerStates } from '../../enums/DeviceOwnerStates';
import { getDeviceOwnerState } from '../../persistence/mySql/getDeviceOwnerState';
import { GetDeviceOwnerStateResult } from '../../persistence/models/GetDeviceWonerStateResult';
import { Persistence } from '../../persistence/_Persistence';
import { Response } from '../../models/Response';
import { ResponseCode } from '../../enums/ResponseCode';

const deleteDevice = async (imei: string, userId: string, persistence: Persistence): Promise<Response> => {
  const errorRetVal = { deleted: false };
  const okRetVal = { deleted: true };

  /** Get the device state */
  const getDeviceOwnerStateResult: GetDeviceOwnerStateResult = await getDeviceOwnerState(imei);

  /** Check errors */
  if (getDeviceOwnerStateResult.state === DeviceOwnerStates.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, 'error consulting availability', errorRetVal);
  else if (getDeviceOwnerStateResult.state === DeviceOwnerStates.notfound) return createErrorResponse( ResponseCode.NOT_FOUND , 'device not found', errorRetVal);
  else if (getDeviceOwnerStateResult.userAssigned !== userId) return createErrorResponse(ResponseCode.UNAUTHORIZED, 'device not assigned to the user', errorRetVal);

  /** Already deleted */
  if (getDeviceOwnerStateResult.state !== DeviceOwnerStates.assigned) return createOkResponse(okRetVal);

  /** Delete the device */
  const response: DeleteDeviceResult = await persistence.deleteDevice(imei, userId);
  if (response?.error?.message) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, response.error.message, errorRetVal);

  /** All Ok */
  return createOkResponse(okRetVal);
};

export { deleteDevice };
