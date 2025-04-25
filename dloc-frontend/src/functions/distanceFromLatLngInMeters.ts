import { LatLng } from "models/LatLng";

const distanceFromLatLngInMeters = (start: LatLng, end: LatLng) => {
  const R = 6371000; // Radio de la tierra en KM
  const dLat = deg2rad(end.lat - start.lat);
  const dLon = deg2rad(end.lng - start.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(start.lat)) * Math.cos(deg2rad(end.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distancia en KM
  return d;
};

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default distanceFromLatLngInMeters;
