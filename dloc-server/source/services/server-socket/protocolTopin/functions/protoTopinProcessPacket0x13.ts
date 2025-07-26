import positionUpdateBatteryAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import { printMessage } from "../../../../functions/printMessage";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopinCreateResponse0x13 from "./protoTopinCreateResponse0x13";
import protoTopinCreateResponse0x30 from "./protoTopinCreateResponse0x30";

const protoTopinProcessPacket0x13: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} 🎛️ status package received. Sending interval time.`);

  const battery = topinPacket.informationContent[0];
  const softwareVersion = topinPacket.informationContent[1];
  const timezone = topinPacket.informationContent[2];
  const intervalTimeMin = topinPacket.informationContent[3];

  // TODO: Send interval time based on power profile configuration
  (response.response as Buffer[]).push(protoTopinCreateResponse0x13(topinPacket, intervalTimeMin));

  printMessage(`${prefix} 🌎 Current time zone ${timezone}`);
  printMessage(`${prefix} 🔋 Battery level: ${battery}%`);

  await positionUpdateBatteryAndLastActivity(response.imei, remoteAddress, persistence, battery);

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x13;
