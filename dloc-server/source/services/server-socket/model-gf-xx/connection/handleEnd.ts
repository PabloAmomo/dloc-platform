import { printMessage } from "../../../../functions/printMessage";

const handleEnd = (remoteAddress:string) => {
  printMessage(`(${remoteAddress}) connection closed.`);
};

export default handleEnd;