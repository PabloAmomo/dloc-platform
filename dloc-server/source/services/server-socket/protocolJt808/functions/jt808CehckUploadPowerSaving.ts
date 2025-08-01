import { printMessage } from "../../../../functions/printMessage";
import { Jt808TerminalPowerSaveConfig } from "../models/Jt808TerminalPowerSaveConfig";
import { Jt808TerminalPowerSaveConfigPowerSaveMode } from "../models/Jt808TerminalPowerSaveConfigPowerSaveMode";

const jt808CehckUploadPowerSaving = (
  body: Buffer,
  imei: string,
  remoteAddress: string
): Jt808TerminalPowerSaveConfig => {
  if (body.length < 6) {
    printMessage(
      `[${imei}] (${remoteAddress}) ❌ Buffer is too short to parse power save config. -> body ${body.toString(
        "hex"
      )}`
    );
    return {
      powerSaveMode: "NormalMode",
      shortConnectPeriodicMin: 0,
      flightMode: false,
      connectTimeAfterTrackCarMode: 0,
    };
  }

  const powerSaveModeValue = body.readUInt8(0);
  let powerSaveMode: Jt808TerminalPowerSaveConfigPowerSaveMode = "NormalMode";
  switch (powerSaveModeValue) {
    case 1:
      powerSaveMode = "NormalMode";
      break;
    case 2:
      powerSaveMode = "PeriodicPositioningMode";
      break;
    case 3:
      powerSaveMode = "SmartPowerSavingMode";
      break;
    case 4:
      powerSaveMode = "SuperPowerSavingMode";
      break;
    default:
      printMessage(
        `[${imei}] (${remoteAddress}) ❌ Invalid power save mode value. -> ${powerSaveModeValue}`
      );
  }

  const shortConnectPeriodic = body.readUInt16BE(1);
  const flightMode = body.readUInt8(3) === 1;
  const connectTimeAfterTrackCarModeMin = body.readUInt16BE(4);

  return {
    powerSaveMode,
    shortConnectPeriodicMin: shortConnectPeriodic,
    flightMode,
    connectTimeAfterTrackCarMode: connectTimeAfterTrackCarModeMin,
  };
};

export default jt808CehckUploadPowerSaving;
