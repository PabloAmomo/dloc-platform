import ServerSocketHandlerPropsInjection from "../../../infraestucture/models/ServerSocketHandlerPropsInjection";
import proto1903HandleClose from "./connection/proto1903HandleClose";
import proto1903HandleEnd from "./connection/proto1903HandleEnd";
import proto1903HandleError from "./connection/proto1903HandleError";
import proto1903HandlePacket from "./connection/proto1903HandlePacket";
import proto1903HandleProcess from "./connection/proto1903HandleProcess";
import proto1903Decoder from "./functions/proto1903Decoder";
import proto1903GetPowerProfileConfig from "./functions/proto1903GetPowerProfileConfig";

const proto1903Injection = (): ServerSocketHandlerPropsInjection => {
  return {
    protocol: "PROTO1903",
    handleProcess: proto1903HandleProcess,
    handlePacket: proto1903HandlePacket,
    handleClose: proto1903HandleClose,
    handleEnd: proto1903HandleEnd,
    handleError: proto1903HandleError,
    decoder: proto1903Decoder as (data: Buffer) => string[],
    getPowerProfileConfig: proto1903GetPowerProfileConfig,
  };
};
export default proto1903Injection;
