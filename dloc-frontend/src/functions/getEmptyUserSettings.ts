import { configApp } from "config/configApp";
import { UserSettings } from "models/UserSettings";

const getEmptyUserSettings  =  () : UserSettings  => { 
  return { geoMap: { interval: configApp.defaultInterval, showDevices: [ "0" ]}  } 
}

export default  getEmptyUserSettings;