const distanceFromLatLngInMeters = (startLat: number, strarLng: number, endLat: number, endLng: number) => {
  const R = 6371000; // Radio de la tierra en KM
  const dLat = deg2rad(endLat - startLat);
  const dLng = deg2rad(endLng - strarLng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(startLat)) * Math.cos(deg2rad(endLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distancia en KM
  return d;
};

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default distanceFromLatLngInMeters;