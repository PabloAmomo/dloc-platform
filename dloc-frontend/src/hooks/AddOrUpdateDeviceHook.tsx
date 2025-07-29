import { AddDeviceResult } from 'models/AddDeviceResult';
import { DeleteImageResult } from 'models/DeleteImageResult';
import { Device } from 'models/Device';
import { logError } from 'functions/logError';
import { UpdateDeviceResult } from 'models/UpdateDeviceResult';
import { UpdateImageResult } from 'models/UpdateImageResult';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '../providers/UserProvider';
import addOrUpdateDeviceService from 'services/addOrUpdateDevice/addOrUpdateDevice';
import deleteImageService from 'services/deleteImage/deleteImage';
import showAlert from 'functions/showAlert';
import updateImageService from 'services/updateImage/updateImage';

const useAddOrUpdateDeviceHook = (): UseAddOrUpdateDeviceHook => {
  const { t } = useTranslation();
  const { user, logout } = useUserContext();
  const abortSaveData = useRef<AbortController>();
  const abortUpdateImage = useRef<AbortController>();

  const cancelProcess = () => {
    abortUpdateImage.current?.abort();
    abortSaveData.current?.abort();
  };

  const addOrUpdateDevice = (props: addOrUpdateDeviceProps) => {
    const { device, setIsSaving, isNewDevice, onDeviceSaved, verificationCode, avatarUrl, isDataChanged, isImageChanged } = props;

    /** reset state */
    saveEvents.saveImage = undefined;
    saveEvents.saveData = undefined;

    /** start saving */
    setIsSaving(true);

    /** aupdate image (Only if changed - detect if is a base64 image) */
    if (!isImageChanged) saveOk('saveImage');
    else {
      /** Delete image */
      if (!device.params.hasImage) {
        deleteImageService({
          user,
          imei: device.imei,
          callback: (response: DeleteImageResult) => {
            try {
              if (!response.error) return saveOk('saveImage', !isDataChanged ? t('deviceSaved') : undefined);

              /** handle errors */
              throw new Error(response.error.message);
              //
            } catch (error: any) {
              saveError('saveImage', error.message ?? error, error);
            } finally {
              checkState(setIsSaving, onDeviceSaved, device);
            }
          },
          abort: abortUpdateImage,
        });
      } 
      /** Upload image */
      else {
        updateImageService({
          user,
          imei: device.imei,
          imageUrlData: avatarUrl,
          callback: (response: UpdateImageResult) => {
            try {
              if (!response.error) return saveOk('saveImage', !isDataChanged ? t('deviceSaved') : undefined);

              /** handle errors */
              throw new Error(response.error.message);
              //
            } catch (error: any) {
              saveError('saveImage', error.message ?? error, error);
            } finally {
              checkState(setIsSaving, onDeviceSaved, device);
            }
          },
          abort: abortUpdateImage,
        });
      }
    }

    /** add or update devices */
    if (!isDataChanged && !isNewDevice) saveOk('saveData');
    else {
      addOrUpdateDeviceService({
        user,
        imei: device.imei,
        params: { params: device.params, verificationCode },
        callback: (response: UpdateDeviceResult | AddDeviceResult) => {
          try {
            if (!response.error) return saveOk('saveData', t(verificationCode ? 'deviceSharedAdded' : isNewDevice ? 'deviceAdded' : 'deviceSaved'));

            /** handle errors */
            const code = response.error.status;
            switch (code) {
              case 401:
                logout();
                throw new Error(t('errors.unauthorized'));
              case 400:
                if (verificationCode) throw new Error(t('errors.sharedAlreadyAssigned'));
                throw new Error(t('errors.deviceAlreadyAssigned'));
              case 404:
                throw new Error(t('errors.deviceNotFound'));
              default:
                let errorMessage = response.error.message;
                if (errorMessage === 'invalid verification code') errorMessage = t('errors.invalidVerificationCode');
                throw new Error(errorMessage);
            }
          } catch (error: any) {
            saveError('saveData', error.message ?? error, error);
          } finally {
            checkState(setIsSaving, onDeviceSaved, device);
          }
        },
        abort: abortSaveData,
        isNew: isNewDevice,
      });
    }
  };

  return {
    addOrUpdateDevice,
    cancelProcess,
  };
};

export default useAddOrUpdateDeviceHook;

interface addOrUpdateDeviceProps {
  avatarUrl: string;
  device: Device;
  setIsSaving: { (isSaving: boolean): void };
  isNewDevice: boolean;
  onDeviceSaved: { (device: Device): void };
  verificationCode?: string;
  isDataChanged: boolean;
  isImageChanged: boolean;
}

interface UseAddOrUpdateDeviceHook {
  addOrUpdateDevice: { (props: addOrUpdateDeviceProps): void };
  cancelProcess: { (): void };
}

interface SaveEvents {
  saveImage: boolean | undefined;
  saveData: boolean | undefined;
}

const saveEvents: SaveEvents = { saveImage: undefined, saveData: undefined };

const saveOk = (processError: 'saveImage' | 'saveData', message?: string): void => {
  if (message) showAlert(message, 'success');
  saveEvents[processError] = true;
};

const saveError = (processError: 'saveImage' | 'saveData', errorMessage: string, error: any) => {
  saveEvents[processError] = false;
  if (errorMessage === 'canceled') return;
  showAlert(errorMessage, 'error');
  logError(errorMessage, error);
};

const checkState = (setIsSaving: (isSaving: boolean) => void, onDeviceSaved: (device: Device) => void, device: Device) => {
  if (saveEvents.saveImage != undefined && saveEvents.saveData != undefined) setIsSaving(false);
  if (saveEvents.saveImage && saveEvents.saveData && onDeviceSaved) onDeviceSaved(device);
};
