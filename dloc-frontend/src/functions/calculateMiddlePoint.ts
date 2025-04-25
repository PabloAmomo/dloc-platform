import { LatLng } from "models/LatLng";

const calculateMiddlePoint = (start: LatLng, end: LatLng): LatLng => {
  const position: LatLng = {
    lat: Math.abs((start.lat - end.lat) / 2) * (start.lat > end.lat ? -1 : 1),
    lng: Math.abs((start.lng - end.lng) / 2) * (start.lng > end.lng ? -1 : 1),
  };
  position.lat += start.lat;
  position.lng += start.lng;

  return position;
};

export default calculateMiddlePoint;