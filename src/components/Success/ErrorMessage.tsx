import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { ErrorMessageProps } from "@/types";

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
}) => {
    return (
        <Box
            sx={{ textAlign: "center", py: 8 }}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Typography variant="h5" color="error" gutterBottom>
                Something Went Wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                {message}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={onRetry}
                sx={{ mt: 2 }}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
            >
                Try Again
            </Button>
        </Box>
    );
};
