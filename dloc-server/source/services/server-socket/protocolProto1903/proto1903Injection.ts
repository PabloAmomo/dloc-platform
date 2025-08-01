import ServerSocketHandlerPropsInjection from "../../../infraestucture/models/ServerSocketHandlerPropsInjection";
import proto1903HandlePacket from "./connection/proto1903HandlePacket";
import proto1903HandleProcess from "./connection/proto1903HandleProcess";
import proto1903Decoder from "./functions/proto1903Decoder";
import proto1903GetPowerProfileConfig from "./config/proto1903GetPowerProfileConfig";
import protocolHandleClose from "../../../functions/protocolHandleClose";
import protocolHandleError from "../../../functions/protocolHandleError";
import protocolHandleEnd from "../../../functions/protocolHandleEnd";

const proto1903Injection = (): ServerSocketHandlerPropsInjection => {
  return {
    protocol: "PROTO1903",
    handleProcess: proto1903HandleProcess,
    handlePacket: proto1903HandlePacket,
    handleClose: protocolHandleClose,
    handleEnd: protocolHandleEnd,
    handleError: protocolHandleError,
    decoder: proto1903Decoder as (data: Buffer) => string[],
    getPowerProfileConfig: proto1903GetPowerProfileConfig,
  };
};
export default proto1903Injection;
