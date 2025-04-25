import { createContext, useContext, useState } from 'react';
import { Device } from 'models/Device';
import { DevicesProviderInterface } from 'models/DevicesProviderInterface';
import { logError } from 'functions/logError';

export function DevicesProvider({ children }: { children: any }) {
  const [devices, setDevices] = useState<Device[]>();
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>();

  const handleSetDevices = (devicesToSet: Device[]) => {
    const newDevices: Device[] = devicesToSet.map((item: Device) => ({
      ...item,
      params: typeof item.params === 'string' ? JSON.parse(item.params) : item.params,
    }));
    setDevices(newDevices);
    setLastUpdate(new Date());
  };

  return (
    <DevicesContext.Provider
      value={{
        devices,
        lastUpdate,
        setDevices: handleSetDevices,
        setLastUpdate: () => setLastUpdate(new Date()),
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
}

export const useDevicesContext = (): DevicesProviderInterface => useContext(DevicesContext);

const DevicesContext = createContext<DevicesProviderInterface>({
  devices: [],
  lastUpdate: undefined,
  setDevices: () => logError('DevicesContext.setDevices'),
  setLastUpdate: () => logError('DevicesContext.setLastUpdate'),
});
