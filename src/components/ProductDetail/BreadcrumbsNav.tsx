import { Breadcrumbs, Link, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { BreadcrumbsNavProps } from "@/types";

export const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({
    productName,
}) => {
    return (
        <Breadcrumbs
            sx={{ my: 2 }}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Link underline="none" href="/" color={"primary.light"}>
                Home
            </Link>
            <Link underline="none" href="/products" color={"primary"}>
                Products
            </Link>
            <Typography color="primary.dark">{productName}</Typography>
        </Breadcrumbs>
    );
};
