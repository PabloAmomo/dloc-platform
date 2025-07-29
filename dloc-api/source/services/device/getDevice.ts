import { createErrorResponse } from '../../functions/createErrorResponse';
import { createOkResponse } from '../../functions/createOkResponse';
import { encriptionHelper } from '../../functions/encriptionHelper';
import { GetDeviceResult } from '../../persistence/models/GetDeviceResult';
import { Persistence } from '../../persistence/_Persistence';
import { Response } from '../../models/Response';
import { ResponseCode } from '../../enums/ResponseCode';

const getDevice = async (imei: string, userId:string, persistence: Persistence): Promise<Response> => {
  const response: GetDeviceResult = await persistence.getDevice(imei, userId, encriptionHelper);

  if (response.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, response.error.message, {});
  
  return createOkResponse(response?.results?.[0] ?? {});
};

export { getDevice };
