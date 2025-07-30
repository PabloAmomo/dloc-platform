import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x13(heartBeatIntervalMin: number, uploadIntervalSec: number): Buffer[] {

  const packetHeartBeatIntervalMin =
    heartBeatIntervalMin !== 0
      ? protoTopinCreatePacket(Buffer.from([0x02, 0x13, heartBeatIntervalMin]))
      : Buffer.alloc(0);

  const packetUploadIntervalSec =
    uploadIntervalSec !== 0
      ? protoTopinCreatePacket(Buffer.from([0x03, 0x13, 0x00, uploadIntervalSec]))
      : Buffer.alloc(0);
  
  return [packetHeartBeatIntervalMin, packetUploadIntervalSec];
}

export default protoTopinCreateResponse0x13;
