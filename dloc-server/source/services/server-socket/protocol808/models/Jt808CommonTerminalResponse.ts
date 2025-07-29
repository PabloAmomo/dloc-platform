export type Jt808CommonTerminalResponse = {
  responseToMsgSerialNumber: number;
  msgSerialNumber: number;
  result: "success" | "failure" | "incorrect" | "not_supported" | "unknown";
};
