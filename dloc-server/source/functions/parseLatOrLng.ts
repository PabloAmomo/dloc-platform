import { Direction } from "../models/Direction";
import { convertDegressToDecimal } from "./convertDegressToDecimal";
import { formatLatLng } from "./formatLanLng";

const parseLatOrLng = (latOrLngRaw: string, direction: Direction): number | null => {
  if (latOrLngRaw == '' || !direction) return null;
  let valData = formatLatLng(latOrLngRaw);
  return convertDegressToDecimal(valData[0], valData[1], 0, direction);
}

export { parseLatOrLng }