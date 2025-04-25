import { Encription } from '../models/Encription';

var _encription: Encription;

const getEncription = (): Encription => _encription;

const setEncription = (encription: Encription) => {
  _encription = encription;
};

export { getEncription, setEncription };
