import { configApp } from 'config/configApp';
import { MapArrow } from 'models/MapArrow';
import { MapPath } from 'models/MapPath';
import { Path } from 'models/Path';
import { useEffect, useState } from 'react';
import { useMapContext } from 'providers/MapProvider';
import L from 'leaflet';
import leaFletArrows from 'functions/leaFletArrows';
import LeafletPolyline from 'models/LeafletPolyline';
import isTouchScreenDevice from 'functions/isTouchScreenDevice';
import { GpsAccuracy } from 'enums/GpsAccuracy';

const LeafletMapHook = (): UseLeafletMapHook => {
  const [polylines, setPolylines] = useState<LeafletPolyline[]>([]);
  const [mapArrows, setMapArrows] = useState<MapArrow[]>([]);
  const { mapMoved, setMapMoved, map, visiblePaths, bounds, isUserAction, setMyPosition } = useMapContext();

  useEffect(() => {
    /** If there are no visible paths, clear the polylines */
    if (visiblePaths.length === 0) {
      if (polylines.length > 0) {
        setPolylines([]);
        setMapArrows([]);
      }
      return;
    }

    /** Create the new polylines */
    const newPolylines: LeafletPolyline[] = [];
    visiblePaths.forEach((path: MapPath) => {
      const { imei, color, iconTrackStart, iconTrackEnd, strokeOpacity: opacity, strokeWeight: weight, speed } = path;
      const newPolyline: LeafletPolyline = { imei, path: [], color, iconTrackStart, iconTrackEnd, opacity, weight, speed };
      const paths = [...path.path];

      if (paths.length === 0) return;

      newPolyline.path.push({ lat: paths[0].start.lat, lng: paths[0].start.lng, dateTimeUTC: paths[0].start.dateTimeUTC, speed: paths[0].start.speed, bearing: paths[0].bearing, locationAccuracy: paths[0].start.locationAccuracy, activity: paths[0].start.activity });
      paths.forEach((path: Path) => newPolyline.path.push({  lat: path.end.lat, lng: path.end.lng, dateTimeUTC: path.end.dateTimeUTC, bearing: path.bearing, speed: path.speed, locationAccuracy: path.end.locationAccuracy,  activity: paths[0].end.activity  }));

      if (newPolyline.path.length > 0) newPolylines.push(newPolyline);
    });

    /** If the polylines are the same, return */
    if (JSON.stringify(polylines) === JSON.stringify(newPolylines)) return;

    /** Set the new polylines */
    setPolylines(newPolylines);

    /** No polylines, no arrows */
    if (!newPolylines) return;

    /** Create the arrows */
    const arrows: MapArrow[] = leaFletArrows(newPolylines);

    /** If the arrows are the same, return */
    if (JSON.stringify(arrows) === JSON.stringify(mapArrows)) return;

    setMapArrows(arrows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiblePaths]);

  /** Set the map to bounds */
  useEffect(() => {
    if (!bounds || !map) return;
    /** Filter the bounds (Discard invalid bounds) */
    const newBounds : [number,number][] = [];
    bounds.forEach(item => {
      if (item && item[0] && item[1]) newBounds.push([item[0], item[1]]);
    });
    const deviceBounds: L.LatLngBounds = new L.LatLngBounds(newBounds);
    if (!mapMoved && deviceBounds?.isValid()) map.fitBounds(deviceBounds, { padding: [50, 50] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds, map]);

  /** Initialize the map */
  useEffect(() => {
    if (!map) return;
    /** Map Configuration */
    map.setMaxZoom(configApp.map.maxZoom);
    map.setZoom(configApp.map.initZoom);
    if (configApp.map.maxZoom > 18) {
      L.tileLayer(configApp.map.template, {
        maxNativeZoom: 19,
        maxZoom: configApp.map.maxZoom,
      }).addTo(map);
    }
    
    if (isTouchScreenDevice()) map.zoomControl?.remove();
    else {
      map.zoomControl.options.position = 'bottomright';
      map.zoomControl?.setPosition('bottomright');
    } 
    
    /** Set the map events */
    map.on('moveend', () => {
      if (isUserAction.current) isUserAction.current = false;
      else setMapMoved(true);
    });
    map.on('locationerror', (e) => setMyPosition(null));
    map.on('locationfound', (e) => setMyPosition({ lat: e.latlng.lat, lng: e.latlng.lng, speed:0, bearing: 0, locationAccuracy: GpsAccuracy.gps, activity: '{}' }));
    /** Start the user location */
    map.locate({ watch: true, timeout: 2500, enableHighAccuracy: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  /** Return */
  return {
    polylines,
    mapArrows,
  };
};

export default LeafletMapHook;

interface UseLeafletMapHook {
  polylines: LeafletPolyline[];
  mapArrows: MapArrow[];
}
