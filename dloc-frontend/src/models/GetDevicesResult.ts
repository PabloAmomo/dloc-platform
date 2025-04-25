import { Device } from './Device';
import { ServiceError } from './ServiceError';

export type GetDevicesResult = { devices: Device[]; error?: ServiceError };
