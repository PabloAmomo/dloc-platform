import convertByteArrayToHexString from "./functions/convertByteArrayToHexString";
import convertNumberToHexByteArray from "./functions/convertNumberToHexByteArray";
import { printMessage } from "./functions/printMessage";
import jt808GetFrameData from "./services/server-socket/protocolJt808/functions/jt808GetFrameData";
import jt808DecodeLocations from "./services/server-socket/protocolJt808/functions/jt808DecodeLocations";
import jt808CreateFrameData from "./services/server-socket/protocolJt808/functions/jt808CreateFrameData";
import jt808ParseTerminalAttributes from "./services/server-socket/protocolJt808/functions/jt808ParseTerminalAttributesBits";
import jt808ParseCommonResultFromTerminal from "./services/server-socket/protocolJt808/functions/jt808ParseCommonResultFromTerminal";
import jt808DecodeLocationReport from "./services/server-socket/protocolJt808/functions/jt808DecodeLocationReport";
import createHexFromNumberWithNBytes from "./functions/createHexFromNumberWithNBytes";
import jt808CreateCheckParameterSettingPacket from "./services/server-socket/protocolJt808/functions/jt808CreateCheckParameterSettingPacket";
import jt808ParseParamentersSettings from "./services/server-socket/protocolJt808/functions/jt808ParseParamentersSettings";
import toHexWith from "./functions/toHexWith";
import { parseUtcDateTime } from "./functions/parseUtcDateTime";
import jt808CreateGeneralResponse from "./services/server-socket/protocolJt808/functions/jt808CreateGeneralResponse";
import jt808CreateTerminalRegistrationResponsePacket from "./services/server-socket/protocolJt808/functions/jt808CreateTerminalRegistrationResponsePacket";
import jt808CehckUploadPowerSaving from "./services/server-socket/protocolJt808/functions/jt808CehckUploadPowerSaving";
import protoTopinGetFrameData from "./services/server-socket/protocolTopin/functions/protoTopinGetFrameData";

import net from "net";
import protoTopinCreatePositionPacket from "./services/server-socket/protocolTopin/functions/protoTopinCreatePositionPacket";
import { GpsAccuracy } from "./models/GpsAccuracy";
import protoTopinExtractWifiAps from "./services/server-socket/protocolTopin/functions/protoTopinExtractWifiAps";
import { fakePersistence } from "./models/Persistence";
import convertPercentToRSSI from "./functions/convertPercentToRSSI";
import convertRSSIToPercent from "./functions/convertRSSIToPercent";
import toCustomTwoBytes from "./functions/toCustomTwoBytes";
import protoTopinCreateResponse0x57 from "./services/server-socket/protocolTopin/functions/protoTopinCreateResponse0x57";
import { WifiAccessPoint } from "./models/WifiAccessPoint";
import { PowerProfileType, powerProfileTypeAutomatic } from "./enums/PowerProfileType";

// 78 78 01 99 0D 0A
// 78 78 01 14 0D 0A

console.log(powerProfileTypeAutomatic(PowerProfileType.FULL));

// console.log(Buffer.from(createHexFromNumberWithNBytes(10, 2), "hex"));

/*
const value = 110;
console.log(convertPercentToRSSI(value));
console.log(convertRSSIToPercent(-55));

console.log(toCustomTwoBytes(110).toString("hex"));
console.log(toCustomTwoBytes(120).toString("hex"));
console.log(toCustomTwoBytes(60).toString("hex"));
console.log(protoTopinCreateResponse0x57(120, true).toString("hex"));
console.log(protoTopinCreateResponse0x57(60, true).toString("hex"));
console.log(protoTopinCreateResponse0x57(1, false).toString("hex"));

const buffer1 = Buffer.from("7878081925072805233330B1B5065ECC3DC8B422506FDF3F001D1A19DF80432CEADC9ABC3F4C24A43CFA9B8451F4524619DA2F5354AF9796920654A8316289F7D3550300D60700001DC50112F6215600001DC50112F6175A00001DC50112F62156000D0A", "hex");
const buffer2 = Buffer.from("78780818250728052933C8B422506FDF3F8078711882AF4B2CEADC9ABC3F4C24A43CFA9B84509897D103EAA15454AF9796920654A8316289F7D354F4E2C62744B4550300D60700001DC50112F6215600001DC50112F6175A00001DC50112F62156000D0A", "hex");

const wifis1 = protoTopinExtractWifiAps("111111111111111", 8, buffer1);
const wifis2 = protoTopinExtractWifiAps("222222222222222", 8, buffer2);

console.log(`Wifis 1: ${JSON.stringify(wifis1, null, 2)}`);
console.log(`Wifis 2: ${JSON.stringify(wifis2, null, 2)}`);

console.log(`Matching MAC addresses: ${countMatchingMacAddresses(wifis1, wifis2)}`);

function countMatchingMacAddresses(arr1: WifiAccessPoint[], arr2: WifiAccessPoint[]): number {
  const macSet1 = new Set(arr1.map((device) => device.macAddress.toLowerCase()));

  let count = 0;
  for (const device of arr2) {
    if (macSet1.has(device.macAddress.toLowerCase())) count++;
  }
  
  return count;
}
*/

