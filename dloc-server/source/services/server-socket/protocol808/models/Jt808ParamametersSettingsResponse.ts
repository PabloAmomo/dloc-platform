export type Jt808ParamametersParameter = {
  id: number;
  length: number;
  value: Buffer;
};

export type Jt808ParamametersSettingsValue = {
  value: number | string | Buffer;
};

export type Jt808ParamametersSettings = {
  heartbeat?: Jt808ParamametersSettingsValue; // Heartbeat interval in seconds
  batteryLevel?: Jt808ParamametersSettingsValue; // Battery level percentage (0-100)
  timeZone?: Jt808ParamametersSettingsValue; // Time zone offset in minutes
};

export type Jt808ParamametersSettingsResponse = {
  responseSerial: number;
  parameterCount: number;
  parameters: Jt808ParamametersParameter[];
  paramatersSettings: Jt808ParamametersSettings;
};