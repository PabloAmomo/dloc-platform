import { Persistence } from './_Persistence';

var _persistence: Persistence;

const getPersistence = (): Persistence => _persistence;

const setPersistence = (persistence: Persistence) => {
  _persistence = persistence;
};

export { getPersistence, setPersistence };
