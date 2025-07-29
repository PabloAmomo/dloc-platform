import ServerSocketHandlerPropsInjection from "../../../infraestucture/models/ServerSocketHandlerPropsInjection";
import protoTopinHandleClose from "./connection/protoTopinHandleClose";
import protoTopinHandleEnd from "./connection/protoTopinHandleEnd";
import protoTopinHandleError from "./connection/protoTopinHandleError";
import protoTopinHandlePacket from "./connection/protoTopinHandlePacket";
import protoTopinHandleProcess from "./connection/protoTopinHandleProcess";
import protoTopinDecoder from "./functions/protoTopinDecoder";
import protoTopinGetPowerProfileConfig from "./functions/protoTopinGetPowerProfileConfig";

const protoTopinInjection = (): ServerSocketHandlerPropsInjection => {
  return {
    protocol: "TOPIN",
    handleProcess: protoTopinHandleProcess,
    handlePacket: protoTopinHandlePacket,
    handleClose: protoTopinHandleClose,
    handleEnd: protoTopinHandleEnd,
    handleError: protoTopinHandleError,
    decoder: protoTopinDecoder as (data: Buffer) => Buffer[],
    getPowerProfileConfig: protoTopinGetPowerProfileConfig,
  };
};
export default protoTopinInjection;
