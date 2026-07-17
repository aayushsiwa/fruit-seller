import { NextApiRequest } from 'next';

import { verifyJWT } from './api/auth/auth';

export const requireAuth = (req: NextApiRequest) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  return verifyJWT(token);
};
