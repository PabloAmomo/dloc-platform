import { GetDevicesResult } from 'models/GetDevicesResult';
import { User } from 'models/User';
import { MutableRefObject } from 'react';
import serviceCall from 'functions/serviceCall';

const path = 'logout';
type typeParams = {};

const logoutService = (props: LogoutServiceProps): void => {
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
}
export default logoutService;

interface LogoutServiceProps {
  user: User;
  params?: typeParams;
  callback: { (response: GetDevicesResult): any };
  abort: MutableRefObject<AbortController | undefined>;
}
