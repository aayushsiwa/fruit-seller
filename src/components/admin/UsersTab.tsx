import React from "react";
import {
    Box,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Typography,
    CircularProgress,
    IconButton,
    Chip,
} from "@mui/material";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { User, UsersTabProps } from "@/types";

const UsersTab: React.FC<UsersTabProps> = ({
    users,
    isLoading,
    error,
    onAddUser,
    onEditUser,
    onDeleteUser,
}) => {
    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                }}
            >
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FiPlus />}
                    onClick={onAddUser}
                >
                    Add User
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                    <Typography>Loading users...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography color="error">
                                        Failed to load users: {error}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (users?.length ?? 0) > 0 ? (
                            (users ?? []).map((user: User) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role}
                                            color={
                                                user.role === "admin"
                                                    ? "primary"
                                                    : "default"
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() => onEditUser(user)}
                                        >
                                            <FiEdit2 />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => onDeleteUser(user)}
                                        >
                                            <FiTrash2 />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UsersTab;
