import { IconType } from "enums/IconType";
import { LatLng } from "./LatLng";

export type LeafletPolyline = {
  imei: string,
  iconTrackStart: IconType,
  iconTrackEnd: IconType,
  color: string,
  path: LatLng[],
  opacity: number,
  weight: number,
  speed: number,
};

export default LeafletPolyline;