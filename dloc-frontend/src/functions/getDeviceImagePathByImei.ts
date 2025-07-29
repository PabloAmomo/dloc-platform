import { configApp } from 'config/configApp';
import getNoImagePath from './getNoImagePath';

const getDeviceImagePathByImei = (imei?: string) => {
  return !imei ? getNoImagePath() : `${configApp.apiUrl}/devices/${imei}/image`;
};

export default getDeviceImagePathByImei;
