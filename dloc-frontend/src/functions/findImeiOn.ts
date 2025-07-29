import { Device } from "models/Device";
import { MapPath } from "models/MapPath";

const findMapPathOn = (imei: string, findOn: MapPath[]): MapPath | undefined => findOn?.find((mapPath: MapPath) => mapPath.imei === imei);
const findDeviceOn = (imei: string, findOn: Device[]): Device | undefined => findOn.find((device: Device) => device.imei === imei);

export { findMapPathOn, findDeviceOn };