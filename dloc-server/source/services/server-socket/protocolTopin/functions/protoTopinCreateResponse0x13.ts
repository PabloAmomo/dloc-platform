import protoTopinCreatePacket from "./protoTopinCreatePacket";
import protoTopinCreatePacket0x44 from "./protoTopinCreatePacket0x44";
import protoTopinCreatePacket0x97 from "./protoTopinCreatePacket0x97";

function protoTopinCreateResponse0x13(heartBeatIntervalMin: number, uploadIntervalSec: number): Buffer[] {
  const packetStopUpload = protoTopinCreatePacket0x44();

  const packetHeartBeatIntervalMin =
    heartBeatIntervalMin !== 0
      ? protoTopinCreatePacket(Buffer.from([0x02, 0x13, heartBeatIntervalMin]))
      : Buffer.alloc(0);

  //const packetUploadIntervalSec =
  //  uploadIntervalSec !== 0
  //    ? protoTopinCreatePacket(Buffer.from([0x03, 0x13, 0x00, uploadIntervalSec]))
  //    : Buffer.alloc(0);

  const packetUploadIntervalSec = protoTopinCreatePacket0x97(uploadIntervalSec);

  return [packetStopUpload, packetHeartBeatIntervalMin, packetUploadIntervalSec];
}

export default protoTopinCreateResponse0x13;
