import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/supabase";
import { authOptions } from "../../auth/[...nextauth]";
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

    if (req.method === "GET") {
        if (
            !session ||
            !["admin"].includes(
                typeof session.user.role === "string" ? session.user.role : ""
            )
        ) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const { data, error } = await supabase
            .from("fruitsellerusers")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) {
            data.forEach((user) => {
                user.firstName = user.first_name;
                user.lastName = user.last_name;
                user.createdAt = user.created_at;
                delete user.first_name;
                delete user.last_name;
                delete user.created_at;
            });
        }

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === "POST") {
        if (
            !session ||
            !["admin"].includes(
                typeof session.user.role === "string" ? session.user.role : ""
            )
        ) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const { firstName, lastName, email, role } = req.body;

        const insertData = {
            first_name: firstName,
            last_name: lastName,
            email,
            role: role || "user",
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("fruitsellerusers")
            .insert(insertData)
            .select();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const newUser = data?.[0];
        if (newUser) {
            newUser.firstName = newUser.first_name;
            newUser.lastName = newUser.last_name;
            newUser.createdAt = newUser.created_at;
            delete newUser.first_name;
            delete newUser.last_name;
            delete newUser.created_at;
        }

        return res.status(201).json(newUser);
    }

    return res.status(405).json({ error: "Method not allowed" });
}
