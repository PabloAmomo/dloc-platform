import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x13(intervalTimeMin: number, heartBeatIntervalSec: number): Buffer[] {
  const packetUploadInterval =
    intervalTimeMin !== 0 ? protoTopinCreatePacket(Buffer.from([0x02, 0x13, intervalTimeMin])) : Buffer.alloc(0);

  const heartBeatInterval =
    heartBeatIntervalSec !== 0
      ? protoTopinCreatePacket(Buffer.from([0x03, 0x13, 0x00, heartBeatIntervalSec]))
      : Buffer.alloc(0);

  return [packetUploadInterval, heartBeatInterval];
}

export default protoTopinCreateResponse0x13;
