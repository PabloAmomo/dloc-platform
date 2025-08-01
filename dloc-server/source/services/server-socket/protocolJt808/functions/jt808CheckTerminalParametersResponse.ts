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
  const parametersSettings = jt808ParseParamentersSettings(
    imei,
    remoteAddress,
    jt808Packet.body
  );

  if (parametersSettings.paramatersSettings.batteryLevel) {
    await positionUpdateBatteryAndLastActivity(
      imei,
      remoteAddress,
      persistence,
      parametersSettings.paramatersSettings.batteryLevel.value as number
    );
    printMessage(
      `[${imei}] (${remoteAddress}) 🔋 Battery level ✅ ${parametersSettings.paramatersSettings.batteryLevel.value}% (Updated on device)`
    );
  }
};

export default jt808CheckTerminalParametersResponse;
