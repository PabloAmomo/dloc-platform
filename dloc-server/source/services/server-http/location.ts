import positionAddPositionAndUpdateDevice from "../../functions/positionAddPositionAndUpdateDevice";
import positionUpdateBattertAndLastActivity from "../../functions/positionUpdateBatteryAndLastActivity";
import positionUpdateLastActivityAndAddHistory from "../../functions/positionUpdateLastActivityAndAddHistory";
import { Persistence } from "../../models/Persistence";
import { PositionPacket } from "../../models/PositionPacket";

const location = async (
  persistence: Persistence,
  positionPacket: PositionPacket
) => {
  const { imei, remoteAddress } = positionPacket;
  var message: string = "ok";
  var noHasLocation: boolean =
    positionPacket.lat === -999 || positionPacket.lng === -999;

  if (noHasLocation) {
    message = await positionUpdateBattertAndLastActivity(
      imei,
      remoteAddress,
      persistence,
      positionPacket.batteryLevel,
    );

    return { code: message === "ok" ? 200 : 500, result: { message } };
  }

  message = await positionAddPositionAndUpdateDevice(
    imei,
    remoteAddress,
    positionPacket,
    persistence
  );

  if (message === "ok")
    message = await positionUpdateLastActivityAndAddHistory(
      imei,
      remoteAddress,
      JSON.stringify(positionPacket),
      persistence,
      true
    );

  /** */
  return { code: message === "ok" ? 200 : 500, result: { message } };
};

export { location };
