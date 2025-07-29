import toCustomTwoBytes from "../../../../functions/toCustomTwoBytes";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x57(intervalSec: number, lights: boolean): Buffer {
  const intervalSecBDC2Bytes = toCustomTwoBytes(intervalSec); // Ensure it's a single byte

  return protoTopinCreatePacket(Buffer.from([0x04, 0x57, intervalSecBDC2Bytes[0], intervalSecBDC2Bytes[1], lights ? 0x01 : 0x00])); 
}

export default protoTopinCreateResponse0x57;
