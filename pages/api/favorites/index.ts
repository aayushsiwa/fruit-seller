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

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, fruitsellerproducts(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase GET favorites error:', error);
      return res.status(500).json({ error: 'Failed to fetch favorites' });
    }

    // Remap data to return an array of products
    const favorites = data
      .map((item) => item.fruitsellerproducts)
      .filter(Boolean);

    return res.status(200).json(favorites);
  }

  if (req.method === 'POST') {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Verify if product exists
    const { data: product, error: productError } = await supabase
      .from('fruitsellerproducts')
      .select('id')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already in favorites
    const { data: existingFavorite, error: fetchError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Supabase fetch favorite error:', fetchError);
      return res.status(500).json({ error: 'Failed to check favorites' });
    }

    if (existingFavorite) {
      return res.status(200).json(existingFavorite);
    }

    // Insert new favorite
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, product_id })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert favorite error:', error);
      return res.status(500).json({ error: 'Failed to add to favorites' });
    }

    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
