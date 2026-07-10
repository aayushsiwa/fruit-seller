import Profile from '@/src/containers/Profile/Profile';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Head from 'next/head';

import { authOptions } from './api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/profile',
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>My Profile | Fruit Seller</title>
        <meta
          name="description"
          content="Manage your Fruit Seller account profile, password, and saved addresses."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Profile />
    </>
  );
}
