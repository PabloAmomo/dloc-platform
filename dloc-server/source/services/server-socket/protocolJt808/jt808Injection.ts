import ServerSocketHandlerPropsInjection from "../../../infraestucture/models/ServerSocketHandlerPropsInjection";
import jt808HandlePacket from "./connection/jt808HandlePacket";
import jt808HandleProcess from "./connection/jt808HandleProcess";
import jt808Decoder from "./functions/jt808Decoder";
import jt808GetPowerProfileConfig from "./config/jt808GetPowerProfileConfig";
import protocolHandleClose from "../../../functions/protocolHandleClose";
import protocolHandleError from "../../../functions/protocolHandleError";
import protocolHandleEnd from "../../../functions/protocolHandleEnd";

const jt808Injection = (): ServerSocketHandlerPropsInjection => {
  return {
    protocol: "JT808",
    handleProcess: jt808HandleProcess,
    handlePacket: jt808HandlePacket,
    handleClose: protocolHandleClose,
    handleEnd: protocolHandleEnd,
    handleError: protocolHandleError,
    decoder: jt808Decoder as (data: Buffer) => Buffer[],
    getPowerProfileConfig: jt808GetPowerProfileConfig,
  };
};
export default jt808Injection;
