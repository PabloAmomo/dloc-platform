import locationAddPositionAndUpdateDevice from "../../functions/locationAddPositionAndUpdateDevice";
import locationUpdateBattertAndLastActivity from "../../functions/locationUpdateBatteryAndLastActivity";
import locationUpdateLastActivityAndAddHistory from "../../functions/locationUpdateLastActivityAndAddHistory";
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
    message = await locationUpdateBattertAndLastActivity(
      imei,
      remoteAddress,
      persistence,
      positionPacket.batteryLevel,
    );

    return { code: message === "ok" ? 200 : 500, result: { message } };
  }

  message = await locationAddPositionAndUpdateDevice(
    imei,
    remoteAddress,
    positionPacket,
    persistence
  );

  if (message === "ok")
    message = await locationUpdateLastActivityAndAddHistory(
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
