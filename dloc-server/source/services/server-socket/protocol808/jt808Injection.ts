import ServerSocketHandlerPropsInjection from "../../../infraestucture/models/ServerSocketHandlerPropsInjection";
import jt808HandleClose from "./connection/jt808HandleClose";
import jt808HandleEnd from "./connection/jt808HandleEnd";
import jt808HandleError from "./connection/jt808HandleError";
import jt808HandlePacket from "./connection/jt808HandlePacket";
import jt808HandleProcess from "./connection/jt808HandleProcess";
import jt808Decoder from "./functions/jt808Decoder";
import jt808GetPowerProfileConfig from "./config/jt808GetPowerProfileConfig";

const jt808Injection = (): ServerSocketHandlerPropsInjection => {
  return {
    protocol: "JT808",
    handleProcess: jt808HandleProcess,
    handlePacket: jt808HandlePacket,
    handleClose: jt808HandleClose,
    handleEnd: jt808HandleEnd,
    handleError: jt808HandleError,
    decoder: jt808Decoder as (data: Buffer) => Buffer[],
    getPowerProfileConfig: jt808GetPowerProfileConfig,
  };
};
export default jt808Injection;
