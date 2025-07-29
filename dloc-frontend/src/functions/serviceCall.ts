import { configApp } from 'config/configApp';
import { MutableRefObject } from 'react';
import axios, { AxiosError, AxiosResponse, GenericAbortSignal } from 'axios';
import { AuthProviders } from 'enums/AuthProviders';

const serviceCall = (props: ServiceCall) => {
  const { type, path, defValue, params, onEnd, abort, token, authProvider, formData } = props;

  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (authProvider && authProvider !== AuthProviders.none) headers['Auth-Provider'] = `${authProvider.toString()}`;
  if (formData) headers['Content-Type'] = 'multipart/form-data';

  if (abort.current) abort.current.abort();
  abort.current = new AbortController();
  const signal: GenericAbortSignal = abort.current.signal;

  const errorCatch = (error: AxiosError) => {
    abort.current = undefined;
    onEnd({ error: { message: error.message, status:  error.status ?? error?.response?.status ?? 500, code: error.code } });
  };

  const onOk = (response: AxiosResponse<any, any>) => {
    abort.current = undefined;
    onEnd(response?.data ?? defValue);
  };

  const endpointUrl = `${configApp.apiUrl}${path}`;
  const headerSignal = { signal, headers };
  const withParams = params?.body ? { ...params?.body } :  { params: params?.params, verificationCode: params?.verificationCode };

  switch (type) {
    case 'GET':
    case 'DELETE':
      axios[type.toLowerCase() as 'get' | 'delete'](endpointUrl, { params, ...headerSignal })
        .then(onOk)
        .catch(errorCatch);
      break;

    case 'PUT':
    case 'POST':
      axios[type.toLowerCase() as 'post' | 'put'](endpointUrl, formData ? formData : withParams, headerSignal)
        .then(onOk)
        .catch(errorCatch);
      break;

    default:
  }
};
export default serviceCall;

type ServiceCallType = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ServiceCall {
  abort: MutableRefObject<AbortController | undefined>;
  authProvider: AuthProviders;
  defValue: object;
  formData?: FormData;
  onEnd: any;
  params?: any;
  path: string;
  token: string;
  type: ServiceCallType;
}
