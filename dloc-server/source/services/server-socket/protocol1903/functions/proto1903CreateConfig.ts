import { PowerProfileType } from '../../../../enums/PowerProfileType';
import padNumberLeft from '../../../../functions/padNumberLeft';
import proto1903PowerProfileConfig from './proto1903GetPowerProfileConfig';
import { uniqueId } from '../../../../functions/uniqueId';

function proto1903CreateConfig(
  powerProfileType: PowerProfileType
): string {
  let response = "";
  const timestamp: string = uniqueId();
  const { heartBeatSec, uploadSec, ledState } = proto1903PowerProfileConfig(
    powerProfileType
  );

  // Set heartbeat packet interval (issue: dp03, reply: cp03)
  response += `TRVDP03${timestamp},${heartBeatSec}#`;
  // Set LED display switch (up: AP92; down: bp92)
  response += `TRVBP92${parseInt(timestamp) + 1}${ledState ? "1" : "0"}#`;
  // Set upload interval (downlink protocol No.: wp02, response: xp02)
  response += `TRVWP02${parseInt(timestamp) + 2}${padNumberLeft(uploadSec,3,"0")}#`;
  // Add force report location interval
  response += "TRVBP20#";

  return response;
}
export default proto1903CreateConfig;
