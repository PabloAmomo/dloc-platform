import { LatLng } from "./LatLng";

export type Path = {
  start: LatLng;
  end: LatLng;
  dateTimeUTC: string;
  distance: number;
  bearing: number;
  speed: number;
}