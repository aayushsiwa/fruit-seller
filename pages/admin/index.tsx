import AdminDashboard from '@/src/containers/Admin/Admin';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Head from 'next/head';

import { authOptions } from '../api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }
  return { props: {} };
};

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin Dashboard | Fruit Seller</title>
        <meta
          name="description"
          content="Manage inventory, products, orders, and users for the Fruit Seller application."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminDashboard />
    </>
  );
}
