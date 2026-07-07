import Orders from '@/src/containers/Orders/Orders';
import Head from 'next/head';

export default function OrdersPage() {
  return (
    <>
      <Head>
        <title>My Orders | Fruit Seller</title>
        <meta name="description" content="View and track your previous and active fruit orders." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Orders />
    </>
  );
}
