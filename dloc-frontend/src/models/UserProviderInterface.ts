import { User } from './User';

export interface UserProviderInterface {
  isLoggedIn: boolean;
  setUser: {
    (userData: User): void;
  };
  getUser: {
    (): User;
  };
  logout: {
    (): void;
  };
  getEmptyUser: {
    (): User;
  };
  close: {
    (): void;
  };
  user: User;
  isLogingIn: boolean;
  setIsLogingIn: {
    (state: boolean): void;
  };
  isAutoLogingIn: boolean;
  setIsAutoLogingIn: {
    (state: boolean): void;
  };
}
