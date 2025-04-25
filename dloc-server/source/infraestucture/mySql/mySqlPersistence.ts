import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { Persistence } from '../../models/Persistence';
import { PersistenceResult } from '../models/PersistenceResult';
import { PositionPacket } from '../../models/PositionPacket';
import * as wrapper from './handles/handleWrapper';

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
  addPosition(locationPacket: PositionPacket):  Promise<PersistenceResult> {
    return wrapper.handleAddPosition(locationPacket);
  }
  addBatteryLevel(imei: string, batteryLevel: number):  Promise<PersistenceResult> {
    return wrapper.handleAddBatteryLevel(imei, batteryLevel);
  }
  addHistory(imei: string, remoteAddress: string, data: string, response: string):  Promise<PersistenceResult> {
    return wrapper.handleAddHistory(imei, remoteAddress, data, response);
  }
  updateDevice(locationPacket: PositionPacket):  Promise<PersistenceResult> {
    return wrapper.handleUpdateDevice(locationPacket);
  }
  updateLastActivity(imei: string):  Promise<PersistenceResult> {
    return wrapper.handleUpdateLastActivity(imei);
  }
  clean():  Promise<PersistenceResult> {
    return wrapper.handleClean();
  } 
  health():  Promise<PersistenceResult> {
    return wrapper.handleHealth();
  } 
}

export { mySqlPersistence };
