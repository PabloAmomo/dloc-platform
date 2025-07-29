import protoTopinCreatePacket from "./protoTopinCreatePacket";
import protoTopinCreatePacket0x44 from "./protoTopinCreatePacket0x44";

function protoTopinCreateResponse0x13(intervalTimeMin: number, heartBeatIntervalSec: number): Buffer[] {
  const packetStopUpload = protoTopinCreatePacket0x44();

  const packetUploadInterval =
    intervalTimeMin !== 0 ? protoTopinCreatePacket(Buffer.from([0x02, 0x13, intervalTimeMin])) : Buffer.alloc(0);

  const heartBeatInterval =
    heartBeatIntervalSec !== 0
      ? protoTopinCreatePacket(Buffer.from([0x03, 0x13, 0x00, heartBeatIntervalSec]))
      : Buffer.alloc(0);

  return [packetStopUpload, packetUploadInterval, heartBeatInterval];
}

export default protoTopinCreateResponse0x13;
