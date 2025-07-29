const isEmail = (email: string): boolean => {
  const isValid : boolean = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email);
  return isValid;
}

export default isEmail;