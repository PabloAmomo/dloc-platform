import { IconType } from "enums/IconType";
import { LatLng } from "./LatLng";
import { Path } from "./Path";

export type MapPath = {
  imei: string;
  color: string;
  strokeWeight: number;
  strokeOpacity: number;
  iconTrackStart: IconType
  iconTrackEnd: IconType;
  path: Path[];
  lastPosistion: LatLng;
  lastPositionUTC: string;
  distance: number;
  speed: number;
};