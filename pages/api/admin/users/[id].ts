import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/supabase";
import {authOptions} from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import type { SessionUser } from "@/types";

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
        const { firstName, lastName, email, role } = req.body;

        const updateData = {
            first_name: firstName,
            last_name: lastName,
            email,
            role,
        };

        const { data, error } = await supabase
            .from("fruitsellerusers")
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const updatedUser = data?.[0];
        if (updatedUser) {
            updatedUser.firstName = updatedUser.first_name;
            updatedUser.lastName = updatedUser.last_name;
            delete updatedUser.first_name;
            delete updatedUser.last_name;
        }

        return res.status(200).json(updatedUser);
    }

    if (req.method === "DELETE") {
        const { error } = await supabase
            .from("fruitsellerusers")
            .delete()
            .eq("id", id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });
}