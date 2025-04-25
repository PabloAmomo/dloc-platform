import { ServiceError } from "./ServiceError";

export type UpdateDeviceResult = { update: boolean; error?: ServiceError };
