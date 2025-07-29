import MovementMeasure from "../services/server-socket/models/MovementMeasure";

const config: {
  MOVEMENT_MESURE: MovementMeasure;
  MOVEMENTS_CONTROL_SECONDS: number;
  MAX_TIME_DIFFERENCE_MS: number;
  SHOW_PACKETS_SENT: boolean;
  SHOW_PACKETS_RECEIVED: boolean;
} = {
  MOVEMENT_MESURE: "perimeter",
  MOVEMENTS_CONTROL_SECONDS: 300,
  MAX_TIME_DIFFERENCE_MS: 300000,
  // TODO: [DEBUG] Remove this when the protocol (topin) is stable
  SHOW_PACKETS_SENT: true,
  // TODO: [DEBUG] Remove this when the protocol (topin) is stable
  SHOW_PACKETS_RECEIVED: true,
};

export default config;
