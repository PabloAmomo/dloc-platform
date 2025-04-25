import { createErrorResponse } from '../../functions/createErrorResponse';
import { createOkResponse } from '../../functions/createOkResponse';
import { encriptionHelper } from '../../functions/encriptionHelper';
import { GetDevicesResult } from "../../persistence/models/GetDevicesResult";
import { Persistence } from '../../persistence/_Persistence';
import { Response } from "../../models/Response";
import { ResponseCode } from '../../enums/ResponseCode';

const getDevices = async (interval: number, userId: string, persistence: Persistence) : Promise<Response> => { 
  const response: GetDevicesResult = await persistence.getDevices(userId, interval, encriptionHelper);

  if (response.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, response.error.message, []);
  
  return createOkResponse(response.results);
};

export { getDevices };
