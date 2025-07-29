import { printMessage } from "../../../../functions/printMessage";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";

const protoTopinProcessPacket0x80: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} ✅ Manual position received from device (no response expected)`);

  if (!topinPacket.informationContent || topinPacket.informationContent.length > 0) {
    let message = `🤷‍♂️ unknown`;
    if (topinPacket.informationContent[0] === 0x01) message = `⌛️ Time is incorrect`;
    else if (topinPacket.informationContent[0] === 0x02) message = `🗼 Less than 2 LBS`;
    else if (topinPacket.informationContent[0] === 0x03) message = `📶 Less than 3 Wifi`;
    else if (topinPacket.informationContent[0] === 0x04) message = `🗼 LBS more than 3 times`;
    else if (topinPacket.informationContent[0] === 0x05) message = `📡 Same LBS and Wifi data 🗼🧭`;
    else if (topinPacket.informationContent[0] === 0x06) message = `🚫 Prohibits LBS uploading, without Wifi`;
    else if (topinPacket.informationContent[0] === 0x07) message = `📍 GPS spacing is less than 50 meters`;
    printMessage(`${prefix} 🙋 Manual Position: ${message}`);
  }

  // TODO: [FEATURE] topinPacket.informationContent[0] === 0x05 re-process last LBS and Wifi data
  
  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x80;