//const packet = "78780818250726121819F4E2C62744B43D24A43CFA9B843FA8316289F7D341A8C0EA1E780446943C96402DB047001D1A19DF8048788102CFC2F148F88E85FF29AB490300D60700001DC50112F60A5400001DC50112F61E6200001DC50112F60A54000D0A";
//const respVal = protoTopinProcessPacket0x18({
//  imei: "123456789012345",
//  remoteAddress: "::1",
//  response: {
//    imei: "123456789012345",
//    error: "",
//    response: [],
//  },
//  topinPacket: {
//    raw: packet,
//    protocolNumber: 0x18,
//    packetLength: 8,
//    informationContent: Buffer.from(
//      packet,
//      "hex"
//    ).slice(4, -2),
//  },
//  persistence: fakePersistence,
//  prefix: "Prefix",
//});
//console.log(`Response: ${JSON.stringify(respVal, null, 2)}`);

// const buffer = Buffer.from(
//   "78780818250726121819F4E2C62744B43D24A43CFA9B843FA8316289F7D341A8C0EA1E780446943C96402DB047001D1A19DF8048788102CFC2F148F88E85FF29AB490300D60700001DC50112F60A5400001DC50112F61E6200001DC50112F60A54000D0A",
//   "hex"
// );
// const packet = buffer.slice(4, -2);
// const response = protoTopinExtractWifiAps("123456789012345", "::1", "Prefix", buffer[2], packet);
// console.log(`Response: ${JSON.stringify(response, null, 2)}`);

/*
// Dirección del servidor y puerto
//const HOST = 'www.365gps.net'; // o IP del servidor
//const PORT = 8005;        // reemplaza con el puerto correcto
const HOST = '82.223.64.197';
const PORT = 24671; // reemplaza con el puerto correcto

// Paquete a enviar (como buffer)
const hexPacketp1 = '78780D010359339078151063280D0A';
const packet1 = Buffer.from(hexPacketp1, 'hex');

// Crear conexión al socket
const client = new net.Socket();



// Manejar respuesta del servidor
interface ServerResponse {
  data: Buffer;
}

client.on('data', (data: Buffer) => {
  const response: ServerResponse = { data };
  console.log('📥 Respuesta recibida:', response.data.toString('hex'));

  client.destroy(); 

});

// Manejar errores
interface SocketError extends Error {
  code?: string;
  errno?: number;
  syscall?: string;
  address?: string;
  port?: number;
}

client.on('error', (err: SocketError) => {
  console.error('❌ Error de conexión:', err.message);
});

// Al cerrar la conexión
client.on('close', () => {
  console.log('🔌 Conexión cerrada');
});

client.connect(PORT, HOST, () => {
  console.log('✅ Conectado al servidor');
  client.write(packet1);
  console.log('📤 Paquete enviado:', packet1.toString('hex'));
});
*/

/*
// Sleep Packet
(response.response as Buffer[]).push(
  jt808CreateFrameData({
    msgType: 0x8135,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter + 102,
    body: Buffer.alloc(0), // No body for this response
  })
);
// Wakeup Packet
(response.response as Buffer[]).push(
  jt808CreateFrameData({
    msgType: 0x8145,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter + 102,
    body: Buffer.alloc(0), // No body for this response
  })
);
*/

// [BUG] Not working and I don't know why. In the future use jt808CreateCheckParameterSettingPacket
//(response.response as Buffer[]).push(
//  jt808CreateMessage(
//    jt808Packet.header.terminalId,
//    counter + 101,
//    0x8106,
//    Buffer.from("0100000001", "hex")
//  )
//);

