const convertPercentToRSSI = (signalPercent: number) => {
  return Math.round(signalPercent / 2 - 100);
};

export default convertPercentToRSSI;
