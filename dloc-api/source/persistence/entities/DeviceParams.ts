import { Colors } from "../../enums/Colors";
import { IconTypes } from "../../enums/IconTypes";
import { SharedWith } from "./SharedWith";

export interface DeviceParams {
  name: string,
  markerColor: Colors,
  pathColor: Colors,
  startTrack: IconTypes,
  endTrack: IconTypes,
  sharedWiths: SharedWith[], 
  hasImage: boolean,
}