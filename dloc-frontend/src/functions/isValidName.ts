import { configApp } from 'config/configApp';

const isValidName = (name: string): boolean => {
  const namePattern = new RegExp(`^(?=.*[A-Za-z0-9].*[A-Za-z0-9])[A-Za-z0-9 ]{2,${configApp.maxLengths.name}}$`);
  return namePattern.test(name);
};

export default isValidName;
