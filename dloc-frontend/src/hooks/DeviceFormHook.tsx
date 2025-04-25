import { configApp } from 'config/configApp';
import { Device, DeviceEmpty } from 'models/Device';
import { IconType } from 'enums/IconType';
import { logError } from 'functions/logError';
import { SharedWith } from 'models/SharedWith';
import { useDevicesContext } from '../providers/DevicesProvider';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import checkSharedDeviceValidData from 'functions/checkSharedDeviceValidData';
import DeviceParamsEmpty from 'models/DeviceParams';
import getDeviceImagePathByImei from 'functions/getDeviceImagePathByImei';
import isValidImei from 'functions/isValidImei';
import isValidName from 'functions/isValidName';
import showAlert from 'functions/showAlert';
import useAddOrUpdateDeviceHook from './AddOrUpdateDeviceHook';

const NO_IMAGE_URL = '';

const useDeviceFormHook = (): UseDeviceFormHook => {
  const [avatarUrl, setAvatarUrl] = useState<string>(NO_IMAGE_URL);
  const [dataModified, setDataModified] = useState<boolean>(false);
  const [device, setDevice] = useState<Device>(DeviceEmpty());
  const [errors, setErrors] = useState<string[]>([]);
  const [imageModified, setImageModified] = useState<boolean>(false);
  const [isNewDevice, setIsNewDevice] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sharedDevice, setSharedDevice] = useState<SharedDeviceData | undefined>();
  const { addOrUpdateDevice, cancelProcess } = useAddOrUpdateDeviceHook();
  const { setDevices, devices } = useDevicesContext();
  const { t } = useTranslation();
  const { user } = useUserContext();
  const avatarUrlInitial = useRef<string>(NO_IMAGE_URL);
  const deviceInitial = useRef<Device>(DeviceEmpty());

  const cleanQueryParams = () => {
    /** Clean url for shared imei and code */
    ['imei', 'code', 'name', 'to'].forEach((param) => searchParams.delete(param));
    setSearchParams(searchParams);
    
  };

  /** Open Device Form (Setting the shared device to work with) */
  useEffect(() => {
    if (sharedDevice && !sharedDevice?.error) {
      const name = (sharedDevice?.name ?? t('thePet')).toUpperCase();
      const imei = sharedDevice?.imei ?? '';

      /** Check if the device already exists as pet in the user account */
      const device = devices?.find((device) => device.imei === imei);
      if (device) {
        showAlert(t('errors.sharedAlreadyExists', { name }), 'error');
        cleanQueryParams();
        return;
      }

      openDeviceForm({ ...DeviceEmpty(), imei, isShared: true, params: { ...DeviceParamsEmpty(), name } });
    }
  }, [sharedDevice]);

  useEffect(() => {
    if (!user.profile.email) return;

    /** Only check shared device if there is no shared device setted */
    if (sharedDevice) return;

    const sharedDeviceItem = checkSharedDeviceValidData(searchParams, setSearchParams);
    if (!sharedDeviceItem) return;

    /** Decode the email */
    let toEmail = '';
    try {
      if (sharedDeviceItem?.to) toEmail = atob(sharedDeviceItem?.to);
    } catch (error: any) {
      logError('Error decoding base64 email', error);
    }
    
    /** If there is a shared device, open the form */
    if (sharedDeviceItem && !sharedDeviceItem.error && toEmail.toLocaleLowerCase() === user.profile.email.toLocaleLowerCase()) {
      setSharedDevice(sharedDeviceItem);
      return;
    }
    
    /** Exist shared device but we have to show an error */
    if (toEmail.toLocaleLowerCase() !== user.profile.email.toLocaleLowerCase()) showAlert(t(`errors.sharedNotForYou`, { email: toEmail }), 'error');
    else if (sharedDeviceItem?.error === 'to') showAlert(t(`errors.sharedNotForYouToError`), 'error');
    else if (sharedDeviceItem?.error) showAlert(t(`errors.invalidRequest`, { error: t(sharedDeviceItem.error) }), 'error');

    cleanQueryParams();
  }, [searchParams, user]);

  /** Cancel the add or update process */
  const cancelSave = () => cancelProcess();

  /** Save the device */
  const saveDevice = ({ setIsSaving }: { setIsSaving: { (isSaving: boolean): void } }) => {
    if (errors.length > 0) {
      const label = errors.length > 1 ? 'Fields' : 'Field';
      showAlert(
        t(`errors.checkInvalid${label}`, {
          fields: errors
            .map((field) => t(field))
            .join(', ')
            .toLowerCase(),
        }),
        'error'
      );
      return;
    }
    /** Save or Update Device */
    addOrUpdateDevice({
      device,
      setIsSaving,
      isNewDevice,
      onDeviceSaved,
      verificationCode: sharedDevice?.code,
      avatarUrl,
      isDataChanged: dataModified,
      isImageChanged: imageModified,
    });
  };

  /** Check if the fields are valid */
  const checkInvalidFields = (): string[] => {
    const response: string[] = [];
    const { imei } = device;
    const { name } = device?.params;
    if (!isValidImei(imei)) response.push('imei');
    if (!isValidName(name)) response.push('name');
    return response;
  };

  /** Return the original device value */
  const getOriginalDevice = (): Device => deviceInitial.current;

  /** Check if the data was modified and check the invalid fields */
  useEffect(() => {
    setImageModified(avatarUrlInitial.current !== avatarUrl);
    setDataModified(JSON.stringify(device) !== JSON.stringify(deviceInitial.current));
    setErrors(checkInvalidFields());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, avatarUrl]);

  /** Open the form */
  const openDeviceForm = (device: Device) => {
    setIsNewDevice(device.imei === '' || sharedDevice !== undefined);
    setDevice(device);
    deviceInitial.current = device;
    const avatarImageUrl = isNewDevice ? NO_IMAGE_URL : getDeviceImagePathByImei(device?.imei);
    setAvatarUrl(avatarImageUrl);
    avatarUrlInitial.current = avatarImageUrl;
    setIsOpen(true);
  };

  /** Close the form */
  const closeDeviceForm = () => {
    const device: Device = DeviceEmpty();
    setDevice(device);
    deviceInitial.current = device;
    setErrors([]);
    if (sharedDevice) {
      setSharedDevice(undefined);
      cleanQueryParams();
    }
    setIsOpen(false);
  };

  /** Update de devices list */
  const onDeviceSaved = (device: Device) => {
    let updatedDevices: Device[] = isNewDevice ? [...(devices ?? []), device] : (devices ?? []).map((d) => (d.imei === device.imei ? device : d));
    setDevices(updatedDevices);
    closeDeviceForm();
  };

  /** Common update device */
  const updateDevice = (param: string, value: any) => {
    const updateDevice: Device = { ...device, params: { ...device.params, [param]: value } };
    setDevice(updateDevice);
  };

  /** Reset the image URL */
  const resetAvatarURL = () => {
    setAvatarUrl(avatarUrlInitial.current);
    changeHasImage(avatarUrlInitial.current !== NO_IMAGE_URL);
  };

  /** Handlers */
  const changeHasImage = (hasImage: boolean) => updateDevice('hasImage', hasImage);
  const changeEndTrack = (type: IconType) => updateDevice('endTrack', type);
  const changeMarkerColor = (color: string) => updateDevice('markerColor', color);
  const changePathColor = (color: string) => updateDevice('pathColor', color);
  const changeStartTrack = (icon: IconType) => updateDevice('startTrack', icon);

  const changeImei = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDevice({ ...device, imei: event.target.value.substring(0, configApp.maxLengths.imei).replace(/[^\d+.-]/g, '') });
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    updateDevice('name', event.target.value.substring(0, configApp.maxLengths.name).toUpperCase());
  const changeSharedWiths = (sharedWidths: SharedWith[]) => {
    updateDevice('sharedWiths', sharedWidths);
  };

  /** Return the hook */
  return {
    avatarUrl,
    cancelSave,
    closeDeviceForm,
    dataModified,
    device,
    errors,
    getOriginalDevice,
    imageModified,
    isNewDevice,
    isOpen,
    openDeviceForm,
    resetAvatarURL,
    saveDevice,
    setAvatarUrl,
    setDevice,
    setSharedDevice,
    sharedDevice,
    handlers: {
      changeMarkerColor,
      changePathColor,
      changeEndTrack,
      changeName,
      changeImei,
      changeStartTrack,
      changeSharedWiths,
      changeHasImage,
    },
  };
};

