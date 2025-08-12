import MovementMeasure from "../services/server-socket/models/MovementMeasure";

const config: {
  MOVEMENT_MESURE: MovementMeasure;
  MOVEMENTS_CONTROL_SECONDS: number;
  REFRESH_POWER_PROFILE_SECONDS: number;
  MAX_TIME_DATETIME_DIFFERENCE_MS: number;
  SHOW_PACKETS_SENT: boolean;
  SHOW_PACKETS_RECEIVED: boolean;
  INVALID_POSITION_LAT_LNG: number;
} = {
  MOVEMENT_MESURE: "perimeter",
  MOVEMENTS_CONTROL_SECONDS: 300,
  MAX_TIME_DATETIME_DIFFERENCE_MS: 300000,
  REFRESH_POWER_PROFILE_SECONDS: 300,
  INVALID_POSITION_LAT_LNG: -999,
  // TODO: [DEBUG] Set to false when the protocol (topin) is stable
  SHOW_PACKETS_SENT: true,
  SHOW_PACKETS_RECEIVED: true,
};

export default config;