// 7e8106000033333333300100210200010002967e
// 7E810600050562134176540066010001F142407E

//(response.response as Buffer[]).push(
//  jt808CreateParameterSettingPacket(
//    jt808Packet.header.terminalId,
//    counter + 101,
//    [
//      "0000F116 01 00", // Language setting (0x00 = EN)
//      "0000F118 01 00", // Terminal battery level (0-100 only for check)
//      "0000F142 01 00", // Terminal time zone (0x00 = UTC) - OJO resetea el dispositivo
//
//    ]
//  )
//);

// 7E 10 07 00 04 05 62 13 41 76 54 00 58 40 00 00 00 1C 7E

// const buffer = Buffer.from("7E800100050562134176540001027F999900EF7E", "hex");
// const buffer = Buffer.from("7E0704019E056213417654013C00050100490000000100000000000000000000000000000000000025071114415001040000000004020055050101060100EC15A8A2378B097CAE82A2378B097DAEC8B422506FDFAE30011731010000490000000000000000000000000000000000000000000025071114575701040000000004020061050100060100EC1530B1B5065ECCA4A8A2378B097CAF82A2378B097DAF30011631010000550000000000000000000000000000000000000000000025071117324901040000000004020064050101060100EB2100D60317D7115D0017D7115C1E17D711320F17D711330E17D7115B0E17D70F5C0D30011731010000550000040000000000000000000000000000000000000025071117325401040000000004020064050101060100EB2100D60317D7115D0017D7115C1E17D711320F17D711330E17D7115B0E17D70F5C0D30011731010000550000004000000000000000000000000000000000000025071117325701040000000004020064050101060100EB2100D60317D7115D0017D7115C1E17D711320F17D711330E17D7115B0E17D70F5C0D300117310100A67E", "hex");
// const buffer = Buffer.from("7E02100007056213417654017364250711145301617E", "hex");
// const buffer = Buffer.from("7E0200005705621341765402590000000000000000000000000000000000000000000025071121092901040000000004020150050100060100EC23943C96402DB0AF8078711882AFAEA8A2378B097CA682A2378B097DA7C8B422506FDFB2300119310101D47E", "hex");
// const buffer = Buffer.from("7E100700040562134176540058400000001C7E", "hex");

// Terminal registration
//const buffer = Buffer.from(
//  "7E010000210562134176540000002A08523132333435534B2D30312020203030303030303001D4C14238383838383C7E",
//  "hex"
//);
//const response = jt808GetFrameData(buffer);
//console.log(response);
//const responseVal = jt808CreateTerminalRegistrationResponsePacket(
//  response.header.terminalId,
//  1,
//  response.header.msgSerialNumber
//);
//console.log(`Response: ${responseVal.toString("hex")}`);

// Power Saving Mode
//const buffer = Buffer.from("7E011200060562134176540009080000000000037E", "hex");
//const response = jt808GetFrameData(buffer);
//console.log(response);
//const powerSaveResponse = jt808CehckUploadPowerSaving(response.body, "IMEI", "remoteAddress");
//console.log(`Power Save Response: ${JSON.stringify(powerSaveResponse)}`);

// Location (Single Location)
//const buffer = Buffer.from("7E020100570562134176540234007200000000000C0000000000000000000000000000000025071120465701040000000004020154050101060100EB2100D60317D7115D0017D7115C2717D7115B1C17D70F5C1C17D711331717D70F5B15300119310101107E", "hex");
//const buffer = Buffer.from("7E02010052056213417654001C000000000000000C0000000000000000000000000000000025072020055301040000000004020157050101060100EC1C30B1B5065ECCAC862C895F3DB3B5A8A2378B097CB382A2378B097DB3300118310100FC7E","hex");
//const response = jt808GetFrameData(buffer);
//console.log(response);
//const locations = jt808DecodeLocations(response.body, false, "");

// Common response from terminal
//const buffer = Buffer.from("7E0001000505621341765401BE0067810300497E", "hex")
//const response = jt808GetFrameData(buffer);
//console.log(response);
//const reponseCommon = jt808ParseCommonResultFromTerminal(response.body);
//console.log(`Response: ${JSON.stringify(reponseCommon, null, 2)}`);

