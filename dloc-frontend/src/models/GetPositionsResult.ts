import { DevicePosition } from "./DevicePosition";
import { ServiceError } from "./ServiceError";

export type GetPositionsResult = { positions: DevicePosition[]; error?: ServiceError };
