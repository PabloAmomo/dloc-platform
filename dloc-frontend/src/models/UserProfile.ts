import { IconType } from '../enums/IconType';

export type UserProfile = {
  id: string,
  name: string,
  email: string,
  image: string,
  iconOnMap: IconType,
  iconColor: string
};

