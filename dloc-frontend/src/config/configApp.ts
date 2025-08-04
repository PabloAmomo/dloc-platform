import { ConfigApp } from 'models/ConfigApp';
import { IconType } from 'enums/IconType';
import { MapTemplate } from 'enums/MapTemplate';
import.meta.env;

const APP_NAME = 'maiPet';

export const configApp: ConfigApp = {
  // Define the app name and the cookie name
  appName: APP_NAME,
  cookieName: APP_NAME,

  // Define the Contact Us Email
  constactUsEmail: import.meta.env.VITE_REACT_APP_CONTACT_US_EMAIL ?? '',

  // API Server (Defined in .env)
  apiUrl: import.meta.env.VITE_REACT_API_HTTP_HOST ?? '',

  // Define the Google Auth0 Client ID and the Profile URL
  googleAuht0ClientId: import.meta.env.VITE_REACT_APP_GOOGLE_AUTH0_CLIENT_ID ?? '',
  googleProfileUrl: 'https://www.googleapis.com/oauth2/v1/userinfo',
  
  // Define the Microsoft Auth0 Client ID and the Profile URL
  microsoftProfileUrl: import.meta.env.VITE_REACT_APP_MICROSOFT_AUTH0_URL ?? '',
  microsoftAuth0ClientId: import.meta.env.VITE_REACT_APP_MICROSOFT_AUTH0_CLIENT_ID ?? '',

  // Define the Facebook Auth0 App ID
  facebookAuth0AppId: import.meta.env.VITE_REACT_APP_FACEBOOK_AUTH0_APP_ID ?? '',
  
  defaultInterval: 0, // Define the default interval for the positions request (in minutes - 0 is right now)
  deviceSelectablesTypes: [IconType.pet, IconType.car, IconType.mobile, IconType.pin, IconType.image], // Define what icons types are selectables for the devices icon
  deviceUnselectedOpacity: 0.3, // Define the opacity for the unselected devices
  getPositionsStartegy: 'websocket', // Define the strategy to get the positions (interval or websocket)
  maxLengths: { imei: 15, name: 20 }, // Define the default length for form inputs
  retrievePositions: 5000, // Define the time in milliseconds to retrieve the positions
  secondsOutOffPosition: 180, // Define the time in seconds to consider a device out of position
  secondsOutOffVisibility: 180, // Define the time in seconds to consider a device unavailable
  secondsOutOffVisibilityBattery: 600, // Define the time in seconds to consider a device unavailable for the las battery data available
  startPathSelectablesTypes: [IconType.pet, IconType.car, IconType.mobile, IconType.pin, IconType.image], // Define what icons types are selectables for starts path icon

  // Define the websocket configuration (Signal Server - Defined in .env)
  webSocket: {
    url: import.meta.env.VITE_REACT_APP_WS_HOST ?? 'ws://localhost:8082',
  },

  // Define the map configuration
  map: {
    addPathPoint: true, // show the path point on every path intersection
    driftMarkerTime: 750, // Define the time in miliseconds to consider a device in drift
    initCenter: { lat: 40.417099903, lng: -3.70357844 }, // Define the initial center for the map
    initZoom: 6, // Define the initial and max zoom for the map
    maxPathsByDevice: 1000, // Define the max number of paths by device showing in the map
    maxZoom: 19, // Deinfe the max zoom for the map
    pathOpacity: 0.4, // Define the opacity for the paths
    template: MapTemplate.default, // Define the map template
  },
};
