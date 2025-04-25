import net from "node:net";

const remoteAddress = (conn: net.Socket) : string => {
  return (conn.remoteAddress + ':' + conn.remotePort).replace("::ffff:", "");
}

export { remoteAddress };