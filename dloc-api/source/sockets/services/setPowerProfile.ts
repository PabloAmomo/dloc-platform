import { PowerProfileType } from "./../../enums/PowerProfileType";
import { UpdatePowerProfileResult } from "./../../persistence/models/UpdatePowerProfileResult";
import { updatePowerProfile } from "./../../persistence/_Persistence";
import { Persistence } from "../../persistence/_Persistence";
import { UserData } from "../../models/UserData";
import { WebSocketDataCommands } from "../../enums/WebSocketDataCommands";
import { WebSocketServiceResponse } from "../../persistence/models/WebSocketServiceResponse";
import WebSocket from "ws";

const updatePowerProfile = async (
  props: updatePowerProfileProps
): Promise<WebSocketServiceResponse> => {
  const {
    persistence,
    userData,
    imei,
    powerProfileType,
  }: updatePowerProfileProps = props;

  const updatePowerProfileResult: UpdatePowerProfileResult =
    await persistence.updatePowerProfile(
      imei,
      powerProfileType,
      userData.userId
    );

  return updatePowerProfileResult?.error
    ? {
        command: WebSocketDataCommands.UpdatePowerProfile,
        error: updatePowerProfileResult.error,
      }
    : {
        command: WebSocketDataCommands.UpdatePowerProfile,
        data: { result: true },
      };
};

export default updatePowerProfile;

interface updatePowerProfileProps {
  webSocket: WebSocket;
  persistence: Persistence;
  userData: UserData;
  imei: string;
  powerProfileType: PowerProfileType;
}
