import { supabase } from '@/lib/supabase';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

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
    // 1. Check local DB cache
    const { data: cached, error: cacheError } = await supabase
      .from('pincode_cache')
      .select('city, state')
      .eq('pincode', pin)
      .single();

    if (!cacheError && cached) {
      return res
        .status(200)
        .json({ city: cached.city, state: cached.state, cached: true });
    }

    // 2. Fetch from external API if not cached
    const apiRes = await axios.get(
      `https://api.postalpincode.in/pincode/${pin}`
    );
    const data = apiRes.data[0];

    if (
      data &&
      data.Status === 'Success' &&
      data.PostOffice &&
      data.PostOffice.length > 0
    ) {
      const office = data.PostOffice[0];
      const city = office.District || '';
      const state = office.State || '';

      if (city && state) {
        // 3. Save to database cache (ignore insertion error if it arises)
        await supabase.from('pincode_cache').insert({
          pincode: pin,
          city,
          state,
        });

        return res.status(200).json({ city, state, cached: false });
      }
    }

    return res
      .status(404)
      .json({ error: 'No details found for this pincode.' });
  } catch (error) {
    console.error('Pincode fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
