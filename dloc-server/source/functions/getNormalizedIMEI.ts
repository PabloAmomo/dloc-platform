export const NO_IMEI_STRING = '---------------';

function getNormalizedIMEI(imei: string): string {
  return imei === '' ? NO_IMEI_STRING : imei;
}

export { getNormalizedIMEI };