import { Response } from "../models/Response";
import { ResponseCode } from "../enums/ResponseCode";

const createErrorResponse = (code: ResponseCode, message: string, data: any): Response => {
  return { code, result: { data, message } };
};

export { createErrorResponse };