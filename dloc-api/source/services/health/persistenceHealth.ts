import { createErrorResponse } from '../../functions/createErrorResponse';
import { createOkResponse } from '../../functions/createOkResponse';
import { Persistence } from '../../persistence/_Persistence';
import { PersistenceResult } from "../../persistence/models/PersistenceResult";
import { Response } from "../../models/Response";
import { ResponseCode } from '../../enums/ResponseCode';

const persistenceHealth = async (persistence: Persistence) : Promise<Response> => { 
  const response: PersistenceResult = await persistence.health();

  if (response.error) return createErrorResponse(ResponseCode.INTERNAL_SERVER_ERROR, response.error.message, []);
    
  return createOkResponse(response.results[0]);
};

export { persistenceHealth };
