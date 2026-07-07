import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/supabase";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { SessionUser, OrderStatus, ORDER_STATUSES } from "@/types/index";

const STATUS_ORDER: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

function isValidTransition(current: OrderStatus, next: OrderStatus): string | null {
    if (current === next) return null;
    if (current === "Delivered" || current === "Cancelled") {
        return `Cannot change status from "${current}" — it is a terminal state`;
    }
    if (next === "Processing") {
        return "Cannot revert to Processing";
    }
    if (next === "Shipped") return null;
    const currentIdx = STATUS_ORDER.indexOf(current);
    const nextIdx = STATUS_ORDER.indexOf(next);
    if (nextIdx >= 0 && nextIdx <= currentIdx) {
        return `Cannot revert from "${current}" to "${next}"`;
    }
    return null;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
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

    const { id } = req.query;

    if (req.method === "PUT") {
        const { status, shipped_at, delivered_at, cancelled_at } = req.body as {
            status: string;
            shipped_at?: string;
            delivered_at?: string;
            cancelled_at?: string;
        };

        if (!ORDER_STATUSES.includes(status as OrderStatus)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const { data: currentOrder, error: fetchError } = await supabase
            .from("orders")
            .select("status")
            .eq("id", id)
            .single();

        if (fetchError || !currentOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        const transitionError = isValidTransition(
            currentOrder.status as OrderStatus,
            status as OrderStatus,
        );
        if (transitionError) {
            return res.status(400).json({ error: transitionError });
        }

        const updatePayload: Record<string, string> = { status };
        if (shipped_at) updatePayload.shipped_at = shipped_at;
        if (delivered_at) updatePayload.delivered_at = delivered_at;
        if (cancelled_at) updatePayload.cancelled_at = cancelled_at;

        const { data, error } = await supabase
            .from("orders")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).json({
            ...data,
            userName: data.user_email,
            createdAt: data.created_at,
        });
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

        return res.status(200).json({
            ...data,
            userName: data.user_email,
            createdAt: data.created_at,
        });
    }

    return res.status(405).json({ error: "Method not allowed" });
}
