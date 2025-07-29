const convertRSSIToPercent = (rssi: number) => {
  return Math.round((rssi + 100) * 2);
};

export default convertRSSIToPercent;