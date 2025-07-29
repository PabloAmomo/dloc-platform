import { ConnectionConfig } from 'mysql';
import { PersistenceResult } from '../../models/PersistenceResult';
import { mySqlConnectionConfig } from './mySqlConnectionConfig';
import { PositionPacket } from '../../../models/PositionPacket';
import { printMessage } from '../../../functions/printMessage';
import mySqlQueryAsync from './mySqlQueryAsync';
import { getErrorFromPositionPacket } from '../../functions/getErrorFromPositionPacket';
import { mySqlFormatDateTime } from './mySqlFormatDateTime';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const mySqlGetLastPositionDateTime = async (positionPacket: PositionPacket): Promise<PersistenceResult> => {
  /** validate data */
  const { errorMsg, message } = getErrorFromPositionPacket(positionPacket);
  if (errorMsg !== '' || positionPacket.dateTimeUtc == null) {
    printMessage(message);
    return { results: [], error: new Error(errorMsg) };
  }

  /** Add position */
  const params = [positionPacket.imei, mySqlFormatDateTime(positionPacket.dateTimeUtc)];
  const sql = `SELECT lastPositionUTC FROM  \`device\` WHERE imei = ? AND lastPositionUTC > ?;`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { mySqlGetLastPositionDateTime };
