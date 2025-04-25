import { CenterMapOn } from './CenterMapOn';
import { LatLng } from './LatLng';
import { Map } from 'leaflet';
import { MapPath } from './MapPath';
import { MutableRefObject } from 'react';
import { LatLngArray } from './LatLngArray';

export interface MapProviderInterface {
  centerMapOn: CenterMapOn;
  setCenterMapOn: { (centerMapOn: CenterMapOn): void };

  map: Map | undefined,
  setMap: { (map: Map): void };
  
  mapMoved: undefined | boolean;
  setMapMoved: { (mapMoved: boolean): void };

  minutes: number;
  setMinutes: { (minutes: number): void };
  
  myPosition: undefined | LatLng | null;
  setMyPosition: { (myPosition: LatLng | undefined | null): void };
  
  isGettingData: boolean;
  setIsGettingData: { (isGettingData: boolean): void };

  showDevices: string[];
  setShowDevices: { (showDevices: string[]): void };

  showPath: boolean;
  setShowPath: { (showPath: boolean): void };

  bounds: LatLngArray[] | undefined;
  isUserAction: MutableRefObject<boolean>;
  visiblePaths: MapPath[];
}
