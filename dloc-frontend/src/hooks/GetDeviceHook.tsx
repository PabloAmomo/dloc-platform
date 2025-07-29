import { GetDevicesResult } from 'models/GetDevicesResult';
import { logError } from 'functions/logError';
import { useDevicesContext } from '../providers/DevicesProvider';
import { User } from 'models/User';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import getDevicesService from 'services/getDevices/getDevices';
import showAlert from 'functions/showAlert';
import getParameterByName from 'functions/getParameterByName';

const useGetDevicesHook = (): UseGetDevicesHook => {
  const { t } = useTranslation();
  const { setDevices } = useDevicesContext();
  const abort = useRef<AbortController>();

  const getDevices = (props: getDevicesProps) => {
    const { logout, user, onStart, onFinish }: getDevicesProps = props;

    /** Start Process */
    onStart();

    /** Get devices */
    getDevicesService({
      user,
      callback: (response: GetDevicesResult) => {
        try {
          if (response.error) {
            if (response.error.status !== 401) throw  new Error(response.error.message ?? t('errors.retrievenDevices'));
            logout();
            throw new Error(t('errors.unauthorized'));
          }

          const code = getParameterByName('code');
          const imei = getParameterByName('imei');
          if (response.devices?.length === 0 && (!code || !imei)) showAlert(t('errors.noDevicesReceived'), 'info');

          setDevices(response.devices);
        } catch (error: any) {
          if (error.message === 'canceled') return;
          showAlert(error.message, 'error');
          logError(error.message, error);
        } finally {
          /** Finish Process */
          onFinish();
        }
      },
      abort,
    });
  };

  return { getDevices };
};

export default useGetDevicesHook;

interface getDevicesProps {
  logout: { (): void };
  user: User;
  onStart: { (): void };
  onFinish: { (): void };
}

interface UseGetDevicesHook {
  getDevices: (props: getDevicesProps) => void;
}
