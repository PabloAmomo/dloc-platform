import { FacebookUserData } from "../models/FacebookUserData";
import { FacebookUserDataError } from "../models/FacebookUserDataError";
import { UserData } from "../models/UserData";
import { ValidateTokeReponse } from "./checkTokenWithProvider";

const validateFacebookToken = async (token: string) : Promise<ValidateTokeReponse> => {
  const userData : UserData = { userId: '', email: '' };
  let error: any;
  let tokenData : any;

  const checkToken = await fetch(`${process.env.FACEBOOK_AUTH_CHECK_URL}${token}`);
  
  tokenData = await checkToken.json();

  if ((tokenData as FacebookUserDataError)?.error) error = tokenData?.error?.message ?? 'Error validating token';
  else {
    const data = tokenData as FacebookUserData;
    tokenData.userId = data.id;
    userData.userId = data.id;
    userData.email = data.email;
  }

  return { error, userData, tokenData };
};

export { validateFacebookToken };
