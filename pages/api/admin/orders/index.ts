import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/supabase";
import { authOptions } from "../../auth/[...nextauth]";
import { SessionUser } from "@/types/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = (await getServerSession(
        req,
        res,
        authOptions,
    )) as SessionUser;

    if (
        !session ||
        !["admin"].includes(
            typeof session.user.role === "string" ? session.user.role : "",
        )
    ) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const orders = (data ?? []).map((order: Record<string, unknown>) => ({
        ...order,
        userName: order.user_email,
        items: order.items,
        status: (order.status as string) || "Processing",
        createdAt: order.created_at,
    }));

    return res.status(200).json(orders);
}
