import Cart from '@/src/containers/Cart/Cart';
import Head from 'next/head';

export default function CartPage() {
  return (
    <>
      <Head>
        <title>Shopping Cart | Fruit Seller</title>
        <meta name="description" content="Review the fresh fruits in your shopping cart and proceed to checkout." />
        <link rel="canonical" href="https://fruitseller.com/cart" />
        <meta property="og:title" content="Shopping Cart | Fruit Seller" />
        <meta property="og:description" content="Review the fresh fruits in your shopping cart and proceed to checkout." />
        <meta property="og:url" content="https://fruitseller.com/cart" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Cart />
    </>
  );
}
