import Success from '@/src/containers/Success/Success';
import Head from 'next/head';

export default function SuccessPage() {
  return (
    <>
      <Head>
        <title>Order Placed Successfully | Fruit Seller</title>
        <meta
          name="description"
          content="Thank you for your order! Your fresh organic fruits are being prepared for delivery."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Success />
    </>
  );
}
