const isValidVerificationCode = (code: string): boolean => {
  const codePattern = new RegExp(`^[a-zA-Z0-9]{2,}$`);
  return codePattern.test(code);
};

export default isValidVerificationCode;