export default useDeviceFormHook;

interface UseDeviceFormHook {
  avatarUrl: string;
  cancelSave: () => void;
  closeDeviceForm: () => void;
  dataModified: boolean;
  device: Device;
  errors: string[];
  getOriginalDevice: () => Device | undefined;
  imageModified: boolean;
  isNewDevice: boolean;
  isOpen: boolean;
  openDeviceForm: (device: Device) => void;
  resetAvatarURL: () => void;
  saveDevice: ({ setIsSaving }: { setIsSaving: { (isSaving: boolean): void } }) => void;
  setAvatarUrl: (avatarUrl: string) => void;
  setDevice: (device: Device) => void;
  setSharedDevice: (sharedImei: SharedDeviceData | undefined) => void;
  sharedDevice: SharedDeviceData | undefined;
  handlers: {
    changeMarkerColor: (color: string) => void;
    changePathColor: (color: string) => void;
    changeEndTrack: (type: IconType) => void;
    changeName: (event: React.ChangeEvent<HTMLInputElement>) => void;
    changeImei: (event: React.ChangeEvent<HTMLInputElement>) => void;
    changeStartTrack: (icon: IconType) => void;
    changeSharedWiths: (sharedWidths: SharedWith[]) => void;
    changeHasImage: (hasImage: boolean) => void;
  };
}
