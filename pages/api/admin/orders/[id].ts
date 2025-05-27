import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/supabase";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { SessionUser } from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = (await getServerSession(
        req,
        res,
        authOptions
    )) as SessionUser;

    if (
        !session ||
        !["admin"].includes(
            typeof session.user.role === "string" ? session.user.role : ""
        )
    ) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.query;

    if (req.method === "PUT") {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const validStatuses = [
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const { data, error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", id)
            .select();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const updatedOrder = data[0];
        const formattedOrder = {
            ...updatedOrder,
            userName: updatedOrder.user_email,
            createdAt: updatedOrder.created_at,
        };

        return res.status(200).json(formattedOrder);
    }

    if (req.method === "GET") {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: "Order not found" });
        }

        const formattedOrder = {
            ...data,
            userName: data.user_email,
            createdAt: data.created_at,
        };

        return res.status(200).json(formattedOrder);
    }

    return res.status(405).json({ error: "Method not allowed" });
}
