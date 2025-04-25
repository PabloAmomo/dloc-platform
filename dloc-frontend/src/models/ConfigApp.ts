import { IconType } from "enums/IconType";
import { MapTemplate } from "enums/MapTemplate";

export interface ConfigApp {
  appName: string;
  cookieName: string;
  apiUrl: string;

  googleAuht0ClientId: string;
  googleProfileUrl: string;
  microsoftProfileUrl: string;
  microsoftAuth0ClientId: string;
  facebookAuth0AppId: string;
  
  constactUsEmail: string;
  
  defaultInterval: number;
  deviceSelectablesTypes: IconType[];
  deviceUnselectedOpacity: number;
  getPositionsStartegy: 'https' | 'websocket';
  maxLengths: { imei: number; name: number };
  retrievePositions: number;
  secondsOutOffPosition: number;
  secondsOutOffVisibility: number;
  secondsOutOffVisibilityBattery: number;
  startPathSelectablesTypes: IconType[];
  webSocket: {
    url: string;
  };
  map: {
    template: MapTemplate;
    initCenter: { lat: number; lng: number };
    initZoom: number;
    maxZoom: number;
    maxPathsByDevice: number;
    pathOpacity: number;
    addPathPoint: boolean;
    driftMarkerTime: number;
  };
}
