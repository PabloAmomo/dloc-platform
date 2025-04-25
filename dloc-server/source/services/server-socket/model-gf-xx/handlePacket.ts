import { createLocationPacket } from '../../../functions/createLocationPacket';
import { getUtcDateTime } from '../../../functions/getUtcDateTime';
import { HandlePacket } from '../../../models/HandlePacket';
import { handlePacketOnError } from '../../../functions/handlePacketOnError';
import { HandlePacketProps } from '../../../models/HandlePacketProps';
import { HandlePacketResult } from '../../../models/HandlePacketResult';
import { PersistenceResult } from '../../../infraestucture/models/PersistenceResult';
import { PositionPacket } from '../../../models/PositionPacket';
import { printMessage } from '../../../functions/printMessage';
import { REGEX_PACKETS } from '../../../functions/packetParseREGEX';

const handlePacket: HandlePacket = async (props: HandlePacketProps): Promise<HandlePacketResult> => {
  const { imei, remoteAdd, data, persistence } = props;
  const noImei: string = 'no imei received';
  let updateLastActivity: boolean = false;
  let response: HandlePacketResult = { imei, error: '', response: '' };

  /** Temporal imei (Used only for print messages for user) */
  var imeiTemp: string = imei == '' ? '---------------' : imei;

  /** Common function to discart packet */
  const discardData = async (message: string, reportError: boolean) => {
    /** Report error (or not) */
    response.error = reportError ? message : '';
    /** Discarted packet */
    printMessage(`[${imeiTemp}] (${remoteAdd}) discarted data (${message}) [${data.length > 20 ? data.substring(0, 20) + '...' : data}]`);
    /** Persist discarted packet */
    await persistence.addDiscarted(response.imei, remoteAdd, message, data).then((result: PersistenceResult) => {
      result.error && handlePacketOnError({ imei: imeiTemp, remoteAdd, data, persistence, name: 'discarted', error: result.error });
    });
  };

  // ---------------------------------------
  // Login Package TRVAP00xxxxIMEIxxxxxxx#
  // ---------------------------------------
  if (data.startsWith('TRVAP00')) {
    response.imei = data.replace('TRVAP00', '').replace('#', '');
    imeiTemp = response.imei == '' ? '---------------' : response.imei;
    response.response = 'TRVBP00' + getUtcDateTime(false) + '#';
    /** Update last activity */
    if (response.imei !== '') updateLastActivity = true;
    printMessage(`[${imeiTemp}] (${remoteAdd}) imei [${response.imei}]`);
  }

  // ---------------------------------------
  // GPS DATA (14 or REPLY 15)
  // ---------------------------------------
  else if (data.startsWith('TRVYP14') || data.startsWith('TRVYP15')) {
    let values: string[] = [];

    for (let i = 0; i < REGEX_PACKETS.length; i++) {
      values = data.match(REGEX_PACKETS[i]) ?? [];
      if (values.length > 0) {
        printMessage(`[${imeiTemp}] (${remoteAdd}) process data (REGEX ${i}) [${data}]`);
        break;
      }
    }

    /** imei not received */
    if (response.imei == '') {
      discardData(noImei, true);
      return response;
    }

    /** Create location packet and persist */
    const locationPacket: PositionPacket | undefined = createLocationPacket(response.imei, remoteAdd, values);
    if (!locationPacket) {
      discardData('error creating location packet', false);
      return response;
    }

    /** Update last activity */
    updateLastActivity = true;

    if (locationPacket.valid) {
      /** Valid position */
      await persistence.addPosition(locationPacket).then((result: PersistenceResult) => {
        result.error && handlePacketOnError({ imei: imeiTemp, remoteAdd, data, persistence, name: 'position', error: result.error });
      });

      /** Update device */
      await persistence.updateDevice(locationPacket).then((result: PersistenceResult) => {
        if (result.error) printMessage(`[${imeiTemp}] (${remoteAdd}) error updating device [${result.error?.message || result.error}]`);
        result.error && handlePacketOnError({ imei: imeiTemp, remoteAdd, data, persistence, name: 'update', error: result.error });

        /** Discard old packet */
        if (result.error?.message === 'old packet') discardData('old packet - update device', false);
      });
    } else {
      /** Invalid position */
      printMessage(`[${imeiTemp}] (${remoteAdd}) invalid position (NOT 'A') [${data}]`);
    }

    response.response = `TRVZP${data.substring(5, 7)}#`;
  }

  // ---------------------------------------
  // Device heartbeat packet
  // ---------------------------------------
  else if (data.startsWith('TRVYP16')) {
    if (response.imei == '') {
      discardData(noImei, true);
      return response;
    }
    /** Process Battery level */
    if (data.length < 18) updateLastActivity = true;
    else {
      const batteryLevel: number = parseInt(data.substring(14, 17) ?? '0');
      await persistence.addBatteryLevel(response.imei, batteryLevel).then((result: PersistenceResult) => {
        result.error && handlePacketOnError({ imei: imeiTemp, remoteAdd, data, persistence, name: 'batteryLevel', error: result.error });
      });
    }
    response.response = 'TRVZP16#';
  }

  // ---------------------------------------------
  // IMSI number and ICCID number of the device
  // ---------------------------------------------
  else if (data.startsWith('TRVYP02')) {
    if (response.imei == '') {
      discardData(noImei, true);
      return response;
    }
    response.response = 'TRVZP02#';
  }

  // ---------------------------------------------
  // UNKNOW but need response (TRVAP Packets)
  // ---------------------------------------------
  else if (data.startsWith('TRVAP14') || data.startsWith('TRVAP89')) {
    if (response.imei == '') {
      discardData(noImei, true);
      return response;
    }
    response.response = `TRVBP${data.substring(5, 7)}#`;
  }

  // ---------------------------------------------
  // UNKNOW but need response (TRVYP Packets)
  // ---------------------------------------------
  else if (data.startsWith('TRVYP1')) {
    if (response.imei == '') {
      discardData(noImei, true);
      return response;
    }
    response.response = `TRVZP${data.substring(5, 7)}#`;
  }

  // ------------------------------------------------
  // Packets with not response needed
  // ------------------------------------------------
  else if (data.startsWith('TRVAP20') || data.startsWith('TRVAP61')) {
    printMessage(`[${imeiTemp}] (${remoteAdd}) received no response needed -> ${data}`);
  }

  // ------------------------------------------------
  // Response to TRVWP02 config packet (Only Info)
  // ------------------------------------------------
  else if (data.startsWith('TRVXP020000010')) {
    updateLastActivity = true;
    printMessage(`[${imeiTemp == '' ? '---------------' : response.imei}] (${remoteAdd}) confirmed TRVWP02 packet received`);
  }

  // ---------------------------------------------
  // Unknow command - Discart packet
  // ---------------------------------------------
  else {
    printMessage(`[${imeiTemp}] (${remoteAdd}) command unknown in data [${data.length > 20 ? data.substring(0, 20) + '...' : data}...]`);
    discardData('commad unknown', false);
    return response;
  }

  /** Update last activity */
  if (updateLastActivity) {
    await persistence.updateLastActivity(response.imei).then((result: PersistenceResult) => {
      result.error && handlePacketOnError({ imei: imeiTemp, remoteAdd, data, persistence, name: 'lastActivity', error: result.error });
    });
  }

  /** Add history */
  await persistence.addHistory(response.imei, remoteAdd, data, response.response).then((result: PersistenceResult) => {
    result.error && handlePacketOnError({ imei: imeiTemp, remoteAdd, data, persistence, name: 'history', error: result.error });
  });

  /** */
  const message = response.response !== '' ? `response [${response.response}]` : `no response to send for packet [${data}]`;
  printMessage(`[${imeiTemp}] (${remoteAdd}) ${message}`);

  /** Return imei */
  return response;
};

export { handlePacket };
