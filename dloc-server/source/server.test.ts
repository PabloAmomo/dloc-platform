
import convertByteArrayToHexString from "./functions/convertByteArrayToHexString";
import convertNumberToHexByteArray from "./functions/convertNumberToHexByteArray";
import { printMessage } from "./functions/printMessage";
import jt808GetFrameData from "./services/server-socket/protocol808/functions/jt808GetFrameData";
import jt808DecodeLocations from "./services/server-socket/protocol808/functions/jt808DecodeLocations";
import jt808CreateFrameData from "./services/server-socket/protocol808/functions/jt808CreateFrameData";
import jt808ParseTerminalAttributes from "./services/server-socket/protocol808/functions/jt808ParseTerminalAttributesBits";
import jt808ParseCommonResultFromTerminal from "./services/server-socket/protocol808/functions/jt808ParseCommonResultFromTerminal";
import jt808DecodeLocationReport from "./services/server-socket/protocol808/functions/jt808DecodeLocationReport";
import createHexFromNumberWithNBytes from "./functions/createHexFromNumberWithNBytes";
import jt808CreateCheckParameterSettingPacket from "./services/server-socket/protocol808/functions/jt808CreateCheckParameterSettingPacket";
import jt808ParseParamentersSettings from "./services/server-socket/protocol808/functions/jt808ParseParamentersSettings";
import toHexWith from "./functions/toHexWith";
import { parseUtcDateTime } from "./functions/parseUtcDateTime";
import jt808CreateGeneralResponse from "./services/server-socket/protocol808/functions/jt808CreateGeneralResponse";
import jt808CreateTerminalRegistrationResponsePacket from "./services/server-socket/protocol808/functions/jt808CreateTerminalRegistrationResponsePacket";
import jt808CehckUploadPowerSaving from "./services/server-socket/protocol808/functions/jt808CehckUploadPowerSaving";
import protoTopinGetFrameData from "./services/server-socket/protocolTopin/functions/protoTopinGetFrameData";

import net from 'net';
import protoTopinCreatePositionPacket from "./services/server-socket/protocolTopin/functions/protoTopinCreatePositionPacket";
import { GpsAccuracy } from "./models/GpsAccuracy";
import protoTopinCreatePositionPacketEx from "./services/server-socket/protocolTopin/functions/protoTopinCreatePositionPacketEx";

// 7878 0818 250726 144118 
// A8 A2 37 8B 09 7C 2F 
// C8 B4 22 50 6F DF 3F 
// 94 3C 96 40 2D B0 40 
// 00 1D 1A 19 DF 80 48 
// 24 A4 3C FA 9B 84 53 
// B0 95 75 FD 32 26 55 
// 44 3B 14 4D D6 40 56 
// 60 83 E7 62 5F F6 57 
// 03 
// 00 D6 07 00 
// 00 1D C5 01 12 F6 21 5E 00 
// 00 1D C5 01 12 F6 21 5E 00 
// 00 1D C5 01 12 F6 21 5E 00 
// 0D0A

// 7878 0818 250726 145026 
// 94 3C 96 40 2D B0 3E 
// C8 B4 22 50 6F DF 3F 
// 00 1D 1A 19 DF 80 45 
// 24 A4 3C FA 9B 84 54 
// B0 95 75 FD 32 26 54 
// FA 92 BF C7 56 6F 54 
// 44 3B 14 4D D6 40 55 
// 2C EA DC 9A BC 3F 58 
// 03 00 
// D6 07 00 
// 00 1D C5 01 12 F6 21 5D 00 
// 00 1D C5 01 12 F6 21 5D 00 
// 00 1D C5 01 12 F6 21 5D 00 
// 0D0A

// 7878 0818 250726 155143 
// A8 A2 37 8B 09 7C 30 
// 94 3C 96 40 2D B0 41 
// C8 B4 22 50 6F DF 44 
// 00 1D 1A 19 DF 80 49 
// F4 E2 C6 27 44 B4 51 
// B0 95 75 FD 32 26 54 
// FA 92 BF C7 56 6F 55 
// 44 3B 14 4D D6 40 55 
// 03 
// 00 D6 07 00 
// 00 1D C5 01 12 F6 21 5E 00 
// 00 1D C5 01 12 F6 21 5E 00 
// 00 1D C5 01 12 F6 21 5E 00 
// 0D0A

