import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Please log in' });
  }

  const { id: productId } = req.query;

  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('userID', userId)
      .eq('productID', productId);

    if (error) {
      console.error('Supabase DELETE favorite error:', error);
      return res.status(500).json({ error: 'Failed to remove from favorites' });
    }

    return res.status(200).json({ message: 'Product removed from favorites' });
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
