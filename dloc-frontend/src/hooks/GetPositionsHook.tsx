import { Device } from 'models/Device';
import { GetPositionsResult } from 'models/GetPositionsResult';
import { logError } from 'functions/logError';
import { useDevicesContext } from 'providers/DevicesProvider';
import { useEffect, useRef, useState } from 'react';
import { useMapContext } from 'providers/MapProvider';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import processDevices from 'functions/processDevices';
import showAlert from 'functions/showAlert';

const useGetPositionsHook = (props: useGetPositionsHookProps): UseGetPositionsHook => {
  const {} = props;
  const [newResponseData, setNewResponseData] = useState<GetPositionsResult>();
  const { devices, setDevices, setLastUpdate } = useDevicesContext();
  const { logout, isLoggedIn } = useUserContext();
  const { setIsGettingData, minutes, isGettingData } = useMapContext();
  const { t } = useTranslation();
  const firstRequest = useRef(true);
  const runDataAdquistion = useRef<{ (): void }>();

  useEffect(() => {
    if (!newResponseData) return;

    /** Process new data */
    try {
      if (newResponseData.error) {
        if (newResponseData.error.status !== 401) throw new Error(newResponseData.error.message);
        logout();
        throw new Error(t('errors.unauthorized'));
      }

      const newDevices: Device[] = processDevices(newResponseData, devices ?? []);
      setDevices(newDevices);

      if (newDevices && firstRequest.current) firstRequest.current = false;
    } catch (error: any) {
      if (error.message === 'canceled') return;
      showAlert(error.message ?? error, 'error');
      logError(error.message, error);
    } finally {
      setIsGettingData(false);
    }
  }, [newResponseData]);

  /** Process the response from the service */
  const processResponse = (response: GetPositionsResult) => setNewResponseData(response);

  /** Set the function to run the data adquisition */
  const setRunDataAdquistion = (dataAdquistionFunction: { (): void }) => {
    runDataAdquistion.current = dataAdquistionFunction;
  };

  /** Update all device positions when change interval */
  useEffect(() => {
    if (minutes != null) getPositions();
  }, [minutes]);

  /** Update all device positions */
  const getPositions = () => {
    /** Check if user is logged in, have minutes (minutes can be 0), and getPosition function is defined */
    if (!isLoggedIn || minutes == null || !runDataAdquistion?.current) {
      if (isGettingData) setIsGettingData(false);
      return;
    }

    /** Set Loading */
    setIsGettingData(true);

    /** Run Worker */
    runDataAdquistion.current();
  };

  /** */
  return { getPositions, firstRequest, isGettingData, setLastUpdate, processResponse, setRunDataAdquistion };
};

export { useGetPositionsHook };

interface useGetPositionsHookProps {}

interface UseGetPositionsHook {
  firstRequest: React.MutableRefObject<boolean>;
  getPositions: () => void;
  isGettingData: boolean;
  processResponse: (response: GetPositionsResult) => void;
  setLastUpdate: () => void;
  setRunDataAdquistion: (dataAdquistionFunction: { (): void }) => void;
}
