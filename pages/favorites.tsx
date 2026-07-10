import Favorites from '@/src/containers/Favorites/Favorites';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Head from 'next/head';

import { authOptions } from './api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/favorites',
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default function FavoritesPage() {
  return (
    <>
      <Head>
        <title>My Favorites | Fruit Seller</title>
        <meta
          name="description"
          content="View your favorite fresh fruits and easily add them to your cart."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Favorites />
    </>
  );
}
