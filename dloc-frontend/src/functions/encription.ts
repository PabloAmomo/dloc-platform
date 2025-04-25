import CryptoJS from 'crypto-js';

const createPasswordKey = (password: string) => {
  const hash: string = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
  const key: string = CryptoJS.enc.Utf8.parse(hash).toString();
  return key;
};

const encription = {
  encrypt: (message: string, password: string) => {
    const key = createPasswordKey(password);
    return CryptoJS.AES.encrypt(message, key).toString();
  },

  decrypt: (message: string, password: string) => {
    const key = createPasswordKey(password);
    return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
  },
};

export default encription;
