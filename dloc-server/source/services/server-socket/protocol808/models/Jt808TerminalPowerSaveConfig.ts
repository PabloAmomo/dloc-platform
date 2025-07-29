import { Jt808TerminalPowerSaveConfigPowerSaveMode } from "./Jt808TerminalPowerSaveConfigPowerSaveMode";

export type Jt808TerminalPowerSaveConfig = {
  powerSaveMode: Jt808TerminalPowerSaveConfigPowerSaveMode;
  shortConnectPeriodicMin: number;
  flightMode: boolean;
  connectTimeAfterTrackCarMode: number;
};