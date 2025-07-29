import { LatLng } from "models/LatLng";

const calculateBearing = (start: LatLng, end: LatLng): number => {
    /** Convert the latitudes and longitudes from degrees to radians */
    var lat1Rad = start.lat * Math.PI / 180;
    var lon1Rad = start.lng * Math.PI / 180;
    var lat2Rad = end.lat * Math.PI / 180;
    var lon2Rad = end.lng * Math.PI / 180;

    /** Calculate the difference between the two longitudes */
    var deltaLon = lon2Rad - lon1Rad;

    /** Calculate the bearing in radians */
    var y = Math.sin(deltaLon) * Math.cos(lat2Rad);
    var x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);
    var bearing = Math.atan2(y, x) * 180 / Math.PI;

    /** Convert the bearing from radians to degrees */
    return (bearing + 360) % 360;
} 

export default calculateBearing;