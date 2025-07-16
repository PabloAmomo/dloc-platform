import { printMessage } from "../../../../functions/printMessage";

const JT808_MESSAGES_CODES = {
  0x0001: "🧑🏽‍💻 Terminal general response",
  0x0002: "❤️  Terminal heartbeat",
  0x0003: "🔚 Terminal Logout",
  0x0104: "⚙️  Check terminal parameter response",
  0x0105: "💤 Sleep notificationSleep notification",
  0x0107: "✅ Check terminal attribute response",
  0x0108: "🌟 Sleep wake up notification",
  0x0112: "⚡️ Upload the power saving mode modified by SMS to the server",
  0x1007: "🔥 Unknown command 10 07",
  0x0100: "📋 Terminal registration",
  0x0102: "🔐 Terminal authentication",
  0x0704: "📦 Positioning data batch upload",
  0x0201: "📍 Location information query response",
  0x0200: "📍 Location report",
  0x0109: "⏰ Request synchronization time",
  0x0210: "🔋 Battery level update when sleep",
};

const jt808PrintMessage = (imeiTemp: string, remoteAddress: string, msgType: number, addData: string = "") => {
      printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ ${
        JT808_MESSAGES_CODES[msgType as keyof typeof JT808_MESSAGES_CODES]
      } ${addData ? ` (${addData}) ` : ""}`
    );
}

export default jt808PrintMessage;