// Location Report
//const buffer = Buffer.from("7E02000049056213417654019F000000000000000002601791002FA90A00000000000025071317280801040000000504020064050101060100EC15C8B422506FDFBFA8A2378B097CB082A2378B097DAF300114310100157E", "hex");
//const response = jt808GetFrameData(buffer);
//console.log(response);
//const responseLoc = {
//        count: 1,
//        locations: [jt808DecodeLocationReport(response.body)],
//      };
//console.log(`Packet count: ${responseLoc.count}`);
//console.log(`locations: ${JSON.stringify(responseLoc.locations, null, 2)}`);

// Locations
// const buffer = Buffer.from("7E0704019E056213417654013C00050100490000000100000000000000000000000000000000000025071114415001040000000004020055050101060100EC15A8A2378B097CAE82A2378B097DAEC8B422506FDFAE30011731010000490000000000000000000000000000000000000000000025071114575701040000000004020061050100060100EC1530B1B5065ECCA4A8A2378B097CAF82A2378B097DAF30011631010000550000000000000000000000000000000000000000000025071117324901040000000004020064050101060100EB2100D60317D7115D0017D7115C1E17D711320F17D711330E17D7115B0E17D70F5C0D30011731010000550000040000000000000000000000000000000000000025071117325401040000000004020064050101060100EB2100D60317D7115D0017D7115C1E17D711320F17D711330E17D7115B0E17D70F5C0D30011731010000550000004000000000000000000000000000000000000025071117325701040000000004020064050101060100EB2100D60317D7115D0017D7115C1E17D711320F17D711330E17D7115B0E17D70F5C0D300117310100A67E", "hex");
//const response = jt808GetFrameData(buffer);
//console.log(response);
//const responseLoc = jt808DecodeLocations(response.body, true);
//console.log(`Packet count: ${responseLoc.count}`);
//console.log(`locations: ${JSON.stringify(responseLoc.locations, null, 2)}`);

// Atributes
//const buffer = Buffer.from("7E01070032056213417654000C14383933343034383432353032303431303234323F0547462D323216534C5F534B20323032312F30332F30362031383A31316E7E", "hex");
//const response = jt808GetFrameData(buffer);
//console.log(response);
//const responseVal = jt808ParseTerminalAttributes(response.body);
//console.log(responseVal);

// Check Parameter Setting Packet
//const buffer = Buffer.from("7E0104003405621341765400DE00670400000001040000003C000000481400000000000000000000000000000000000000000000F10404000000B40000F1180155067E", "hex");
//const response = jt808GetFrameData(buffer);
//console.log(response);
//const responseVal = jt808ParseParamentersSettings("", "", response.body);
//for (const param of responseVal.parameters) {
//  console.log(`Parameter ID: ${toHexWith(param.id, 4)}, Length: ${param.length}, Value: ${param.value.toString("hex")}`);
//}
//console.log(`Response Settings: ${JSON.stringify(responseVal.paramatersSettings, null, 2)}`);

//console.log(`Packet count: ${count}`);
//console.log(`locations: ${JSON.stringify(locations, null, 2)}`);

/*
dloc-server-socket-protocoljt808        | 01/08/2025 14:39:12: [000056213417654] (31.221.183.75:3348) ✅ 🧑🏽‍💻 Terminal general response (202 [00CA] -> result: ✅ success (33027))
dloc-server-socket-protocoljt808        | 01/08/2025 14:39:12: [000056213417654] (31.221.183.75:3348) ⚠️  no response to send for packet [7E 00 01 00 05 05 62 13 41 76 54 00 0D 0...]
dloc-server-socket-protocoljt808        | 01/08/2025 14:39:12: [000056213417654] (31.221.183.75:3348) ⚡️ power profile for device [automatic_full] is not changed
dloc-server-socket-protocoljt808        | 01/08/2025 14:39:12: [000056213417654] (31.221.183.75:3348) ⚡️ next power profile change in 299 seconds
dloc-server-socket-protocoljt808        | 01/08/2025 14:39:12: [000056213417654] (31.221.183.75:3348) 🔋 Battery level ✅ 91% (Updated on device)

const newFrame = jt808CreateFrameData({
  msgType: 0x8201,
  terminalId: Buffer.from(response.header.terminalId, "hex"),
  msgSerialNumber: 1,
  body: Buffer.alloc(0),
});

printMessage(` 📡 SENDING ----> [${newFrame.toString("hex")}].`);

const respons2 = jt808GetFrameData(newFrame);
printMessage(` 📡 RECEIVED NEW ----> [${respons2.raw}].`);
console.log(respons2);
*/
