import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x13(statusPackageIntervalMin: number, uploadIntervalSec: number): Buffer[] {
  const packets = [];

  if (statusPackageIntervalMin !== 0) packets.push(protoTopinCreatePacket(Buffer.from([0x02, 0x13, statusPackageIntervalMin])));

  if (uploadIntervalSec !== 0) packets.push(protoTopinCreatePacket(Buffer.from([0x03, 0x13, 0x00, uploadIntervalSec])));

  return packets;
}

export default protoTopinCreateResponse0x13;
