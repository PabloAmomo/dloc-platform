import { CellTower } from "./CellTower";
import { WifiAccessPoint } from "./WifiAccessPoint";

export type GoogleGeoPositionRequest =
  | {
      homeMobileCountryCode: string;
      homeMobileNetworkCode: string;
      cellTowers: CellTower[];
      wifiAccessPoints: WifiAccessPoint[];
    }
  | { error: string };

