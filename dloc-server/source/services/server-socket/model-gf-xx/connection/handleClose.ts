import { printMessage } from '../../../../functions/printMessage';

const handleClose = (remoteAddress: string) => {
  if (!remoteAddress.includes('127.0.0.1')) printMessage(`(${remoteAddress}) connection closed.`);
};

export default handleClose;
