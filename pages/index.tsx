import Home from '@/src/containers/Home/Home';
import Head from 'next/head';

export default function Index() {
  return (
    <>
      <Head>
        <title>Fruit Seller - Fresh Fruits Delivered</title>
        <meta name="description" content="Shop fresh, organic, hand-picked fruits online. Enjoy express delivery, premium quality, and the best prices directly to your doorstep." />
        <link rel="canonical" href="https://fruitseller.com/" />
        <meta property="og:title" content="Fruit Seller - Fresh Fruits Delivered" />
        <meta property="og:description" content="Shop fresh, organic, hand-picked fruits online. Enjoy express delivery, premium quality, and the best prices directly to your doorstep." />
        <meta property="og:url" content="https://fruitseller.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://fruitseller.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fruit Seller - Fresh Fruits Delivered" />
        <meta name="twitter:description" content="Shop fresh, organic, hand-picked fruits online. Enjoy express delivery, premium quality, and the best prices directly to your doorstep." />
        <meta name="twitter:image" content="https://fruitseller.com/images/og-image.jpg" />
      </Head>
      <Home />
    </>
  );
}
