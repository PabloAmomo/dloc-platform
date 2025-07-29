import { ResponseCode } from "../enums/ResponseCode";

export interface ResponseResult {
  message: string;
  data: object | [];
}

export interface Response {
  code: ResponseCode;
  result: ResponseResult;
}
