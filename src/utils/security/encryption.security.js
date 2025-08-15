import CryptoJS from "crypto-js";

export const encrypt = async ({ plainText = "", secretKey = process.env.ENC_SECRET}) => {
  return CryptoJS.AES.encrypt(plainText, secretKey).toString();
};
export const decrypt = async ({ cipherText = "", secretKey = process.env.ENC_SECRET}) => {
  return CryptoJS.AES.decrypt(cipherText, secretKey).toString(
    CryptoJS.enc.Utf8
  );
};
