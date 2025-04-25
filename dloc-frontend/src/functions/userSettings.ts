import { UserSettings } from 'models/UserSettings';
import getEmptyUserSettings from './getEmptyUserSettings';

const userSettingsGet = (userId: string): UserSettings => {
  const settings: UserSettings = JSON.parse(localStorage.getItem(`settings-${userId}`) ?? JSON.stringify(getEmptyUserSettings()));
  if (!settings.geoMap) settings.geoMap = { interval: 0, showDevices: ['0'] };
  return settings;
};

const userSettingsSet = (settings: UserSettings, userId: string) => {
  localStorage.setItem(`settings-${userId}`, JSON.stringify(settings));
};

export { userSettingsSet, userSettingsGet };
