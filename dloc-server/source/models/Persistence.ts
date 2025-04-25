import { PersistenceResult } from '../infraestucture/models/PersistenceResult';
import { PositionPacket } from './PositionPacket';

export interface Persistence {
  addDiscarted: AddDiscarted;
  addPosition: AddPosition;
  addBatteryLevel: AddBatteryLevel;
  addHistory: AddHistory;
  updateDevice: UpdateDevice;
  updateLastActivity: UpdateLastActivity;
  getPersistenceName: GetPersistenceName;
  getPersistenceConfig: GetPersistenceName;
  clean: clean;
  health: health;
}

export interface GetPersistenceName {
  (): string;
}
export interface GetPersistenceConfig {
  (): string;
}
export interface AddDiscarted {
   (imei: string, remoteAddress: string, reason: string, data: string): Promise<PersistenceResult>;
}
export interface AddPosition {
  (locationPacket: PositionPacket):  Promise<PersistenceResult>;
}
export interface AddBatteryLevel {
  (imei: string, batteryLevel: number):  Promise<PersistenceResult>;
}
export interface AddHistory {
  (imei: string, remoteAddress: string, data: string, response: string):  Promise<PersistenceResult>;
}
export interface UpdateDevice {
  (locationPacket: PositionPacket):  Promise<PersistenceResult>;
}
export interface UpdateLastActivity {
  (imei: string):  Promise<PersistenceResult>;
}
export interface clean {
  ():  Promise<PersistenceResult>;
}
export interface health {
  ():  Promise<PersistenceResult>;
}