const formatLatLng = (value:string) : number[] => {
    let point = value.indexOf(".");
    let degress = value.substring(0, point - 2)
    let rest = value.substring(point - 2);
    return [parseFloat(degress), parseFloat(rest)];
}

export { formatLatLng }