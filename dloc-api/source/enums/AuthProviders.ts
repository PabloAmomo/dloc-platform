export enum AuthProviders {
  google = 'google',
  microsoft = 'microsoft',
  facebook = 'facebook',
  unknown = 'unknown',
}

const getProviderFromString = (provider?: string | null): AuthProviders => {
  return AuthProviders[(provider ?? 'unknown') as keyof typeof AuthProviders] ?? AuthProviders.unknown;
};

export { getProviderFromString };