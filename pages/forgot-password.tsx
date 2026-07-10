import ForgotPassword from '@/src/containers/ForgotPassword/ForgotPassword';
import Head from 'next/head';

export default function ForgotPasswordPage() {
  return (
    <>
      <Head>
        <title>Forgot Password | Fruit Seller</title>
        <meta
          name="description"
          content="Request a link to reset your Fruit Seller account password."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <ForgotPassword />
    </>
  );
}
