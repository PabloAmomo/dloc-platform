import { Persistence } from "../../persistence/_Persistence";
import { printMessage } from "../../functions/printMessage";
import { sendWebSocketDataProps } from "../../functions/sendWebSocketData";
import { UserData } from "../../models/UserData";
import { WebSocketDataCommands } from "../../enums/WebSocketDataCommands";
import { WebSocketServiceResponse } from "../../persistence/models/WebSocketServiceResponse";
import getPositionService from "../services/getPositionService";
import WebSocket from "ws";
import updatePowerProfileService from "../services/updatePowerProfileService";

const handleMessage = async (props: HandleMessageProps) => {
  const { webSocket, data, persistence, userData, sendData } = props;

  const commando: WebSocketDataCommands = data.command;
  let returnData: WebSocketServiceResponse = {
    command: commando,
    error: "Unknown command",
  };

  switch (commando) {
    case WebSocketDataCommands.GetPositions:
      const interval = data?.data?.interval ?? -1;
      returnData =
        interval >= 0
          ? await getPositionService({
              webSocket,
              persistence,
              interval,
              userData,
            })
          : { command: commando, error: "Interval not provided" };
      break;

    case WebSocketDataCommands.UpdatePowerProfile:
      const powerProfile = data?.data?.powerProfile;
      const imei = data?.data?.imei;

      if (!powerProfile) {
        returnData = {
          command: commando,
          error: "Power profile type not provided",
        };
        break;
      }
      if (!imei) {
        returnData = { command: commando, error: "Imei not provided" };
        break;
      }

      returnData = await updatePowerProfileService({
        webSocket,
        persistence,
        userData,
        powerProfile,
        imei,
      });
      break;

    default:
      printMessage(`Unknown command: ${data.command}`);
      break;
  }
  sendData({ webSocket, data: returnData });
};

export default handleMessage;

export interface HandleMessageProps {
  webSocket: WebSocket;
  persistence: Persistence;
  userData: UserData;
  sendData: (props: sendWebSocketDataProps) => void;
  data: {
    command: WebSocketDataCommands;
    data?: any;
  };
}
