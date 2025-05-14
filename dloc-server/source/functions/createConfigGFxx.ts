import powerProfileConfigGFxx from "./powerProfileConfig";
import { PowerProfileType } from "./powerProfileType";
import { uniqueId } from "./uniqueId";

function createConfigGFxx(
  powerProfileType: PowerProfileType
): string {
  let response = "";
  const timestamp: string = uniqueId();
  const { heartBeatSec, uploadSec, ledState } = powerProfileConfigGFxx(
    powerProfileType
  );

  // Set heartbeat packet interval (issue: dp03, reply: cp03)
  response += `TRVDP03${timestamp},${heartBeatSec}#`;
  // Set LED display switch (up: AP92; down: bp92)∫
  response += `TRVBP92${parseInt(timestamp) + 1}${ledState}#`;
  // Set upload interval (downlink protocol No.: wp02, response: xp02)
  response += `TRVWP02${parseInt(timestamp) + 2}${uploadSec}#`;
  // Add force report location interval
  response += "TRVBP20#";

  return response;
}
export default createConfigGFxx;
