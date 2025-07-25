import MovementMeasure from "../services/server-socket/models/MovementMeasure";

const config: {
  MOVEMENT_MESURE: MovementMeasure;
  MOVEMENTS_CONTROL_SECONDS: number;
} = {
  MOVEMENT_MESURE: "perimeter",
  MOVEMENTS_CONTROL_SECONDS: 300,
};

export default config;
