type GoogleGeolocationRequest =  {
  homeMobileCountryCode: string;
  homeMobileNetworkCode: string;
  cellTowers: {
    cellId: string;
    locationAreaCode: string;
    mobileCountryCode: string;
    mobileNetworkCode: string;
  }[];
  wifiAccessPoints: 
    {
      macAddress: string;
      signalStrength: number;
    }[]
} | { error: string };