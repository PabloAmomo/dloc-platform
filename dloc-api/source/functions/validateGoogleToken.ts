import { GoogleUserData } from "../models/GoogleUserData";
import { GoogleUserDataError } from "../models/GoogleUserDataError";
import { UserData } from "../models/UserData";
import { ValidateTokeReponse } from "./checkTokenWithProvider";

const validateGoogleToken = async (token: string) : Promise<ValidateTokeReponse> => {
  const userData : UserData = { userId: '', email: '' };
  let error: any;
  let tokenData : any;

  const checkToken = await fetch(`${process.env.GOOGLE_AUTH_CHECK_URL}${token}`);
  
  tokenData = await checkToken.json();

  if ((tokenData as GoogleUserDataError)?.error) error = tokenData.error;
  else {
    const data = tokenData as GoogleUserData;
    tokenData.userId = data.id;
    userData.userId = data.id;
    userData.email = data.email;
  }

  return { error, userData, tokenData };
};

export { validateGoogleToken };
