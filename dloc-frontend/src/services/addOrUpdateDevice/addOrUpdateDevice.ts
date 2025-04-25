import { DeviceParams } from 'models/DeviceParams';
import { MutableRefObject } from 'react';
import { UpdateDeviceResult } from 'models/UpdateDeviceResult';
import { User } from 'models/User';
import serviceCall from 'functions/serviceCall';

const path = 'devices';
type typeParams = { params: DeviceParams };

function addOrUpdateDeviceService(props: AddOrUpdateDeviceServiceProps) : void {
  const { user, imei, params, callback, abort, isNew } = props;

  serviceCall({
    type: isNew ? 'POST' : 'PUT',
    token: user.token,
    authProvider: user.authProvider,
    path: '/' + path + '/' + imei,
    defValue: [],
    params,
    abort,
    onEnd: (response: any) => callback && callback({ update: response?.data?.update ?? false, error: response?.error }),
  });
}

export default addOrUpdateDeviceService;

interface AddOrUpdateDeviceServiceProps {
  user: User;
  imei: string;
  params: typeParams & { verificationCode?: string };
  callback: { (response: UpdateDeviceResult): any };
  abort: MutableRefObject<AbortController | undefined>;
  isNew: boolean;
}
