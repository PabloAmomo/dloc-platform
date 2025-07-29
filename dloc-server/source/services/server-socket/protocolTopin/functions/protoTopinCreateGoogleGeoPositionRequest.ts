import { CellTower } from "./../../../../models/CellTower";
import { printMessage } from "../../../../functions/printMessage";
import { GoogleGeoPositionRequest } from "../../../../models/GoogleGeoPositionRequest";
import { WifiAccessPoint } from "../../../../models/WifiAccessPoint";
import protoTopinExtractWifiAps from "./protoTopinExtractWifiAps";
import protoTopinExtractWifiCellTowers from "./protoTopinExtractWifiCellTowers";

const protoTopinCreateGoogleGeoPositionRequest = (
  prefix: string,
  informationContent: Buffer,
  packetLength: number
): GoogleGeoPositionRequest | null => {
  const wifiAccessPoints: WifiAccessPoint[] = [];
  const cellTowers: CellTower[] = [];

  if (informationContent.length >= 6 + packetLength * 7) {
    const wifiApsData = informationContent.slice(0, 6 + packetLength * 7);
    wifiAccessPoints.push(...protoTopinExtractWifiAps(prefix, packetLength, wifiApsData));
    printMessage(`${prefix} 📡 wifi access points founds ${wifiAccessPoints.length}`);
  }

  if (informationContent.length >= 6 + wifiAccessPoints.length * 7) {
    const lbsData = informationContent.slice(6 + wifiAccessPoints.length * 7);
    cellTowers.push(...protoTopinExtractWifiCellTowers(prefix, lbsData));
    printMessage(`${prefix} 🗼 cell towers founds ${cellTowers.length}`);
  }

  if (cellTowers.length === 0) {
    printMessage(`${prefix} ❌ no cell towers found`);
    return null;
  }

  return {
    homeMobileCountryCode: cellTowers[0].mobileCountryCode,
    homeMobileNetworkCode: cellTowers[0].mobileNetworkCode,
    cellTowers,
    wifiAccessPoints,
  };
};

export default protoTopinCreateGoogleGeoPositionRequest;
