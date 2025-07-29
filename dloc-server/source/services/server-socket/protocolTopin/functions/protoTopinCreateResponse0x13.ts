import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x13(intervalTimeMin: number, heartBeatIntervalSec: number): Buffer[] {
  const packetUploadInterval = protoTopinCreatePacket(Buffer.from([0x02, 0x13, intervalTimeMin]));

  const heartBeatInterval = protoTopinCreatePacket(Buffer.from([0x03, 0x13, 0x00, heartBeatIntervalSec]));

  return [packetUploadInterval, heartBeatInterval];
}

export default protoTopinCreateResponse0x13;
