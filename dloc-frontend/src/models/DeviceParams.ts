import { Colors } from "enums/Colors";
import { IconType } from "../enums/IconType"
import { SharedWith } from "./SharedWith";

export type DeviceParams = {
  name: string,
  markerColor: string,
  pathColor: string,
  startTrack: IconType,
  endTrack: IconType,
  sharedWiths: SharedWith[], 
  hasImage: boolean,
}

const DeviceParamsEmpty = (props?: Partial<DeviceParams>) : DeviceParams => ({
  name: '',
  markerColor: Colors.orange,
  pathColor: Colors.orange,
  startTrack: IconType.pin,
  endTrack: IconType.pet,
  sharedWiths: [],
  hasImage: false,
  ...props
});
export default DeviceParamsEmpty;
