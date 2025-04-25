import { AuthProviders } from "enums/AuthProviders";
import { Colors } from "enums/Colors";
import { IconType } from "enums/IconType";
import { User } from "models/User";

const getEmptyUser = () : User => ({
  authProvider: AuthProviders.none,
  token: '',
  devices: {},
  profile: {
    id : '',
    name: '',
    email: '',
    image: '',
    iconOnMap: IconType.pulse,
    iconColor: Colors.green,
  },
});

export default getEmptyUser;