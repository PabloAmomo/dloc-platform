import { DeleteDeviceResult } from 'models/DeleteDeviceResult';
import { useDevicesContext } from '../providers/DevicesProvider';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '../providers/UserProvider';
import { logError } from 'functions/logError';
import deleteDeviceService from 'services/deleteDevice/deleteDevice';
import showAlert from 'functions/showAlert';

const useDeleteDeviceHook = (): UseDeleteDeviceHookHook => {
  const { setDevices, devices } = useDevicesContext();
  const { t } = useTranslation();
  const { user, logout } = useUserContext();
  const abort = useRef<AbortController>();

  const deleteDevice = (imei: string, setIsSaving: { (isSaving: boolean): void }, onDelete: { (imei: string): void }) => {
    /** Set loading */
    setIsSaving(true);

    /** Delete devices */
    deleteDeviceService({
      user,
      imei,
      callback: (response: DeleteDeviceResult) => {
        try {
          if (response.error) {
            if (response.error.status !== 401) throw new Error(response.error.message);
            logout();
            throw new Error(t('errors.unauthorized'));
          }

          const newDevices = !devices ? [] : devices.filter((device) => device.imei !== imei);
          setDevices(newDevices);

          onDelete(imei);
        } catch (error: any) {
          if (error.message === 'canceled') return;
          showAlert(error.message, 'error');
          logError(error.message, error);
        } finally {
          setIsSaving(false);
        }
      },
      abort,
    });
  };

  return { deleteDevice };
};

export default useDeleteDeviceHook;

interface UseDeleteDeviceHookHook {
  deleteDevice: (imei: string, setIsSaving: { (isSaving: boolean): void }, onDelete: { (imei: string): void }) => void;
}
