import bcrypt from "bcryptjs";
export const generateHash = async ({ plaintext = "", saltRound = process.env.SALT_ROUND} = {}) => {
  return bcrypt.hashSync(plaintext, parseInt(saltRound));
};

export const comparHash = async ({ plaintext = "", hashValue = "" } = {}) => {
  return bcrypt.compareSync(plaintext, hashValue);
};


