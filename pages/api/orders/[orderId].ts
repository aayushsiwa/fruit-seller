import { supabase } from '@/lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { orderId } = req.query;

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('ID', orderId)
      .eq('userEmail', session.user.email)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({
      ...order,
      userName: order.userEmail,
      createdAt: order.createdAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
    });
  } catch (error) {
    console.error('Fetch order error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
