import {
  GetPositionsStrategy,
  GetPositionsStrategyProps,
} from "models/GetPositionsStrategy";
import { queryWorkerWithHTTPS } from "functions/queryDevicesWithHTTPS";
import { useEffect, useState } from "react";
import { useMapContext } from "providers/MapProvider";
import { useUserContext } from "providers/UserProvider";
import { useWebsocketContext } from "providers/WebsocketProvider";
import { WebSocketDataCommands } from "enums/WebSocketDataCommands";
import { WebSocketEvents } from "enums/WebSocketEvents";
import {
  WebSocketServiceData,
  WebSocketServiceDataPosition,
  WebSocketServiceDataUpdatePowerProfile,
} from "models/WebSocketServiceResponse";
import showAlert from "functions/showAlert";
import { useTranslation } from "react-i18next";
import { logError } from "functions/logError";

const useGetPositionsStartegyWebSocketHook: GetPositionsStrategy = (
  props: GetPositionsStrategyProps
) => {
  const { setLastUpdate, processResponse, setRunDataAdquistion } = props;
  const [queryRequest, setQueryRequest] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [worker, setWorker] = useState<any>(null);
  const { minutes } = useMapContext();
  const { setOnCommands, clearOnHandlers, setOnEvents, sendCommand } =
    useWebsocketContext();
  const { user } = useUserContext();
  const { t } = useTranslation();

  /** Get the initial position (Websocket need to wait for the connection) */
  useEffect(() => {
    if (!isConnected) return;
    requestDataQuery();
  }, [isConnected]);

  /** Process new adquision request */
  useEffect(() => {
    if (queryRequest > 0) runDataQuery();
  }, [queryRequest]);

  /** Request the positions */
  const requestDataQuery = () => setQueryRequest((prev: number) => prev + 1);

  useEffect(() => {
    setRunDataAdquistion(requestDataQuery);

    setOnCommands(
      WebSocketDataCommands.UpdatePowerProfile,
      (data: WebSocketServiceData) => {
        if (data?.error) {
          showAlert(t("errorPowerProfileUpdated", {}), "error");
          logError("Error in UpdatePowerProfile", data.error)
          return;
        }

        const { imei, powerProfile, result } =
          data as WebSocketServiceDataUpdatePowerProfile;
        if (result) {
          showAlert(
            t("powerProfileUpdated", { imei, powerProfile }),
            "success"
          );
        } else {
          showAlert(
            t("errorPowerProfileUpdated", { imei, powerProfile }),
            "error"
          );
        }
      }
    );

    setOnCommands(
      WebSocketDataCommands.Positions,
      (data: WebSocketServiceData) =>
        processResponse({
          positions: (data as WebSocketServiceDataPosition).positions,
        })
    );

    setOnCommands(
      WebSocketDataCommands.NewData,
      (data: WebSocketServiceData) => {
        requestDataQuery();
      }
    );

    setOnCommands(
      WebSocketDataCommands.KeepAlive,
      (data: WebSocketServiceData) => setLastUpdate()
    );

    setOnCommands(WebSocketDataCommands.Hi, (data: WebSocketServiceData) =>
      setIsConnected(true)
    );

    setOnEvents(WebSocketEvents.onClose, (data: any) => setIsConnected(false));

    return () => {
      clearOnHandlers();
      worker && worker.terminate();
    };
  }, []);

  // REQUEST THE POSITIONS -------------------------------------------------------------------------------------------------
  const runDataQuery = () => {
    if (!isConnected) {
      queryWorkerWithHTTPS({
        worker,
        setWorker,
        minutes,
        user,
        processResponse,
      });
      return;
    }

    sendCommand(WebSocketDataCommands.GetPositions, { interval: minutes });
  };
  // REQUEST THE POSITIONS -------------------------------------------------------------------------------------------------

  /** Return the hook */
  return useGetPositionsStartegyWebSocketHook;
};

export default useGetPositionsStartegyWebSocketHook;
