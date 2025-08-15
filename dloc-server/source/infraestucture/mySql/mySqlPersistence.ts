import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { Persistence } from '../../models/Persistence';
import { PersistenceResult } from '../models/PersistenceResult';
import { PositionPacket } from '../../models/PositionPacket';
import * as wrapper from './handles/handleWrapper';
import { PowerProfileType } from '../../enums/PowerProfileType';
import { Protocols } from '../../enums/Protocols';

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
  addDevice(imei: string, protocol: Protocols):  Promise<PersistenceResult> {
    return wrapper.handleAddDevice(imei, protocol);
  }
  addBatteryLevel(imei: string, protocol: Protocols, batteryLevel: number):  Promise<PersistenceResult> {
    return wrapper.handleAddBatteryLevel(imei, protocol, batteryLevel);
  }
  addSignalStrength(imei: string, protocol: Protocols, signalStrength: number):  Promise<PersistenceResult> {
    return wrapper.handleAddSignalStrength(imei, protocol, signalStrength);
  }
  getPowerProfile(imei: string):  Promise<PersistenceResult> {
    return wrapper.handleGetPowerProfile(imei);
  }
  addPowerProfile(imei: string, protocol: Protocols, profile: PowerProfileType):  Promise<PersistenceResult> {
    return wrapper.handleAddPowerProfile(imei, protocol, profile);
  }
  addHistory(imei: string, protocol: Protocols, remoteAddress: string, data: string, response: string):  Promise<PersistenceResult> {
    return wrapper.handleAddHistory(imei, protocol, remoteAddress, data, response);
  }
  updateDevice(positionPacket: PositionPacket, protocol: Protocols):  Promise<PersistenceResult> {
    return wrapper.handleUpdateDevice(positionPacket, protocol);
  }
  updateLastActivity(imei: string, protocol: Protocols):  Promise<PersistenceResult> {
    return wrapper.handleUpdateLastActivity(imei, protocol);
  }
  updatePowerProfile(imei: string, powerProfile: PowerProfileType):  Promise<PersistenceResult> {
    return wrapper.handleUpdatePowerProfile(imei, powerProfile);
  }
  getLastPositions(imei: string, timeInSec: number):  Promise<PersistenceResult> {
    return wrapper.handleGetLastPositions(imei, timeInSec);
  }
  getLastPosition(imei: string):  Promise<PersistenceResult> {
    return wrapper.handleGetLastPosition(imei);
  }
  clean():  Promise<PersistenceResult> {
    return wrapper.handleClean();
  } 
  health():  Promise<PersistenceResult> {
    return wrapper.handleHealth();
  } 
}

export { mySqlPersistence };
