import { Device } from 'models/Device';
import { GetPositionsResult } from 'models/GetPositionsResult';
import { DevicePosition } from 'models/DevicePosition';
import DeviceParamsEmpty from 'models/DeviceParams';

/** Update devices */
const processDevices = (response: GetPositionsResult, devices: Device[]): Device[] => {
  var newDevices: Device[] = [...devices];

  /** If there are no positions in the response, return the current devices */
  if (!response.positions) return newDevices;

  /** Update devices with new devices received when the location response is received */
  response.positions.forEach((position: DevicePosition) => {
    const device = newDevices.filter((device: Device) => device.imei === position.imei);
    if (!device) {
      newDevices.push({
        imei: position.imei,
        batteryLevel: position.batteryLevel,
        directionAngle: position.directionAngle,
        gsmSignal: position.gsmSignal,
        lat: position.lat,
        lng: position.lng,
        speed: position.speed,
        lastPositionUTC: position.lastPositionUTC,
        lastVisibilityUTC: position.lastVisibilityUTC,
        positions: position.positions,
        isShared: position.isShared,
        params: JSON.parse((position as any)?.params ?? DeviceParamsEmpty()),
      });
    }
  });

  /** Update the devices with the new positions */
  response.positions.forEach((position: DevicePosition) => {
    for (let i = 0; i < newDevices.length; i++) {
      if (newDevices[i].imei === position.imei) {
        const { batteryLevel, directionAngle, gsmSignal, lat, lng, speed, lastPositionUTC, lastVisibilityUTC, positions } = position;
        Object.assign(newDevices[i], { batteryLevel, directionAngle, gsmSignal, lastPositionUTC, lastVisibilityUTC });
        Object.assign(newDevices[i], { lat, lng, positions, speed, update: Date.now() });
        break;
      }
    }
  });

  /** Set new devices */
  return newDevices;
};

export default processDevices;
