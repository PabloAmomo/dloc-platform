import { Direction } from '../models/Direction';

const convertDegressToDecimal = (degrees: number, minutes: number, seconds: number, direction: Direction) => {
  var dd = degrees + (minutes != 0 ? minutes / 60 : 0) + (seconds != 0 ? seconds / 3600 : 0);
  if (direction?.toUpperCase() == 'S' || direction?.toUpperCase() == 'W') dd = dd * -1;
  return dd;
};

export { convertDegressToDecimal };
