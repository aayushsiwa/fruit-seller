import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/supabase";
import { authOptions } from "../auth/[...nextauth]";
import { SessionUser } from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = (await getServerSession(req, res, authOptions)) as SessionUser;

    if (req.method === "GET") {
        const { featured, category, sort, related, search } = req.query;
        let query = supabase.from("fruitsellerproducts").select("*");

        if (featured) {
            query = query.eq("featured", true);
        }
        if (category && typeof category === "string") {
            query = query.eq("category", category);
        }
        if (sort && typeof sort === "string") {
            if (sort === "price_asc") {
                query = query.order("price", { ascending: true });
            } else if (sort === "price_desc") {
                query = query.order("price", { ascending: false });
            }
        }
        if (search) {
            query = query.or(
                `name.ilike.%${search}%, category.ilike.%${search}%, description.ilike.%${search}%`
            );
        }

        if (related && typeof related === "string") {
            const { data: relatedProduct, error: relatedError } = await supabase
                .from("fruitsellerproducts")
                .select("category")
                .eq("id", related)
                .single();

            if (relatedError || !relatedProduct) {
                return res
                    .status(400)
                    .json({ error: "Related product not found" });
            }

            query = query.eq("category", relatedProduct.category);
            query = query.not("id", "eq", related);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Supabase GET error:", error);
            return res.status(500).json({ error: "Failed to fetch products" });
        }
        return res.status(200).json(data);
    }

    if (req.method === "POST") {
        if (
            !session ||
            !["admin", "seller"].includes(session.user.role || "")
        ) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const {
            name,
            price,
            description,
            image,
            category,
            quantity,
            discount,
            is_seasonal,
        } = req.body;

        if (!name || !price || !category || quantity == null) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { data, error } = await supabase
            .from("fruitsellerproducts")
            .insert({
                name,
                price,
                description,
                image,
                category,
                quantity,
                discount: discount || 0,
                is_seasonal: is_seasonal || false,
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase POST error:", error);
            return res.status(500).json({ error: "Failed to add product" });
        }
        return res.status(201).json(data);
    }

    if (req.method === "PUT") {
        if (
            !session ||
            !["admin", "seller"].includes(session.user?.role || "")
        ) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const {
            id,
            name,
            price,
            description,
            image,
            category,
            quantity,
            discount,
            is_seasonal,
        } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Missing product ID" });
        }

        const { data, error } = await supabase
            .from("fruitsellerproducts")
            .update({
                name,
                price,
                description,
                image,
                category,
                quantity,
                discount: discount || 0,
                is_seasonal: is_seasonal || false,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Supabase PUT error:", error);
            return res.status(500).json({ error: "Failed to update product" });
        }
        return res.status(200).json(data);
    }

    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    return res.status(405).json({ error: "Method Not Allowed" });
}
