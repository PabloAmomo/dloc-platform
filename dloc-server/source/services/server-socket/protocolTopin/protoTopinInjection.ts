import ServerSocketHandlerPropsInjection from "../../../infraestucture/models/ServerSocketHandlerPropsInjection";
import protoTopinHandlePacket from "./connection/protoTopinHandlePacket";
import protoTopinHandleProcess from "./connection/protoTopinHandleProcess";
import protoTopinDecoder from "./functions/protoTopinDecoder";
import protoTopinGetPowerProfileConfig from "./config/protoTopinGetPowerProfileConfig";
import protocolHandleClose from "../../../functions/protocolHandleClose";
import protocolHandleError from "../../../functions/protocolHandleError";
import protocolHandleEnd from "../../../functions/protocolHandleEnd";

const protoTopinInjection = (): ServerSocketHandlerPropsInjection => {
  return {
    protocol: "TOPIN",
    handleProcess: protoTopinHandleProcess,
    handlePacket: protoTopinHandlePacket,
    handleClose: protocolHandleClose,
    handleEnd: protocolHandleEnd,
    handleError: protocolHandleError,
    decoder: protoTopinDecoder as (data: Buffer) => Buffer[],
    getPowerProfileConfig: protoTopinGetPowerProfileConfig,
  };
};
export default protoTopinInjection;
