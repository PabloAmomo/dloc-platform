import padNumberLeft from "../../../../functions/padNumberLeft";

const jt808GetBatteryLevelPacketDateTime = (body: Buffer): string => {
  const year = 2000 + body.readUInt8(1); // asume "25" significa 2025
  const month = padNumberLeft(body.readUInt8(2), 2);
  const day = padNumberLeft(body.readUInt8(3), 2);
  const hour = padNumberLeft(body.readUInt8(4), 2);
  const minute = padNumberLeft(body.readUInt8(5), 2);
  const second = padNumberLeft(body.readUInt8(6), 2);

  const date = `${year}-${month}-${day}`;
  const time = `${hour}:${minute}:${second}`;

  return `${date} ${time}`;
};

export default jt808GetBatteryLevelPacketDateTime;
