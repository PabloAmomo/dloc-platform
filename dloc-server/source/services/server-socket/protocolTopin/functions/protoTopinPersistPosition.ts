import positionAddPositionAndUpdateDevice from "../../../../functions/positionAddPositionAndUpdateDevice";
import { printMessage } from "../../../../functions/printMessage";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
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
    const { lat, lng, dateTimeUtc, valid, accuracy } = position;
    let extraMessage = `[${dateTimeUtc?.toISOString() ?? "NO DATE"}] Lat ${lat} - Lng ${lng}`;
    printMessage(
      `${prefix} 📍 ${valid ? "✅" : "❌"} Location received: [${valid ? "valid" : "invalid"}] ${extraMessage}`
    );

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

    /** When get a gps position, remove lbs key to avoid use it in lbs request not sync */
    if (!oldPacket && accuracy !== GpsAccuracy.lbs) {
      CACHE_IMEI.updateOrCreate(imei, {
        lastLBSKey: "",
      });
    }

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
