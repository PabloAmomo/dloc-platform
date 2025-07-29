import { Request } from "express";
import { AuthProviders, getProviderFromString } from "../enums/AuthProviders";

const getTokenAndAuthFromReq = (req: Request): { token: string; authProvider: AuthProviders } => {
  /* Get token from headers and auth provider */
  const authProvider: AuthProviders = getProviderFromString(req.headers?.['auth-provider']?.toString());
  const token: string = (req.headers?.authorization?.toString() ?? '').replace('Bearer ', '');
  return { token, authProvider };
};  

export { getTokenAndAuthFromReq };