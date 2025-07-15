import positionAddPositionAndUpdateDevice from '../../../../functions/positionAddPositionAndUpdateDevice';
import { Persistence } from '../../../../models/Persistence';
import { PositionPacket } from '../../../../models/PositionPacket';
import discardData from '../../functions/discardData';
import HandlePacketResult from '../../models/HandlePacketResult';
import { Jt808LocationPacket } from '../models/Jt808LocationPacket';
import jt808CreatePositionPacket from './jt808CreatePositionPacket';

const jt808PersistLocation = async (
  imei: string,
  remoteAddress: string,
  location: Jt808LocationPacket,
  persistence: Persistence,
  data: Buffer,
  response: HandlePacketResult
): Promise<void> => {
  const positionPacket: PositionPacket | undefined = jt808CreatePositionPacket(
    imei,
    remoteAddress,
    location,
    "{}"
  );
 
  if (!positionPacket) return;

  let oldPacket: boolean = false;
  const oldPacketMessage = "old packet";
  await positionAddPositionAndUpdateDevice(
    imei,
    remoteAddress,
    positionPacket,
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
      data.toString("hex"),
      response
    );
};

export default jt808PersistLocation;
