import Register from '@/src/containers/Register/Register';
import Head from 'next/head';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | Fruit Seller</title>
        <meta name="description" content="Create a Fruit Seller account to buy fresh, premium fruits online." />
        <link rel="canonical" href="https://fruitseller.com/register" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Register />
    </>
  );
}
