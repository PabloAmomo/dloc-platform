type GoogleGeolocationRequest =  {
  homeMobileCountryCode: string;
  homeMobileNetworkCode: string;
  cellTowers: {
    cellId: string;
    locationAreaCode: string;
    mobileCountryCode: string;
    mobileNetworkCode: string;
  }[];
} | { error: string };