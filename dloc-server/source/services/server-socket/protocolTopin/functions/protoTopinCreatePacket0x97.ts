import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreatePacket0x97(intervalSec: number): Buffer {
  const bytesValue = Buffer.from(createHexFromNumberWithNBytes(intervalSec, 2), "hex");
  return protoTopinCreatePacket(Buffer.from([0x03, 0x97, ...bytesValue])); 
}

export default protoTopinCreatePacket0x97;
