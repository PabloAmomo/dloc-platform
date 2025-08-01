import net from 'node:net';

import { PowerProfileType } from '../../../../enums/PowerProfileType';
import { CacheImei } from '../../../../infraestucture/models/CacheImei';
import HandlePacketResult from '../../models/HandlePacketResult';

type ProtoTopinProcessProps = {
  results: HandlePacketResult[];
  imei: string;
  prefix: string;
  counter: number;
  isNewConnection: boolean;
  powerProfileChanged: boolean;
  needProfileRefresh: boolean;
  imeiData: CacheImei;
  newPowerProfileType: PowerProfileType;
  sendData: (data: Buffer[]) => void; 
};

export default ProtoTopinProcessProps;
