const REGEX_PACKET_WIFI =
  /(TRVYP1[45])(\d{6})([AV])(\d{4}.\d{4})([NS])(\d{5}\.\d{4})([EW])(\d{3}.\d)(\d{6})(\d{3}\.\d\d)(\d{3})(\d{3})(\d{3})([012])(0[012])(0[012])([012])([012])([012])(\d)([0-4]),(\d+),(\d+),(\d+),(\d+),(.*)#/;
const REGEX_PACKET_NO_WIFI =
  /(TRVYP1[45])(\d{6})([AV])(\d{4}.\d{4})([NS])(\d{5}\.\d{4})([EW])(\d{3}.\d)(\d{6})(\d{3}\.\d\d)(\d{3})(\d{3})(\d{3})([012])(0[012])(0[012])([012])([012])([012])(\d)([0-4]),(\d+),(\d+),(\d+),(\d+)#/;
const REGEX_PACKET_SIMPLE =
  /(TRVYP1[45])(\d{6})([AV])(\d{4}.\d{4})([NS])(\d{5}\.\d{4})([EW])(\d{3}.\d)(\d{6})(\d{3}\.\d\d)(\d{3})(\d{3})(\d{3})(\d{2})#/;
  const REGEX_PACKET_ONLY_POS =
  /(TRVYP1[45])(\d{6})([AV])(\d{4}.\d{4})([NS])(\d{5}\.\d{4})([EW])(\d{3}.\d)(\d{6})#/;

const REGEX_PACKETS = [
  REGEX_PACKET_WIFI,
  REGEX_PACKET_NO_WIFI,
  REGEX_PACKET_SIMPLE,
  REGEX_PACKET_ONLY_POS,
];

export { REGEX_PACKETS }
