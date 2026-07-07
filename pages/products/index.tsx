import ProductsPage from '@/src/containers/Products/Products';
import Head from 'next/head';

export default function Products() {
  return (
    <>
      <Head>
        <title>All Fruits | Fruit Seller</title>
        <meta name="description" content="Browse our catalog of fresh, organic fruits. Order apples, mangoes, berries, and more with instant home delivery." />
        <link rel="canonical" href="https://fruitseller.com/products" />
        <meta property="og:title" content="All Fruits | Fruit Seller" />
        <meta property="og:description" content="Browse our catalog of fresh, organic fruits. Order apples, mangoes, berries, and more with instant home delivery." />
        <meta property="og:url" content="https://fruitseller.com/products" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ProductsPage />
    </>
  );
}
