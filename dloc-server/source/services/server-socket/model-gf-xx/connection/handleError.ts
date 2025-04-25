import { printMessage } from "../../../../functions/printMessage";

const handleError = (remoteAddress:string, err: Error) => {
  printMessage(`(${remoteAddress}) connection error: [${err.message}]`);
};

export default handleError;