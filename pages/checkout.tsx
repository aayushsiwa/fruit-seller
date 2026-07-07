import Checkout from '@/src/containers/Checkout/Checkout';
import Head from 'next/head';

export default function CheckoutPage() {
  return (
    <>
      <Head>
        <title>Checkout | Fruit Seller</title>
        <meta name="description" content="Secure checkout. Enter your shipping details and payment information to complete your order." />
        <link rel="canonical" href="https://fruitseller.com/checkout" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Checkout />
    </>
  );
}
