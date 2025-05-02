import { CellTower } from "./CellTower";
import { WifiAccessPoint } from "./WifiAccessPoint";

export type GoogleGeolocationRequest =
  | {
      homeMobileCountryCode: string;
      homeMobileNetworkCode: string;
      cellTowers: CellTower[];
      wifiAccessPoints: WifiAccessPoint[];
    }
  | { error: string };

