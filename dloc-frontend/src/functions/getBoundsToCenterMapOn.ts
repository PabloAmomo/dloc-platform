import { Device } from "models/Device";
import { LatLngArray } from "models/LatLngArray";
import { filterDevices } from "./filterDevices";
import { CenterMapOnType } from "enums/CenterMapOnType";
import { CenterMapOn } from "models/CenterMapOn";
import { LatLng } from "models/LatLng";

const getDevicesFromShowingDevices = (showingDevices: Device[], centerMapOn: CenterMapOn) => {
  return showingDevices
    .filter(
      (device: Device) =>
        device.imei === centerMapOn?.device?.imei ||
        !centerMapOn?.device?.imei
    )
    .map((device: Device) => [device.lat, device.lng] as LatLngArray);
};

const getBoundsToCenterMapOn = (devices: Device[] | undefined, selectedDevices: string[], centerMapOn: CenterMapOn, myPosition: LatLng | undefined | null): LatLngArray[] => {
  if (!devices || devices.length === 0) return [];

  const newBounds: LatLngArray[] = [];
  const showingDevices = filterDevices(devices, selectedDevices);

  const addMyPosition =
    centerMapOn.type === CenterMapOnType.all ||
    centerMapOn.type === CenterMapOnType.myPosition;

  if (addMyPosition && myPosition)
    newBounds.push([myPosition.lat, myPosition.lng]);

  if (
    centerMapOn.type === CenterMapOnType.device ||
    centerMapOn.type === CenterMapOnType.devices ||
    centerMapOn.type === CenterMapOnType.all
  )
    newBounds.push(...getDevicesFromShowingDevices(showingDevices, centerMapOn));

  return newBounds;
};

export default getBoundsToCenterMapOn;
