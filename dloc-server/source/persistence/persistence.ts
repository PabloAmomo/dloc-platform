import { Persistence } from "../models/Persistence";

var _persistence: Persistence;

const getPersistence = () : Persistence => {
  return _persistence;
};

const setPersistence = (persistence: Persistence) => {
  _persistence = persistence;
};  

export { getPersistence, setPersistence };