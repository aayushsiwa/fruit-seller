import OrderDetailPage from '@/src/containers/OrderDetail/OrderDetail';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function SingleOrderPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const displayId = typeof orderId === 'string' ? `#${orderId.slice(-8)}` : '';

  return (
    <>
      <Head>
        <title>{`Order ${displayId} | Fruit Seller`}</title>
        <meta
          name="description"
          content="View details, items, shipping address, and tracking status for this order."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <OrderDetailPage />
    </>
  );
}
