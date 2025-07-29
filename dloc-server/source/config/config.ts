import MovementMeasure from "../services/server-socket/models/MovementMeasure";

const config: {
  MOVEMENT_MESURE: MovementMeasure;
  MOVEMENTS_CONTROL_SECONDS: number;
  MAX_TIME_DIFFERENCE_MS: number;
} = {
  MOVEMENT_MESURE: "perimeter",
  MOVEMENTS_CONTROL_SECONDS: 300,
  MAX_TIME_DIFFERENCE_MS: 300000, 
};

export default config;
