import { Device } from 'models/Device';

const filterDevices = (devices?: Device[], showDevices?: string[]): Device[] => (devices ?? []).filter((device: Device) => filterDevice(device, showDevices ?? []));

const filterDevice = (device: Device, showDevices?: string[]): boolean => (showDevices ?? []).includes('0') || (showDevices ?? []).includes(device.imei);

export { filterDevices, filterDevice };
