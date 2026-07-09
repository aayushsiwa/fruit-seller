import { PincodeOffice } from '@/entity/Pincodes/Pincodes';
import { supabase } from '@/lib/supabase';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const SUKHPREETSALUJA_URL = 'https://api.sukhpreetsaluja.com/api/v1/pincode';
const POSTALPINCODE_URL = 'https://api.postalpincode.in/pincode';

async function fetchFromSukhpreetsaluja(pin: string): Promise<PincodeOffice[]> {
  const { data } = await axios.get(`${SUKHPREETSALUJA_URL}/${pin}`);
  const offices: PincodeOffice[] = (data.offices || []).map(
    (o: Record<string, unknown>) => ({
      officeName: String(o.office_name ?? ''),
      district: String(o.district ?? ''),
      state: String(o.state ?? ''),
      block: o.block != null ? String(o.block) : null,
      delivery: o.delivery === true || o.delivery === 'true',
    })
  );
  return offices.filter((o) => o.block != null && o.delivery);
}

async function fetchFromPostalpincode(pin: string): Promise<PincodeOffice[]> {
  const { data } = await axios.get(`${POSTALPINCODE_URL}/${pin}`);
  if (!data?.[0] || data[0].Status !== 'Success') return [];
  const offices: PincodeOffice[] = (data[0].PostOffice || []).map(
    (o: Record<string, unknown>) => ({
      officeName: String(o.Name ?? ''),
      district: String(o.District ?? ''),
      state: String(o.State ?? ''),
      block:
        o.Block != null && String(o.Block) !== 'NA' ? String(o.Block) : null,
      delivery: String(o.DeliveryStatus ?? '') === 'Delivery',
    })
  );
  return offices.filter((o) => o.block != null && o.delivery);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pincode } = req.query;

  if (
    !pincode ||
    typeof pincode !== 'string' ||
    pincode.trim().length !== 6 ||
    !/^\d+$/.test(pincode)
  ) {
    return res
      .status(400)
      .json({ error: 'Invalid pincode format. Must be a 6-digit number.' });
  }

  const pin = pincode.trim();

  try {
    const { data: cached } = await supabase
      .from('pincode_cache')
      .select('office_name, district, state, block, delivery')
      .eq('pincode', pin);

    if (cached && cached.length > 0) {
      const offices: PincodeOffice[] = cached.map(
        (row: {
          office_name: string;
          district: string;
          state: string;
          block: string | null;
          delivery: boolean;
        }) => ({
          officeName: row.office_name,
          district: row.district,
          state: row.state,
          block: row.block,
          delivery: row.delivery,
        })
      );
      return res.status(200).json({ offices });
    }

    let offices: PincodeOffice[] = [];

    try {
      offices = await fetchFromSukhpreetsaluja(pin);
    } catch {
      // fall through
    }

    if (offices.length === 0) {
      try {
        offices = await fetchFromPostalpincode(pin);
      } catch {
        // fall through
      }
    }

    if (offices.length === 0) {
      return res.status(404).json({ error: 'Could not verify pincode' });
    }

    const rows = offices.map((o) => ({
      pincode: pin,
      office_name: o.officeName,
      district: o.district,
      state: o.state,
      block: o.block,
      delivery: o.delivery,
    }));

    await supabase.from('pincode_cache').insert(rows);

    return res.status(200).json({ offices });
  } catch (error) {
    console.error('Pincode fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
