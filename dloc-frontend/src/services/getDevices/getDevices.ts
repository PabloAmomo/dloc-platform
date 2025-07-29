import { GetDevicesResult } from 'models/GetDevicesResult';
import { User } from 'models/User';
import { MutableRefObject } from 'react';
import serviceCall from 'functions/serviceCall';

const path = 'devices';
type typeParams = {};

const getDevicesService = (props: GetDevicesServiceProps): void => {
  const { user, params, callback, abort } = props;
  serviceCall({
    type: 'GET',
    token: user.token,
    authProvider: user.authProvider,
    path: '/' + path,
    defValue: [],
    params,
    abort,
    onEnd: (response: any) => callback && callback({ devices: response?.data, error: response?.error }),
  });
};
export default getDevicesService;

interface GetDevicesServiceProps {
  user: User;
  params?: typeParams;
  callback: { (response: GetDevicesResult): any };
  abort: MutableRefObject<AbortController | undefined>;
}
