import { supabase } from '@/lib/supabase';
import { validateProductData } from '@/lib/validation/admin';
import { SessionUser } from '@/types/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('ID', id)
      .single();

    if (error || !data) {
      console.error('Supabase GET error:', error);
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(data);
  }

  if (req.method === 'PUT' || req.method === 'DELETE') {
    const session = (await getServerSession(
      req,
      res,
      authOptions
    )) as SessionUser;
    if (!session || !['ADMIN'].includes(session.user.role || '')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  }

  if (req.method === 'PUT') {
    const {
      name,
      slug,
      price,
      description,
      images,
      category,
      stock,
      discount,
      isSeasonal,
    } = req.body;

    const validation = validateProductData({
      name,
      price,
      description,
      category,
      stock,
    });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        slug,
        price,
        description,
        images,
        category,
        stock,
        discount: discount || 0,
        isSeasonal: isSeasonal || false,
      })
      .eq('ID', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase PUT error:', error);
      return res.status(500).json({ error: 'Failed to update product' });
    }
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('products').delete().eq('ID', id);

    if (error) {
      console.error('Supabase DELETE error:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    return res.status(200).json({ message: 'Product deleted' });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