// 7878 0818 250726 160913 
// C8 B4 22 50 6F DF 41 
// 00 1D 1A 19 DF 80 48 
// 94 3C 96 40 2D B0 4B 
// 52 C3 A2 87 07 09 4C 
// B0 95 75 FD 32 26 51 
// F4 E2 C6 27 44 B4 51 
// 24 A4 3C FA 9B 84 53 
// 44 3B 14 4D D6 40 55 
// 03 
// 00 D6 07 00 
// 00 1D C5 01 12 62 14 6C 00 
// 00 1D C5 01 12 62 14 6C 00 
// 00 1D C5 01 12 62 14 6C 00 
// 0D0A

// 7878 0818 250726 161759 
// C8 B4 22 50 6F DF 3F 
// 80 78 71 18 82 AF 48 
// 94 3C 96 40 2D B0 4B 
// B0 95 75 FD 32 26 51 
// 30 B1 B5 06 5E CC 55 
// FA 92 BF C7 56 6F 55 
// 2C EA DC 9A BC 3F 58 
// 60 83 E7 62 5F F6 59 
// 03 
// 00 D6 07 00 
// 00 1D C5 01 12 F6 21 5F 00 
// 00 1D C5 01 12 F6 21 5F 00 
// 00 1D C5 01 12 F6 21 5F 00 
// 0D0A

// 7878 0818 250726 182033 
// A8 A2 37 8B 09 7C 34 
// C8 B4 22 50 6F DF 41 
// 80 78 71 18 82 AF 47 
// 00 1D 1A 19 DF 80 48 
// 30 B1 B5 06 5E CC 52 
// 24 A4 3C FA 9B 84 53 
// FA 92 BF C7 56 6F 55 
// 98 97 D1 03 EA A1 59 
// 03 
// 00 D6 07 00 
// 00 1D C5 01 12 F6 21 5D 00 
// 00 1D C5 01 12 F6 21 5D 00 
// 00 1D C5 01 12 F6 21 5D 00 
// 0D0A

// 7878 0818 250726 183804 
// A8 A2 37 8B 09 7C 32 
// C8 B4 22 50 6F DF 41 
// 80 78 71 18 82 AF 47 
// 00 1D 1A 19 DF 80 48 
// 94 3C 96 40 2D B0 4A 
// B0 95 75 FD 32 26 54 
// 24 A4 3C FA 9B 84 54 
// FA 92 BF C7 56 6F 55 
// 03 
// 00 D6 07 00 
// 00 1D C5 01 12 F6 21 5D 00 
// 00 1D C5 01 12 F6 17 6E 00 
// 00 1D C5 01 12 F6 21 5D 00 
// 0D0A

// 7878 0818 250726 185559 
// A8 A2 37 8B 09 7C 32 
// C8 B4 22 50 6F DF 41 
// 00 1D 1A 19 DF 80 46 
// 80 78 71 18 82 AF 47 
// 94 3C 96 40 2D B0 4B 
// A8 31 62 89 F7 D3 55 
// 92 B6 87 80 BC 43 58 
// 60 83 E7 62 5F F6 59 
// 03 
// 00 D6 07 00 
// 00 1D C5 01 12 F6 21 5C 00 
// 00 1D C5 01 12 F6 17 6C 00 
// 00 1D C5 01 12 F6 21 5C 00 
// 0D0A

const buffer = Buffer.from("78780818250726121819F4E2C62744B43D24A43CFA9B843FA8316289F7D341A8C0EA1E780446943C96402DB047001D1A19DF8048788102CFC2F148F88E85FF29AB490300D60700001DC50112F60A5400001DC50112F61E6200001DC50112F60A54000D0A", "hex");
const packet = buffer.slice(4, 22);
const response = protoTopinCreatePositionPacketEx(
  "123456789012345",
  "::1",  
  "Prefix",
  packet,
  GpsAccuracy.gps,
  "{}"
);
console.log(`Response: ${JSON.stringify(response, null, 2)}`);

// 78780819250726090759A8A2378B097C3BF4E2C62744B445A8C0EA1E78444524A43CFA9B84482CEADC9ABC3F4D9897D103EAA14F30B1B5065ECC5164CC224BA2DC540300D60700001DC50112F61E5700001DC50112F60A6000001DC50112F61E57000D0A
// 7878151019071A092F2A9604468F5F0055C809003400002E000D0A
// 7878151119071A0908089A044694D50055C947003400004F000D0A

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
