import convertPercentToRSSI from "../../../../functions/convertPercentToRSSI";
import { printMessage } from "../../../../functions/printMessage";
import scale255to100 from "../../../../functions/scale255To100";
import { CellTower } from "../../../../models/CellTower";

const protoTopinExtractWifiCellTowers = (prefix: string, data: Buffer): CellTower[] => {
  const responseData: CellTower[] = [];
  try {
    if (data.length < 1 || data.length < 1 + 4 + data[0] * 6) {
      printMessage(`${prefix} ❌ Invalid LBS data length ${data.length}`);
      return responseData;
    }

    const length = data[0];
    const mobileCountryCode = data[2].toString();
    const mobileNetworkCode = data[3].toString();
    let count = 0;
    let start = 4;
    while (count++ < length) {
      const locationAreaCode = data
        .slice(start, start + 4)
        .readUInt32BE(0)
        .toString();
      const cellId = data
        .slice(start + 4, start + 4 + 4)
        .readUInt32BE(0)
        .toString();
      const signalStrength = convertPercentToRSSI(scale255to100(data[start + 8]));

      if (!responseData.find((tower) => tower.cellId === cellId))
        responseData.push({
          locationAreaCode,
          cellId,
          mobileCountryCode,
          mobileNetworkCode,
          signalStrength,
        });

      start += 9;
    }
  } catch (err: Error | any) {
    printMessage(`${prefix} ❌ error extracting cell towers from wifi packet [${err.message}]`);
  }
  return responseData;
};

export default protoTopinExtractWifiCellTowers;
