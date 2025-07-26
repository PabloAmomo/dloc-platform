import positionAddPositionAndUpdateDevice from "../../../../functions/positionAddPositionAndUpdateDevice";
import { printMessage } from "../../../../functions/printMessage";
import { Persistence } from "../../../../models/Persistence";
import { PositionPacket } from "../../../../models/PositionPacket";
import discardData from "../../functions/discardData";
import HandlePacketResult from "../../models/HandlePacketResult";
import { ProtoTopinPacket } from "../models/ProtoTopinPacket";

const protoTopinPersistPosition = async (
  imei: string,
  remoteAddress: string,
  position: PositionPacket,
  persistence: Persistence,
  topinPacket: ProtoTopinPacket,
  response: HandlePacketResult,
  prefix: string
) => {
  try {
    let extraMessage = `[${position.dateTimeUtc?.toISOString() ?? "NO DATE"}] Lat ${position.lat} - Lng ${
      position.lng
    } [${position.valid ? "✅" : "❌"}]`;
    printMessage(`${prefix} 📍 Location received: ${extraMessage}`);

    let oldPacket: boolean = false;
    const oldPacketMessage = "old packet";
    await positionAddPositionAndUpdateDevice(
      imei,
      remoteAddress,
      position,
      persistence,
      () => {},
      (error) => {
        oldPacket = error?.message === "old packet";
      }
    );

    if (oldPacket)
      await discardData(
        oldPacketMessage,
        true,
        persistence,
        imei,
        remoteAddress,
        topinPacket.informationContent.toString("hex"),
        response
      );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    printMessage(`${prefix} ❌ Error persisting position: ${errorMessage}`);
  }
};

export default protoTopinPersistPosition;
