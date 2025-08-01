import positionUpdateBatteryAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import { printMessage } from "../../../../functions/printMessage";
import { Persistence } from "../../../../models/Persistence";
import { Jt808Packet } from "../models/Jt808Packet";
import jt808ParseParamentersSettings from "./jt808ParseParamentersSettings";

const jt808CheckTerminalParametersResponse = async (
  imei: string,
  remoteAddress: string,
  persistence: Persistence,
  jt808Packet: Jt808Packet
): Promise<void> => {
  const parametersSettings = jt808ParseParamentersSettings(imei, remoteAddress, jt808Packet.body);

  const battery = parseInt((parametersSettings.paramatersSettings.batteryLevel?.value as string) ?? "-1");
  await positionUpdateBatteryAndLastActivity(imei, remoteAddress, persistence, battery);
  if (battery === -1) printMessage(`[${imei}] (${remoteAddress}) 🔋 Battery level ❌ Not available`);
  else printMessage(`[${imei}] (${remoteAddress}) 🔋 Battery level ✅ ${battery}% (Updated on device)`);
};

export default jt808CheckTerminalParametersResponse;
