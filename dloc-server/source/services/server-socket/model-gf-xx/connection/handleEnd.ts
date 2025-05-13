import { printMessage } from "../../../../functions/printMessage";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";

const handleEnd = (remoteAddress:string, imei:string) => {
  const imeiTemp = imei !== "" ? imei : "---------------";

  printMessage(`[${imeiTemp}] (${remoteAddress}) connection closed.`);

  if (imei !== "") {
    CACHE_IMEI.update(imei, {
      socketConn: undefined,
    });
  }
};

export default handleEnd;