import { configApp } from 'config/configApp';
import { Device } from 'models/Device';
import { LatLng } from 'models/LatLng';
import { MapPath } from 'models/MapPath';
import { Path } from 'models/Path';
import { Position } from 'models/Position';
import convertUTCDateToLocalDate from './convertUTCDateToLocalDate';
import distanceFromLatLngInMeters from './distanceFromLatLngInMeters';
import calculateBearing from './calculateBearing';

const PATH_OPACITY = configApp.map.pathOpacity;

const processMapPaths = (devices: Device[], currentMapPaths: MapPath[], minutes: number): MapPath[] => {
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
    const { imei, lastPositionUTC, lat, lng, params } = device;
    const { startTrack: iconTrackStart, endTrack: iconTrackEnd } = params;
    const { pathColor: color } = params;

    /** Find device index and add a new device if not exist, and select it */
    let index = newMapPaths.findIndex((mapPath: MapPath) => mapPath.imei === imei);
    if (index === -1) {
      newMapPaths.push({
        imei,
        lastPositionUTC: lastPositionUTC ?? '',
        path: [],
        lastPosistion: { lat: lat ?? 0, lng: lng ?? 0, dateTimeUTC: lastPositionUTC ?? '' },
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
      const locTemp: LatLng = { lat: position.lat, lng: position.lng, dateTimeUTC };
      paths.set(dateTimeUTC, { start: { ...locTemp }, end: { ...locTemp }, dateTimeUTC, distance: 0, bearing: position.directionAngle, speed: position.speed });
    });

    /** Make array of paths and sort by dateTimeUTC */
    let newPaths: Path[] = Array.from(paths, ([name, value]) => value);

    /** Remove paths older than minutes */
    const timeLimit: number = Date.now() - minutes * 60 * 1000;
    newPaths = newPaths.filter((path: Path) => (convertUTCDateToLocalDate(path.dateTimeUTC) ?? new Date(0)).getTime() > timeLimit);

    /** Make array of paths and sort by dateTimeUTC */
    newPaths.sort(
      (a: Path, b: Path) =>
        (convertUTCDateToLocalDate(a.dateTimeUTC) ?? new Date(0)).getTime() - (convertUTCDateToLocalDate(b.dateTimeUTC) ?? new Date(0)).getTime()
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
      if (newPaths[i].start.lat === newPaths[i].end.lat && newPaths[i].start.lng === newPaths[i].end.lng) newPaths.splice(i, 1);
    }

    /** Max path length, remove execces paths */
    while (newPaths.length > configApp.map.maxPathsByDevice) {
      newPaths.shift();
    }

    /** Calculate distance/bearing/speed */
    mapPath.distance = 0;
    for (let i = 0; i < newPaths.length; i++) {
      const path: Path = newPaths[i];
      path.distance = distanceFromLatLngInMeters(path.start, path.end);
      path.bearing = calculateBearing(path.start, path.end);
      if (i > 0) {
        /** In meters per second */
        path.speed =
          path.distance /
          (((convertUTCDateToLocalDate(path.dateTimeUTC) ?? new Date(0)).getTime() -
            (convertUTCDateToLocalDate(newPaths[i - 1].dateTimeUTC) ?? new Date(0)).getTime()) /
            1000);
      }
      mapPath.speed += path.speed;
      mapPath.distance += path.distance;
    }
    if (mapPath.speed > 0 && newPaths.length > 0) mapPath.speed = mapPath.speed / newPaths.length;

    /** Update las time */
    if (mapPath.path.length > 0) mapPath.lastPositionUTC = mapPath.path[mapPath.path.length - 1].dateTimeUTC;

    /** Update paths */
    mapPath.path = newPaths;
  }

  /** Return new mapPaths */
  return newMapPaths;
};

export { processMapPaths };
