import { AuthProviders } from 'enums/AuthProviders';
import { Colors } from 'enums/Colors';
import { configApp } from 'config/configApp';
import { IconType } from 'enums/IconType';
import { logError } from 'functions/logError';
import { User } from 'models/User';
import axios from 'axios';

const getGoogleProfileInfoService = (props: getGoogleProfileInfoProps) => {
  const { access_token, onSuccess, onError } = props;
  axios
    .get(`${configApp.googleProfileUrl}?access_token=${access_token}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    })
    .then((res) => {
      const profile: GoogleProfileData = res.data;
      const user: User = {
        authProvider: AuthProviders.google,
        token: access_token,
        profile: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          iconOnMap: IconType.pulse,
          iconColor: Colors.green,
        },
        devices: {},
      };
      onSuccess(user);
    })
    .catch((err) => {
      logError(err);
      onError(err.message ? Error(err.message) : Error(err));
    });
};

export default getGoogleProfileInfoService;

interface GoogleProfileData {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  name: string;
  picture: string;
}

interface getGoogleProfileInfoProps {
  access_token: string;
  onSuccess: { (user: User): void };
  onError: { (error: Error): void };
}
