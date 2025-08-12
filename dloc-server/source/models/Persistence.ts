import e from 'express';
import { PowerProfileType } from '../enums/PowerProfileType';
import { PersistenceResult } from '../infraestucture/models/PersistenceResult';
import { PositionPacket } from './PositionPacket';

export interface Persistence {
  addDiscarted: AddDiscarted;
  addPosition: AddPosition;
  addBatteryLevel: AddBatteryLevel;
  addSignalStrength: AddSignalStrength;
  addHistory: AddHistory;
  updateDevice: UpdateDevice;
  updateLastActivity: UpdateLastActivity;
  updatePowerProfile: UpdatePowerProfile;
  getPersistenceName: GetPersistenceName;
  getPersistenceConfig: GetPersistenceName;
  addPowerProfile: AddPowerProfile;
  getPowerProfile: GetPowerProfile;
  getLastPositions: GetLastPositions;
  getLastPosition: GetLastPosition;
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
  (positionPacket: PositionPacket):  Promise<PersistenceResult>;
}
export interface AddBatteryLevel {
  (imei: string, batteryLevel: number):  Promise<PersistenceResult>;
}
export interface AddSignalStrength {
  (imei: string, signalStrength: number):  Promise<PersistenceResult>;
}
export interface AddPowerProfile {
  (imei: string, profile: PowerProfileType):  Promise<PersistenceResult>;
}
export interface GetPowerProfile {
  (imei: string):  Promise<PersistenceResult>;
}
export interface AddHistory {
  (imei: string, remoteAddress: string, data: string, response: string):  Promise<PersistenceResult>;
}
export interface UpdateDevice {
  (positionPacket: PositionPacket):  Promise<PersistenceResult>;
}
export interface UpdateLastActivity {
  (imei: string):  Promise<PersistenceResult>;
}
export interface UpdatePowerProfile {
  (imei: string, powerProfile: PowerProfileType):  Promise<PersistenceResult>;
}
export interface GetLastPositions {
  (imei: string, timeInSec: number):  Promise<PersistenceResult>;
}
export interface GetLastPosition {
  (imei: string):  Promise<PersistenceResult>;
}
export interface clean {
  ():  Promise<PersistenceResult>;
}
export interface health {
  ():  Promise<PersistenceResult>;
}

const fakePersistenceResult: PersistenceResult = {
  results: [],
  error: null,
};

const fakePersistence: Persistence = {
  addDiscarted: async () => (fakePersistenceResult),
  addPosition: async () => (fakePersistenceResult),
  addBatteryLevel: async () => (fakePersistenceResult),
  addSignalStrength: async () => (fakePersistenceResult),       
  addHistory: async () => (fakePersistenceResult),
  updateDevice: async () => (fakePersistenceResult),
  updateLastActivity: async () => (fakePersistenceResult),
  updatePowerProfile: async () => (fakePersistenceResult),
  getPersistenceName: () => 'FakePersistence',
  getPersistenceConfig: () => 'FakePersistenceConfig',
  addPowerProfile: async () => (fakePersistenceResult),
  getPowerProfile: async () => (fakePersistenceResult),
  getLastPositions: async () => (fakePersistenceResult),
  getLastPosition: async () => (fakePersistenceResult),
  clean: async () => (fakePersistenceResult),
  health: async () => (fakePersistenceResult),
};

export { fakePersistence, fakePersistenceResult }; 