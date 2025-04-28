import { printMessage } from '../../functions/printMessage';
import { PersistenceResult } from '../../infraestucture/models/PersistenceResult';
import { Persistence } from '../../models/Persistence';
import { PositionPacket } from '../../models/PositionPacket';

const location = async (persistence: Persistence, positionPacket: PositionPacket) => {
  const { imei, remoteAddress } = positionPacket;
  var message: String = 'ok';
  var noHasLocation: boolean = (positionPacket.lat === -999 || positionPacket.lng === -999);
  var hasBatteryLevel: boolean = (positionPacket.batteryLevel != 0);

  if (noHasLocation) {
    if (hasBatteryLevel) {
      /** Update battery level */
      await persistence.addBatteryLevel(imei, positionPacket.batteryLevel).then((result: PersistenceResult) => {
        if (result.error) {
          message = result.error.message;
          printMessage(`[${imei}] (${remoteAddress}) error updating battery level [Only battery Level] (addBatteryLevel) [${result.error?.message || result.error}]`);
        }
      });
    }
    /** Update last activity */
    else {
      await persistence.updateLastActivity(imei,).then((result: PersistenceResult) => {
        if (result.error) {
          message = result.error.message;
          printMessage(`[${imei}] (${remoteAddress}) error updating last activity (updateLastActivity) [${result.error?.message || result.error}]`);
        }
      });
    }
    return { code: message === 'ok' ? 200 : 500, result: { message } };
  } 


  await persistence.addPosition(positionPacket).then((result: PersistenceResult) => {
    if (result.error) {
      message = result.error.message;
      printMessage(`[${imei}] (${remoteAddress}) error persisting position (addPosition) [${result.error?.message || result.error}]`);
    }
  });

  await persistence.updateDevice(positionPacket).then((result: PersistenceResult) => {
    printMessage(`[${imei}] (${remoteAddress}) updating device [${JSON.stringify(positionPacket)}]`);
    if (result.error) {
      message = result.error.message;
      printMessage(`[${imei}] (${remoteAddress}) error persisting position (updateDevice) [${result.error?.message || result.error}]`);
    }
  });

  /** Update last activity */
  await persistence.updateLastActivity(imei).then((result: PersistenceResult) => {
    if (result.error) {
      message = result.error.message;
      printMessage(`[${imei}] (${remoteAddress}) error updating last activity (updateLastActivity) [${result.error?.message || result.error}]`);
    }
  });

  /** Add history */
  await persistence.addHistory(imei, remoteAddress, JSON.stringify(positionPacket), '').then((result: PersistenceResult) => {
    if (result.error) {
      console.log('5');
      message = result.error.message;
      printMessage(`[${imei}] (${remoteAddress}) error persisting history (addHistory) [${result.error?.message || result.error}]`);
    }
  });

  /** */
  return { code: message === 'ok' ? 200 : 500, result: { message } };
};

export { location };
