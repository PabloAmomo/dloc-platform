import { LatLng } from 'models/LatLng';

const calculateMidpoint = {
  euclidean: (start: LatLng, end: LatLng): LatLng => {
    const dLat = (end.lat - start.lat) / 2;
    const dLon = (end.lng - start.lng) / 2;
    const midLat = start.lat + dLat;
    const midLon = start.lng + dLon;
    return { lat: midLat, lng: midLon };
  },
  spherical: (start: LatLng, end: LatLng): LatLng => {
    /** Convert to radians */
    const phi1 = (start.lat * Math.PI) / 180;
    const phi2 = (end.lat * Math.PI) / 180;
    const lambda1 = (start.lng * Math.PI) / 180;
    const lambda2 = (end.lng * Math.PI) / 180;

    /** Calculate the midpoint */
    const x = (Math.cos(phi1) * Math.cos(lambda1) + Math.cos(phi2) * Math.cos(lambda2)) / 2;
    const y = (Math.cos(phi1) * Math.sin(lambda1) + Math.cos(phi2) * Math.sin(lambda2)) / 2;
    const z = (Math.sin(phi1) + Math.sin(phi2)) / 2;

    /** Convert back to degrees */
    const midLat = (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI;
    const midLon = (Math.atan2(y, x) * 180) / Math.PI;

    return { lat: midLat, lng: midLon };
  },
};

export default calculateMidpoint;
