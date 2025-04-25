export interface ResponseResult {
  message: string;
  data: object | [];
}

export interface Response {
  code: number;
  result: ResponseResult;
}