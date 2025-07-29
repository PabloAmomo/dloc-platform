import { Colors } from '../enums/Colors';
import { IconTypes } from '../enums/IconTypes';
import { DeviceParams } from '../persistence/entities/DeviceParams';

const DeviceParamsMappers = {
  getDefaultValue: (): DeviceParams => ({
    name: '',
    markerColor: Colors.orange,
    pathColor: Colors.orange,
    startTrack: IconTypes.pin,
    endTrack: IconTypes.pet,
    sharedWiths: [],
    hasImage: false,
  }),
  fromReqBodyParams: (reqBodyParams: any, defaultValue: DeviceParams): DeviceParams => {
    if (!reqBodyParams) return defaultValue;

    const { name, markerColor, pathColor, startTrack, endTrack, sharedWiths, hasImage = false } = reqBodyParams;
    if (!name || !markerColor || !pathColor || !startTrack || !endTrack || !sharedWiths)
      throw new Error('name, markerColor, pathColor, startTrack, endTrack and sharedWiths are required');

    return {
      name,
      markerColor,
      pathColor,
      startTrack,
      endTrack,
      sharedWiths,
      hasImage,
    };
  },
};

export { DeviceParamsMappers };
