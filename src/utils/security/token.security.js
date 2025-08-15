import { roleEnum, UserModel } from "../../DB/models/User.Model.js";
import * as DBService from "../../DB/db.service.js"
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { RevokeTokenModel } from "../../DB/models/Revoke.token.mode;.js";

export const signatureTypeEnum = { system: "System", bearer: "Bearer" };
export const tokenTypeEnum = { access: "access", refresh: "refresh" };


export const generateToken = async ({
  payload = {},
  signature = process.env.ACCESS_TOKEN_USER_SIGNATURE,
  option = {},
}) => {
  return jwt.sign(payload, signature, option);
};

export const verifyToken = async ({
  token = "",
  secretOrPrivateKey = process.env.ACCESS_TOKEN_USER_SIGNATURE,
} = {}) => {
  // console.log({ token, secret: secretOrPrivateKey });
  return jwt.verify(token, secretOrPrivateKey);
};

export const getSignatures = async ({
  signatureLevel = signatureTypeEnum.bearer,
} = {}) => {
  const signature = {
    access_signature: undefined,
    refresh_signature: undefined,
  };

  switch (signatureLevel) {
    case signatureTypeEnum.system:
      signature.access_signature = process.env.ACCESS_TOKEN_SYSTEM_SIGNATURE;
      signature.refresh_signature = process.env.REFRESH_TOKEN_SYSTEM_SIGNATURE;
      break;

    default:
      signature.access_signature = process.env.ACCESS_TOKEN_USER_SIGNATURE;
      signature.refresh_signature = process.env.REFRESH_TOKEN_USER_SIGNATURE;
      break;
  }
  return signature;
};

export const decodedToken = async ({authorization="" , tokenType = tokenTypeEnum.access ,next } = {}) => {
    const [bearer, token] = authorization?.split(" ") || [];
    // console.log({ bearer, token });
    if (!token || !bearer) {
      return next(new Error("missing token parts"));
    }
    const signature = await getSignatures({ signatureLevel: bearer});
    const decode = await verifyToken({
      token: token,
      secretOrPrivateKey: 
      tokenType === tokenTypeEnum.access ? signature.access_signature : signature.refresh_signature
    });
    if (!decode?._id) {
      return next(new Error("In-valid token", { cause: 400 }));
    }
    // logout \\ 
    if(await DBService.findOne({model:RevokeTokenModel , filter:{idToken : decode.jti}})){
      return next(new Error("User have signed out from this device" , {cause :401}))
    }
    // logout \\ 
    const user = await DBService.findById({ model: UserModel, id: decode._id });
    if (!user) {
      return next(new Error("Not register account", { cause: 404 }));
    }
    // console.log({iat : decode.iat * 1000 , userCredential : new Date(user.changeLoginCredentials).getTime()});
    if(user.changeLoginCredentials && decode.iat * 1000 < new Date(user.changeLoginCredentials).getTime() ){
      return next(new Error("Old Login Credentials" , {cause :401}))
    }
    return {user , decode};
};

export const generateLoginToken = async ({user}={}) => {
  const signature = await getSignatures({
    signatureLevel: user.role != roleEnum.user ? signatureTypeEnum.system : signatureTypeEnum.bearer});
    
  const tokenId = nanoid()
  const access_token = await generateToken({
    payload: { _id: user._id , role: user.role },
    signature: signature.access_signature,
    option: { expiresIn: process.env.ACCESS_EXPIRES ,jwtid : tokenId  },
  });
  const refresh_token = await generateToken({
    payload: { _id: user._id , role: user.role },
    signature: signature.refresh_signature,
    option: { expiresIn: process.env.REFRESH_EXPIRES , jwtid : tokenId},
  });
  return { access_token, refresh_token };
};