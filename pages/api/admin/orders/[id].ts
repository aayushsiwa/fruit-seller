import { supabase } from '@/lib/supabase';
import { validateTransition } from '@/lib/validation/orders';
import { ORDER_STATUSES, OrderStatus, SessionUser } from '@/types/index';
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
    const { status, shippedAt, deliveredAt, cancelledAt } = req.body as {
      status: string;
      shippedAt?: string;
      deliveredAt?: string;
      cancelledAt?: string;
    };

    if (!ORDER_STATUSES.includes(status as OrderStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('ID', id)
      .single();

    if (fetchError || !currentOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const transitionError = validateTransition(
      currentOrder.status as OrderStatus,
      status as OrderStatus
    );
    if (transitionError) {
      return res.status(400).json({ error: transitionError });
    }

    const updatePayload: Record<string, string> = { status };
    if (shippedAt) updatePayload.shippedAt = shippedAt;
    if (deliveredAt) updatePayload.deliveredAt = deliveredAt;
    if (cancelledAt) updatePayload.cancelledAt = cancelledAt;

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('ID', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({
      ...data,
      userName: data.userEmail,
      createdAt: data.createdAt,
    });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('ID', id)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({
      ...data,
      userName: data.userEmail,
      createdAt: data.createdAt,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
