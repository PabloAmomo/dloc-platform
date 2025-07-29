export interface FacebookUserDataError {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}
