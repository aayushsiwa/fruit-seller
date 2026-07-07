import Login from '@/src/containers/Login/Login';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Fruit Seller</title>
        <meta name="description" content="Log in to your Fruit Seller account to track orders and manage details." />
        <link rel="canonical" href="https://fruitseller.com/login" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Login />
    </>
  );
}
