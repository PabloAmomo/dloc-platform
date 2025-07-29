import { PowerProfileType } from './../../enums/PowerProfileType';
import { UpdatePowerProfileResult } from "../../persistence/models/UpdatePowerProfileResult";
import { updatePowerProfile as updatePowerProfileService } from "../../persistence/_Persistence";
import { Persistence } from "../../persistence/_Persistence";
import { UserData } from "../../models/UserData";
import { WebSocketDataCommands } from "../../enums/WebSocketDataCommands";
import { WebSocketServiceResponse } from "../../persistence/models/WebSocketServiceResponse";
import WebSocket from "ws";

const updatePowerProfileService = async (
  props: updatePowerProfileServiceProps
): Promise<WebSocketServiceResponse> => {
  const {
    persistence,
    userData,
    imei,
    powerProfile,
  }: updatePowerProfileServiceProps = props;

  const updatePowerProfileResult: UpdatePowerProfileResult =
    await persistence.updatePowerProfile(
      imei,
      powerProfile,
      userData.userId
    );

  return updatePowerProfileResult?.error
    ? {
        command: WebSocketDataCommands.UpdatePowerProfile,
        error: updatePowerProfileResult.error,
      }
    : {
        command: WebSocketDataCommands.UpdatePowerProfile,
        data: { result: true, imei, powerProfile },
      };
};

export default updatePowerProfileService;

interface updatePowerProfileServiceProps {
  webSocket: WebSocket;
  persistence: Persistence;
  userData: UserData;
  imei: string;
  powerProfile: PowerProfileType;
}
