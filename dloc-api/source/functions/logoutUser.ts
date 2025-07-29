import { EncriptionHelper } from '../models/EncriptionHelper';
import { Persistence } from '../persistence/_Persistence';
import { Request } from 'express';

const logoutUser : logoutUserProps = async (req, persistence, encription): Promise<void> => {
  /* Get token from headers and auth provider */
  const authProvider: string = req.headers?.['auth-provider']?.toString() ?? '';
  const token: string = (req.headers?.authorization?.toString() ?? '').replace('Bearer ', '');
  
  /* Check if token is empty */
  if (token === '') return;

  /* Create token id and password */
  const tokenId = encription.createTokenId(authProvider, token);

  /* Check if token is in cache and return from */
  await persistence.cacheRemoveToken(tokenId);
};

export { logoutUser };

interface logoutUserProps {
  (req: Request, persistence: Persistence, encription: EncriptionHelper): Promise<void>;
}