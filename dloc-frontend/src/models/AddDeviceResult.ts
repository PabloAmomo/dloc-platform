import { ServiceError } from "./ServiceError";

export type AddDeviceResult = { added: boolean; error?: ServiceError };
