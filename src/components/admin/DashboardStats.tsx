import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { FiPackage, FiUsers, FiShoppingBag } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Order, DashboardStatsProps } from "@/types";

const DashboardStats: React.FC<DashboardStatsProps> = ({
    products,
    users,
    orders,
    isLoadingProducts,
    isLoadingUsers,
    isLoadingOrders,
}) => {
    const stats = [
        {
            title: "Total Products",
            value: isLoadingProducts ? "..." : products?.length || 0,
            icon: FiPackage,
            color: "primary.main",
        },
        {
            title: "Total Users",
            value: isLoadingUsers ? "..." : users?.length || 0,
            icon: FiUsers,
            color: "secondary.main",
        },
        {
            title: "Total Orders",
            value: isLoadingOrders ? "..." : orders?.length || 0,
            icon: FiShoppingBag,
            color: "success.main",
        },
        {
            title: "Revenue",
            value: isLoadingOrders
                ? "..."
                : `₹${
                      orders
                          ?.reduce(
                              (sum: number, order: Order) => sum + order.total,
                              0
                          )
                          .toFixed(2) || "0.00"
                  }`,
            icon: FaIndianRupeeSign,
            color: "warning.main",
        },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: `${stat.color}15`,
                                    color: stat.color,
                                    width: 50,
                                    height: 50,
                                    borderRadius: "50%",
                                    mx: "auto",
                                    mb: 2,
                                }}
                            >
                                <stat.icon size={24} />
                            </Box>
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{ fontWeight: 700 }}
                            >
                                {stat.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {stat.title}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default DashboardStats;
