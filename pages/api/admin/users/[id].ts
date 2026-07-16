import { supabase } from '@/lib/supabase';
import { validateUserData } from '@/lib/validation/admin';
import type { SessionUser } from '@/types/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(
    req,
    res,
    authOptions
  )) as SessionUser;

  if (
    !session ||
    !['ADMIN'].includes(
      typeof session.user.role === 'string' ? session.user.role : ''
    )
  ) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { firstName, lastName, email, role } = req.body;

    if (firstName || lastName || email || role) {
      const validation = validateUserData({ firstName, lastName, email, role });
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }
    }

    const updateData = {
      firstName,
      lastName,
      email,
      role,
    };

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('ID', id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const updatedUser = data?.[0];

    return res.status(200).json(updatedUser);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('users').delete().eq('ID', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
