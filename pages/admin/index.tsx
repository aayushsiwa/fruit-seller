import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import type { GetServerSideProps } from "next";
import AdminDashboard from "@/src/containers/Admin";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session || (session.user as { role?: string })?.role !== "admin") {
        return {
            redirect: { destination: "/login", permanent: false },
        };
    }
    return { props: {} };
};

export default function AdminPage() {
    return <AdminDashboard />;
}
