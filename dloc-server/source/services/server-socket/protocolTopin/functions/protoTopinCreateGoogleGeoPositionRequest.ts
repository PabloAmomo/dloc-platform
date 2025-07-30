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
  }

  if (informationContent.length >= 6 + wifiAccessPoints.length * 7) {
    const lbsData = informationContent.slice(6 + wifiAccessPoints.length * 7);
    cellTowers.push(...protoTopinExtractWifiCellTowers(prefix, lbsData));
  }

  printMessage(`${prefix} 🗼 [LBS] ℹ️  wifi access points ${wifiAccessPoints.length}, cell towers ${cellTowers.length}`);

  if (cellTowers.length === 0) {
    printMessage(`${prefix} ❌ [LBS]  🗼 no cell towers. Cannot create Google Geo Position Request.`);
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
