import { supabase } from '@/lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import Nextauth from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(req, res, Nextauth.authOptions)) as {
    user?: { id?: string };
  } | null;

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userID = session.user.id;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('userID', userID)
      .order('createdAt', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data || []);
  }

  if (req.method === 'POST') {
    const {
      label,
      street,
      street2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = req.body;

    if (!street || !city || !state || !postalCode || !country || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        userID,
        label: label || '',
        street,
        street2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: isDefault || false,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
