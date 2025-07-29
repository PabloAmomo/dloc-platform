import { configApp } from "config/configApp";
import { Device } from "models/Device";
import { LatLng } from "models/LatLng";
import { MapPath } from "models/MapPath";
import { Path } from "models/Path";
import { Position } from "models/Position";
import convertUTCDateToLocalDate from "./convertUTCDateToLocalDate";
import distanceFromLatLngInMeters from "./distanceFromLatLngInMeters";
import calculateBearing from "./calculateBearing";
import { GpsAccuracy } from "enums/GpsAccuracy";

const PATH_OPACITY = configApp.map.pathOpacity;

const processMapPaths = (
  devices: Device[],
  currentMapPaths: MapPath[],
  minutes: number
): MapPath[] => {
  const newMapPaths = [...(currentMapPaths ?? [])];

  /** Remove mapPaths not in devices */
  const imeiList: string[] = devices.map((device: Device) => device.imei);
  for (let i = newMapPaths.length - 1; i >= 0; i--) {
    const mapPath: MapPath = newMapPaths[i];
    if (!imeiList.includes(mapPath.imei)) newMapPaths.splice(i, 1);
  }

  /** Process devices */
  for (let i = 0; i < devices.length; i++) {
    const device: Device = devices[i];
    const positions: Position[] = device?.positions?.reverse() ?? [];
    const { imei, lastPositionUTC, lat, lng, params, locationAccuracy, activity } = device;
    const { startTrack: iconTrackStart, endTrack: iconTrackEnd } = params;
    const { pathColor: color } = params;

    /** Find device index and add a new device if not exist, and select it */
    let index = newMapPaths.findIndex(
      (mapPath: MapPath) => mapPath.imei === imei
    );
    if (index === -1) {
      newMapPaths.push({
        imei,
        lastPositionUTC: lastPositionUTC ?? "",
        path: [],
        lastPosistion: {
          lat: lat ?? 0,
          lng: lng ?? 0,
          dateTimeUTC: lastPositionUTC ?? "",
          speed: 0,
          bearing: 0,
          locationAccuracy: locationAccuracy ?? GpsAccuracy.unknown,
          activity: activity ?? "{}",
        },
        color,
        strokeWeight: 1,
        strokeOpacity: PATH_OPACITY,
        distance: 0,
        iconTrackStart,
        iconTrackEnd,
        speed: 0,
      });
      index = newMapPaths.length - 1;
    }
    const mapPath = newMapPaths[index];

    /** Create paths, merging currents paths and new positions */
    const paths: Map<string, Path> = new Map<string, Path>();
    mapPath.path.forEach((path: Path) => paths.set(path.dateTimeUTC, path));
    positions.forEach((position: Position) => {
      const dateTimeUTC: string = position.dateTimeUTC;
      const locTemp: LatLng = {
        lat: position.lat,
        lng: position.lng,
        dateTimeUTC,
        speed: position.speed,
        bearing: position.directionAngle,
        locationAccuracy: position.locationAccuracy,
        activity: position.activity,
      };
      paths.set(dateTimeUTC, {
        start: { ...locTemp },
        end: { ...locTemp },
        dateTimeUTC,
        distance: 0,
        bearing: position.directionAngle,
        speed: position.speed,
      });
    });

    /** Make array of paths and sort by dateTimeUTC */
    let newPaths: Path[] = Array.from(paths, ([name, value]) => value);

    /** Remove paths older than minutes */
    const timeLimit: number = Date.now() - minutes * 60 * 1000;
    newPaths = newPaths.filter(
      (path: Path) =>
        (convertUTCDateToLocalDate(path.dateTimeUTC) ?? new Date(0)).getTime() >
        timeLimit
    );

    /** Make array of paths and sort by dateTimeUTC */
    newPaths.sort(
      (a: Path, b: Path) =>
        (convertUTCDateToLocalDate(a.dateTimeUTC) ?? new Date(0)).getTime() -
        (convertUTCDateToLocalDate(b.dateTimeUTC) ?? new Date(0)).getTime()
    );

    /** Correct paths to start and end correctly */
    newPaths.forEach((path: Path, index: number) => {
      if (index === 0) path.start = { ...path.end };
      else {
        const prevPath: Path = newPaths[index - 1];
        prevPath.end = { ...path.start };
      }
    });

    /** remove path point (Same start to end) */
    for (let i = newPaths.length - 2; i > 0; i--) {
      if (
        newPaths[i].start.lat === newPaths[i].end.lat &&
        newPaths[i].start.lng === newPaths[i].end.lng
      )
        newPaths.splice(i, 1);
    }

    /** Max path length, remove execces paths */
    while (newPaths.length > configApp.map.maxPathsByDevice) {
      newPaths.shift();
    }

    /** Calculate distance/bearing/speed */
    mapPath.distance = 0;
    let seconds: number = 0;
    for (let i = 0; i < newPaths.length; i++) {
      newPaths[i].distance = distanceFromLatLngInMeters(
        newPaths[i].start,
        newPaths[i].end
      );
      newPaths[i].bearing = calculateBearing(
        newPaths[i].start,
        newPaths[i].end
      );

      if (newPaths[i].distance > 0) {
        seconds =
          (new Date(newPaths[i].end.dateTimeUTC ?? 0).getTime() -
            new Date(newPaths[i].start.dateTimeUTC ?? 0).getTime()) /
          1000;
        newPaths[i].speed = newPaths[i].distance / seconds / 0.277778;
      }
      mapPath.distance += newPaths[i].distance;
    }
    /** Calculate speed */
    mapPath.speed = minutes > 0 ? mapPath.distance / (minutes * 60) / 0.277778 : 0;

    /** Update las time */
    if (mapPath.path.length > 0)
      mapPath.lastPositionUTC =
        mapPath.path[mapPath.path.length - 1].dateTimeUTC;

    /** Update paths */
    mapPath.path = newPaths;
  }

  /** Return new mapPaths */
  return newMapPaths;
};

export { processMapPaths };
