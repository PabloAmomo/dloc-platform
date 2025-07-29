import { ServiceError } from "./ServiceError";

export type SendEmailResult = { send: boolean; error?: ServiceError };
