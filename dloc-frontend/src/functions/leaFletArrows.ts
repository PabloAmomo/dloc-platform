import { LatLng } from 'models/LatLng';
import { MapArrow, MapArrowMarker } from 'models/MapArrow';
import calculateMiddlePoint from './calculateMiddlePoint';
import createLeafletArrowIcon from './createLeafletArrowIcon';
import distanceFromLatLngInMeters from './distanceFromLatLngInMeters';
import LeafletPolyline from 'models/LeafletPolyline';
import { configApp } from 'config/configApp';

const leaFletArrows = (leafletPolyline: LeafletPolyline[]) => {
  return leafletPolyline.map((polyline: LeafletPolyline) => {
    const { imei, color, opacity, iconTrackStart, weight, speed }: LeafletPolyline = polyline;
    const mapArrowMarker: MapArrowMarker[] = [];
    const mapArrow: MapArrow = { imei, color, opacity, markers: mapArrowMarker, weight, speed };

    for (let i = 0; i < polyline.path.length - 1; i++) {
      /** with only one path, can't create arrows (Minimum 2 paths) */
      if (polyline.path.length === 1) break;

      /** Skip the last path */
      if (i === polyline.path.length - 1) continue;

      /** First path */
      if (i === 0) mapArrowMarker.push({ type: 'start', position: polyline.path[i], bearing: 0, icon: iconTrackStart });

      /** Check bearing */
      const bearing = polyline.path[i + 1].bearing;
      if (bearing === undefined) continue;

      /** If the distance is 0, avoid the arrow */
      const distance = distanceFromLatLngInMeters(polyline.path[i], polyline.path[i + 1]);
      if (distance < 5) continue;

      /** Calculate the middle point */
      const position: LatLng = { ...calculateMiddlePoint(polyline.path[i], polyline.path[i + 1]), dateTimeUTC: polyline.path[i + 1].dateTimeUTC };

      /** Create the arrow */
      const icon = createLeafletArrowIcon(color, opacity + 0.4, bearing);
      if (configApp.map.addPathPoint) mapArrowMarker.push({ type: 'point', position: polyline.path[i], bearing, icon });
      mapArrowMarker.push({ type: 'arrow', position, bearing, icon });
    }

    /** return the item */
    return mapArrow;
  });
};

export default leaFletArrows;
