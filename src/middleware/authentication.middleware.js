import { asyncHandler } from "../utils/response.js";
import {
  decodedToken,
  tokenTypeEnum,
} from "../utils/security/token.security.js";

export const authentication = ({ tokenType = tokenTypeEnum.access } = {}) => {
  return asyncHandler(async (req, res, next) => {
    const { user, decode } = await decodedToken({
      authorization: req.headers.authorization,
      tokenType,
      next,
    });
    req.user = user;
    req.decode = decode;
    return next();
  });
};

export const authorization = (accessRole = []) => {
  return asyncHandler(async (req, res, next) => {
    const { user, decode } = await decodedToken({
      authorization: req.headers.authorization,
      next,
    });
    req.user = user;
    req.decode = decode;
    // console.log({
    //   accessRole,
    //   role: req.user.role,
    //   result: accessRole.includes(req.user.role),
    // });

    if (!accessRole.includes(req.user.role)) {
      return next(new Error("Not authorized account", { cause: 403 }));
    }
    return next();
  });
};

export const auth = ({
  tokenType = tokenTypeEnum.access,
  accessRole = [],
} = {}) => {
  return asyncHandler(async (req, res, next) => {
    const { user, decode } = await decodedToken({
      authorization: req.headers.authorization,
      tokenType,
      next,
    });
    req.user = user;
    req.decode = decode;
    // console.log({
    //   accessRole,
    //   role: req.user.role,
    //   result: accessRole.includes(req.user.role),
    // });
    if (!accessRole.includes(req.user.role)) {
      return next(new Error("Not authorized account", { cause: 403 }));
    }
    return next();
  });
};
