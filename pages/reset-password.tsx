import ResetPassword from '@/src/containers/ResetPassword/ResetPassword';
import Head from 'next/head';

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title>Reset Password | Fruit Seller</title>
        <meta
          name="description"
          content="Reset your Fruit Seller account password."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <ResetPassword />
    </>
  );
}
