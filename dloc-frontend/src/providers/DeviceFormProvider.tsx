import DeviceForm from 'components/DeviceForm/DeviceForm';
import { Device } from 'models/Device';
import { createContext, useContext, useState } from 'react';

export function DeviceFormProvider({ children }: { children: any }) {
  const [device, setDevice] = useState<Device | undefined>();

  const handleOpenFormDevice = (device: Device | undefined) => {
    setDevice(device);
  };

  return (
    <DeviceFormContext.Provider
      value={{
        openFormDevice: handleOpenFormDevice,
      }}
    >
      <DeviceForm device={device} onClose={() => handleOpenFormDevice(undefined)} />
      {children}
    </DeviceFormContext.Provider>
  );
}

export const useDevicesFormContext = (): DeviceFormProviderInterface => useContext(DeviceFormContext);

const DeviceFormContext = createContext<DeviceFormProviderInterface>({
  openFormDevice: () => {},
});

interface DeviceFormProviderInterface {
  openFormDevice: (device: Device | undefined) => void;
}
