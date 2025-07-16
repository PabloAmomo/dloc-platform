import HandleConnectionProps from "./HandleConnectionProp";
import HandlePacketResult from "./HandlePacketResult";

type HandleConnection = (
  props: HandleConnectionProps
) => Promise<HandlePacketResult[]>;

export default HandleConnection;
