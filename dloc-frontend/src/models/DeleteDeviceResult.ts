import { ServiceError } from "./ServiceError";

export type DeleteDeviceResult = { delete: boolean; error?: ServiceError };