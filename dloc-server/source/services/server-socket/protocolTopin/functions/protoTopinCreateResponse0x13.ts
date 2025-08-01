import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x13(statusPackageIntervalSec: number, uploadIntervalSec: number): Buffer[] {
  const packets = [];

  if (statusPackageIntervalSec !== 0)
    packets.push(protoTopinCreatePacket(Buffer.from([0x02, 0x13, statusPackageIntervalSec])));

  if (uploadIntervalSec !== 0) packets.push(protoTopinCreatePacket(Buffer.from([0x03, 0x13, 0x00, uploadIntervalSec])));

  return packets;
}

export default protoTopinCreateResponse0x13;
