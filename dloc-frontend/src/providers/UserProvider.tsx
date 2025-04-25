import { AuthProviders } from 'enums/AuthProviders';
import { createContext, useContext, useEffect, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { logError } from 'functions/logError';
import { User } from 'models/User';
import { UserProviderInterface } from 'models/UserProviderInterface';
import getEmptyUser from 'functions/getEmptyUser';
import logoutService from 'services/logout/logout';
import useGetDevicesHook from '../hooks/GetDeviceHook';
import { FacebookLoginClient } from '@greatsumini/react-facebook-login';
import { useDevicesContext } from './DevicesProvider';

const USER_STORAGE_KEY = 'user';

export function UserProvider({ children }: { children: any }) {
  const [user, setUser] = useState<User>(getEmptyUser());
  const [isLogingIn, setIsLogingIn] = useState<boolean>(true);
  const [isAutoLogingIn, setIsAutoLogingIn] = useState<boolean>(true);
  const { getDevices } = useGetDevicesHook();
  const { setDevices, devices } = useDevicesContext();
  const isLoggedIn = user.token !== '';

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    if (user.authProvider === AuthProviders.google) googleLogout();
    if (user.authProvider === AuthProviders.facebook) FacebookLoginClient.logout(() => {});

    logoutService({ user, callback: () => {}, abort: { current: new AbortController() } });

    setUser(getEmptyUser());
  };

  useEffect(() => {
    const userCache: User = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) ?? '{}');
    if (!userCache.token) {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(getEmptyUser());
      return;
    }
    setUser(userCache);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      if (isAutoLogingIn) setIsAutoLogingIn(false);
      if (isLogingIn) setIsLogingIn(false);
      if (devices && devices.length > 0) setDevices([]);
      return;
    }

    // Save user in localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    // Get devices
    getDevices({
      logout,
      user,
      onStart: () => setIsLogingIn(true),
      onFinish: () => {
        setIsAutoLogingIn(false);
        setIsLogingIn(false);
      },
    });
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        close: () => setUser(getEmptyUser()),
        setUser: (user: User) => setUser((prev) => ({ ...prev, ...user })),
        logout,
        getUser: () => user,
        getEmptyUser: () => getEmptyUser(),
        user,
        isLogingIn,
        isAutoLogingIn,
        setIsLogingIn,
        setIsAutoLogingIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);

const UserContext = createContext<UserProviderInterface>({
  isLoggedIn: false,
  close: () => logError('UserContext.close'),
  setUser: () => logError('UserContext.setUser'),
  logout: () => logError('UserContext.logout'),
  getUser: () => {
    logError('UserContext.getUser');
    return getEmptyUser();
  },
  getEmptyUser: () => {
    logError('UserContext.getEmptyUser');
    return getEmptyUser();
  },
  user: getEmptyUser(),
  isLogingIn: true,
  setIsLogingIn: () => logError('UserContext.setIsLoging'),
  isAutoLogingIn: true,
  setIsAutoLogingIn: () => logError('UserContext.setIsAutoLoging'),
});
