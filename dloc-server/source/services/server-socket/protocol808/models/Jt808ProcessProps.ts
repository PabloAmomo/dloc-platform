import net from 'node:net';

import { PowerProfileType } from '../../../../enums/PowerProfileType';
import { CacheImei } from '../../../../infraestucture/models/CacheImei';
import HandlePacketResult from '../../models/HandlePacketResult';

type Jt808ProcessProps = {
  results: HandlePacketResult[];
  imei: string;
  prefix: string;
  counter: number;
  newConnection: boolean;
  powerPrfChanged: boolean;
  needProfileRefresh: boolean;
  imeiData: CacheImei;
  newPowerProfile: PowerProfileType;
  movementsControlSeconds: number;
  sendData: (data: Buffer[]) => void; // Function to send data, if needed
};

export default Jt808ProcessProps;
