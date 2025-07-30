import checkMustSendToTerminalRequestReport from "../../../../functions/checkMustSendToTerminalRequestReport";
import { printMessage } from "../../../../functions/printMessage";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";
import protoTopinCheckMustSendToTerminal from "../functions/protoTopinCheckMustSendToTerminal";
import protoTopinCreatePacket0x33 from "../functions/protoTopinCreatePacket0x33";
import protoTopinCreatePacket0x80 from "../functions/protoTopinCreatePacket0x80";
import protoTopinGetPowerProfileConfig from "../functions/protoTopinGetPowerProfileConfig";
import ProtoTopinHandleProcess from "../models/ProtoTopinHandleProcess";
import ProtoTopinProcessProps from "../models/ProtoTopinProcessProps";

const protoTopinHandleProcess: ProtoTopinHandleProcess = ({
  results,
  imei,
  prefix,
  isNewConnection,
  powerProfileChanged,
  needProfileRefresh,
  imeiData,
  newPowerProfileType,
  sendData,
}: ProtoTopinProcessProps): void => {
  const additionals: Buffer[] = [];
  let hasReportPosition: boolean = false;

  /* Enable LBS positioning */
  if (isNewConnection) additionals.push(protoTopinCreatePacket0x33(false));

  /** Create configuration packet */
  if (powerProfileChanged || needProfileRefresh) {
    additionals.push(
      ...protoTopinCheckMustSendToTerminal(
        imei,
        prefix,
        powerProfileChanged,
        needProfileRefresh,
        imeiData.powerProfile,
        newPowerProfileType
      )
    );

    /** Add request position packet */
    printMessage(`${prefix} 🚀 send packet to request report position. (🔋 By power profile)`);
    additionals.push(protoTopinCreatePacket0x80());
    imeiData.lastReportRequestTimestamp = Date.now();
    // TODO: CHECK THIS
    CACHE_IMEI.updateOrCreate(imei, { lastReportRequestTimestamp: imeiData.lastReportRequestTimestamp });
    hasReportPosition = true;
  }

  /** Check if must send to terminal request report */
  if (!hasReportPosition) {
    const { forceReportLocInSec } = protoTopinGetPowerProfileConfig(newPowerProfileType);
    if (checkMustSendToTerminalRequestReport(prefix, imei, imeiData, forceReportLocInSec)) {
      printMessage(`${prefix} 🚀 send packet to request report position. (⏰ By time out request)`);
      additionals.push(protoTopinCreatePacket0x80());
    }
  }

  /** Join al to send */
  const toSend: Buffer[] = results.flatMap(result => result.response as Buffer[]);
  toSend.push(...additionals);

  sendData(toSend);
};

export default protoTopinHandleProcess;
