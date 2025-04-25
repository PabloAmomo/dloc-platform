import { Response } from "../models/Response";

const createOkResponse = (data: any): Response => {
  return { code: 200, result: { data, message: 'ok' } };
};

export { createOkResponse };