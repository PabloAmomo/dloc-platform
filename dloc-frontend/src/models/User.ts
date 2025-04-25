import { AuthProviders } from 'enums/AuthProviders';
import { UserProfile } from './UserProfile';

export type User = {
  authProvider: AuthProviders,
  token: string,
  profile: UserProfile,
  devices: any;
};

