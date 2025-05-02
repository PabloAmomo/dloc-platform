import net from "node:net";

const getRemoteAddress = (conn: net.Socket) : string => {
  return (conn.remoteAddress + ':' + conn.remotePort).replace("::ffff:", "");
}

export { getRemoteAddress };