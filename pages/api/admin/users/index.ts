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

  if (req.method === 'GET') {
    if (
      !session ||
      !['ADMIN'].includes(
        typeof session.user.role === 'string' ? session.user.role : ''
      )
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    if (
      !session ||
      !['ADMIN'].includes(
        typeof session.user.role === 'string' ? session.user.role : ''
      )
    ) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { firstName, lastName, email, role } = req.body;

    const validation = validateUserData({ firstName, lastName, email, role });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const insertData = {
      firstName,
      lastName,
      email,
      role: role || 'USER',
    };

    const { data, error } = await supabase
      .from('users')
      .insert(insertData)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const newUser = data?.[0];

    return res.status(201).json(newUser);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
