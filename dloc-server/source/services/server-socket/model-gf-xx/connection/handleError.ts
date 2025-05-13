import { printMessage } from "../../../../functions/printMessage";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";

const handleError = (remoteAddress: string, imei: string, err: Error) => {
  const imeiTemp = imei !== "" ? imei : "---------------";
  
  printMessage(`[${imeiTemp}] (${remoteAddress}) connection error: [${err.message}]`);

  if (imei !== "") {
    CACHE_IMEI.update(imei, {
      socketConn: undefined,
    });
  }
};

export default handleError;
