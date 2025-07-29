import { CenterMapOn } from "models/CenterMapOn";
import { CenterMapOnType } from "enums/CenterMapOnType";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Device } from "models/Device";
import { filterDevices } from "functions/filterDevices";
import { LatLng } from "models/LatLng";
import { LatLngArray } from "models/LatLngArray";
import { logError } from "functions/logError";
import { Map } from "leaflet";
import { MapPath } from "models/MapPath";
import { MapProviderInterface } from "models/MapProviderInterface";
import { processMapPaths } from "functions/processMapPaths";
import { useDevicesContext } from "./DevicesProvider";
import { userSettingsGet, userSettingsSet } from "functions/userSettings";
import { useUserContext } from "./UserProvider";
import getBoundsToCenterMapOn from "functions/getBoundsToCenterMapOn";
import copyJSON from "functions/copyJSON";

export function MapProvider({ children }: { children: any }) {
  const [bounds, setBounds] = useState<LatLngArray[]>();
  const [centerMapOn, setCenterMapOn] = useState<CenterMapOn>({
    type: CenterMapOnType.none,
  });
  const [isGettingData, setIsGettingData] = useState<boolean>(false);
  const [map, setMap] = useState<Map>();
  const [mapMoved, setMapMoved] = useState<boolean | undefined>();
  const [myPosition, setMyPosition] = useState<LatLng | undefined | null>();
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
  const [selectedDevices, setSelectedDevices] = useState<string[]>(["0"]);
  const [showPath, setShowPath] = useState<boolean>(false);
  const [visiblePaths, setVisiblePaths] = useState<MapPath[]>([]);
  const isUserAction = useRef<boolean>(false);
  const { devices } = useDevicesContext();
  const { user, isLoggedIn } = useUserContext();

  /** Close all tooltips */
  const closeAllTooltips = () => {
    map?.eachLayer((layer) => {
      if (layer.getTooltip && layer.getTooltip()) {
        layer.closePopup();
      }
    });
  };

  /** Get device by IMEI */
  const getDeviceByImei = (imei: string): Device | undefined =>
    devices?.find((device: Device) => device.imei === imei);

  /** Set and Save selected minutes */
  const setMinutes = (minutes: number) => {
    setSelectedMinutes(minutes);
    const setting = userSettingsGet(user.profile.id);
    setting.geoMap.interval = minutes;
    userSettingsSet(setting, user.profile.id);
  };

  /** Set and Save selected showing devices */
  const setShowDevices = (showDevices: string[]) => {
    setSelectedDevices(showDevices);
    const setting = userSettingsGet(user.profile.id);
    setting.geoMap.showDevices = showDevices;
    userSettingsSet(setting, user.profile.id);
  };

  /** Load settings and user is logged in */
  useEffect(() => {
    if (!isLoggedIn) return;
    const setting = userSettingsGet(user?.profile?.id);
    setSelectedMinutes(setting.geoMap.interval);
    setSelectedDevices(setting.geoMap.showDevices);

    /** Center map on all devices first time */
    isUserAction.current = true;
    if (centerMapOn.type !== CenterMapOnType.all)
      setCenterMapOn({ type: CenterMapOnType.all });
  }, [isLoggedIn]);

  /** Map was moved */
  useEffect(() => {
    if (!mapMoved || centerMapOn.type === CenterMapOnType.none) return;
    setCenterMapOn({ type: CenterMapOnType.none });
  }, [mapMoved]);

  /** Set the bounds */
  useEffect(() => {
    if (!centerMapOn) return;
    isUserAction.current = true;
    setBounds(
      getBoundsToCenterMapOn(devices, selectedDevices, centerMapOn, myPosition)
    );
  }, [centerMapOn, selectedDevices, devices]);

  /** Calculate the MapPaths to show */
  useEffect(() => {
    if (!showPath || !devices) {
      if (visiblePaths.length) setVisiblePaths([]);
      return;
    }

    /** If devices to show have device that does not exist, in devices, remove it */
    if (!selectedDevices.includes("0")) {
      const resetShowDevices = selectedDevices.some(
        (imei) => imei !== "0" && !getDeviceByImei(imei)
      );
      if (resetShowDevices) {
        setShowDevices(["0"]);
        return;
      }
    }

    /** Reaplaced data with data in device params (To detect and refresh configuration changes) */
    let workVisiblePaths: MapPath[] = copyJSON(visiblePaths).map(
      (path: MapPath): MapPath => {
        const device = getDeviceByImei(path.imei);
        return !device
          ? path
          : {
              ...path,
              color: device.params.pathColor,
              iconTrackStart: device.params.startTrack,
              iconTrackEnd: device.params.endTrack,
            };
      }
    );

    /** Process the paths */
    const newVisiblePaths: MapPath[] = processMapPaths(
      [...filterDevices(devices, selectedDevices)],
      workVisiblePaths,
      selectedMinutes
    );

    /** Set the new paths */
    if (JSON.stringify(visiblePaths) !== JSON.stringify(newVisiblePaths))
      setVisiblePaths(newVisiblePaths);
  }, [devices, selectedDevices, showPath, selectedMinutes]);


  
  /** Provider */
  return (
    <MapContext.Provider
      value={{
        bounds,
        centerMapOn,
        isGettingData,
        isUserAction,
        map,
        mapMoved,
        minutes: selectedMinutes,
        myPosition,
        setCenterMapOn,
        setIsGettingData,
        setMap,
        setMapMoved,
        setMinutes,
        setMyPosition,
        setShowDevices,
        setShowPath,
        showDevices: selectedDevices,
        showPath,
        visiblePaths,
        closeAllTooltips,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => useContext(MapContext);

const MapContext = createContext<MapProviderInterface>({
  bounds: undefined,
  centerMapOn: { type: CenterMapOnType.none },
  isGettingData: true,
  isUserAction: { current: false },
  map: undefined,
  mapMoved: undefined,
  minutes: 0,
  myPosition: undefined,
  setCenterMapOn: () => logError("MapContext.setCenterMapOn"),
  setIsGettingData: () => logError("MapContext.setIsGettingData"),
  setMap: () => logError("MapContext.setMap"),
  setMapMoved: () => logError("MapContext.setMapMoved"),
  setMinutes: () => logError("MapContext.setMinutes"),
  setMyPosition: () => logError("MapContext.setMyPosition"),
  setShowDevices: () => logError("MapContext.setShowDevices"),
  setShowPath: () => logError("MapContext.setShowPath"),
  showDevices: [],
  showPath: false,
  visiblePaths: [],
  closeAllTooltips: () => logError("MapContext.closeAllTooltips"),
});
