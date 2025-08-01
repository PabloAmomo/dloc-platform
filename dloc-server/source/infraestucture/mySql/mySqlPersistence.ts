import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { Persistence } from '../../models/Persistence';
import { PersistenceResult } from '../models/PersistenceResult';
import { PositionPacket } from '../../models/PositionPacket';
import * as wrapper from './handles/handleWrapper';
import { PowerProfileType } from '../../enums/PowerProfileType';

class mySqlPersistence implements Persistence {
  getPersistenceName(): string {  
    return 'My SQL Server';
  }
  getPersistenceConfig(): string {  
    const { host, user, database, port, password } = mySqlConnectionConfig;
    return `host: ${host}, user: ${user}, database: ${database}, port: ${port}, password: ${password?.substring(0,3)}*********`;
  }

  addDiscarted(imei: string, remoteAddress: string, message: string, data: string): Promise<PersistenceResult> {
    return wrapper.handleAddDiscarted(imei, remoteAddress, message, data);
  }
  addPosition(positionPacket: PositionPacket):  Promise<PersistenceResult> {
    return wrapper.handleAddPosition(positionPacket);
  }
  addBatteryLevel(imei: string, batteryLevel: number):  Promise<PersistenceResult> {
    return wrapper.handleAddBatteryLevel(imei, batteryLevel);
  }
  addSignalStrength(imei: string, signalStrength: number):  Promise<PersistenceResult> {
    return wrapper.handleAddSignalStrength(imei, signalStrength);
  }
  getPowerProfile(imei: string):  Promise<PersistenceResult> {
    return wrapper.handleGetPowerProfile(imei);
  }
  addPowerProfile(imei: string, profile: PowerProfileType):  Promise<PersistenceResult> {
    return wrapper.handleAddPowerProfile(imei, profile);
  }
  addHistory(imei: string, remoteAddress: string, data: string, response: string):  Promise<PersistenceResult> {
    return wrapper.handleAddHistory(imei, remoteAddress, data, response);
  }
  updateDevice(positionPacket: PositionPacket):  Promise<PersistenceResult> {
    return wrapper.handleUpdateDevice(positionPacket);
  }
  updateLastActivity(imei: string):  Promise<PersistenceResult> {
    return wrapper.handleUpdateLastActivity(imei);
  }
  updatePowerProfile(imei: string, powerProfile: PowerProfileType):  Promise<PersistenceResult> {
    return wrapper.handleUpdatePowerProfile(imei, powerProfile);
  }
  getLastPositions(imei: string, timeInSec: number):  Promise<PersistenceResult> {
    return wrapper.handleGetLastPositions(imei, timeInSec);
  }
  clean():  Promise<PersistenceResult> {
    return wrapper.handleClean();
  } 
  health():  Promise<PersistenceResult> {
    return wrapper.handleHealth();
  } 
}

export { mySqlPersistence };
