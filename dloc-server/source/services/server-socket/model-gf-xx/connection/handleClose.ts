import { printMessage } from "../../../../functions/printMessage";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";

const handleClose = (remoteAddress: string, imei: string) => {
  const imeiTemp = imei !== "" ? imei : "---------------";

  if (!remoteAddress.includes("127.0.0.1"))
    printMessage(`[${imeiTemp}] (${remoteAddress}) connection closed.`);

  if (imei !== "") {
    CACHE_IMEI.update(imei, {
      socketConn: undefined,
    });
  }
};

export default handleClose;
