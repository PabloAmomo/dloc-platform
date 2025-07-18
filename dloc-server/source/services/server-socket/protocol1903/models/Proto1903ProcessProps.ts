import net from 'node:net';

import { PowerProfileType } from '../../../../enums/PowerProfileType';
import { CacheImei } from '../../../../infraestucture/models/CacheImei';
import HandlePacketResult from '../../models/HandlePacketResult';

type Proto1903ProcessProps = {
  results: HandlePacketResult[];
  imei: string;
  prefix: string;
  counter: number;
  isNewConnection: boolean;
  powerProfileChanged: boolean;
  needProfileRefresh: boolean;
  imeiData: CacheImei;
  newPowerProfileType: PowerProfileType;
  sendData: (data: string[]) => void; 
};

export default Proto1903ProcessProps;
