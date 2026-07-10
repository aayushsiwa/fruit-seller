import { supabase } from '@/lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('fruitsellerusers')
      .select('id, first_name, last_name, email, role, created_at')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      role: data.role,
      createdAt: data.created_at,
    });
  }

  if (req.method === 'PUT') {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }
    if (firstName.length < 2) {
      return res.status(400).json({ error: 'First name must be at least 2 characters' });
    }
    if (lastName.length < 1) {
      return res.status(400).json({ error: 'Last name is required' });
    }

    const { data, error } = await supabase
      .from('fruitsellerusers')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', userId)
      .select('id, first_name, last_name, email, role, created_at')
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    return res.status(200).json({
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      role: data.role,
      createdAt: data.created_at,
    });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
