import { DeleteDeviceResult } from 'models/DeleteDeviceResult';
import { User } from 'models/User';
import { MutableRefObject } from 'react';
import serviceCall from 'functions/serviceCall';

const path = 'devices';
type typeParams = {};

const deleteDeviceService = (props: DeleteDeviceServiceProps): void => {
  const { user, imei, params, callback, abort } = props;
  serviceCall({
    type: 'DELETE',
    token: user.token,
    authProvider: user.authProvider,
    path: '/' + path + '/' + imei,
    defValue: [],
    params,
    abort,
    onEnd: (response: any) => callback && callback({ delete: response?.data?.update ?? false, error: response?.error }),
  });
};

export default deleteDeviceService;

interface DeleteDeviceServiceProps {
  user: User;
  imei: string;
  params?: typeParams;
  callback: { (response: DeleteDeviceResult): any };
  abort: MutableRefObject<AbortController | undefined>;
}
