import { renderHook } from "@testing-library/react";
import { useAdminActions } from "@/src/containers/Admin/Admin.hooks";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import { AdminActionsProps } from "@/types/admin";

const showSnackbar = jest.fn();
jest.mock("@/src/contexts/SnackBarContext", () => ({
    useSnackbar: () => ({ showSnackbar }),
}));

describe("useAdminActions - handleSaveUser", () => {
    it("should call mutateAsync, show success snackbar and close dialog", async () => {
        const mutateAsync = jest.fn().mockResolvedValue({});
        const setError = jest.fn();
        const handleCloseUserDialog = jest.fn();

        const props = {
            saveProductMutation: {} as UseMutationResult,
            deleteProductMutation: {} as UseMutationResult,
            saveUserMutation: { mutateAsync } as unknown as UseMutationResult,
            deleteUserMutation: {} as UseMutationResult,
            updateOrderMutation: {} as UseMutationResult,
            selectedProduct: { id: "1" },
            selectedUser: { id: "user123" },
            selectedOrder: { id: "order123" },
            isEditProduct: false,
            isEditUser: false,
            handleCloseProductDialog: jest.fn(),
            handleCloseDeleteDialog: jest.fn(),
            handleCloseUserDialog,
            handleCloseUserDeleteDialog: jest.fn(),
            handleCloseOrderDialog: jest.fn(),
            setError,
            handleOpenConfirmDialog: jest.fn(),
            handleCloseConfirmDialog: jest.fn(),
            confirmStatus: "Processing" as const,
        };

        const { result } = renderHook(() =>
            useAdminActions(props as AdminActionsProps)
        );

        const form = document.createElement("form");
        const addInput = (name: string, value: string) => {
            const input = document.createElement("input");
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };
        addInput("firstName", "John");
        addInput("lastName", "Doe");
        addInput("email", "john@example.com");
        addInput("role", "admin");

        const formEvent = {
            preventDefault: jest.fn(),
            currentTarget: form,
        } as unknown as React.FormEvent<HTMLFormElement>;

        await result.current.handleSaveUser(formEvent);

        expect(mutateAsync).toHaveBeenCalledWith({
            userData: {
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                role: "admin",
            },
            isEdit: false,
            id: "user123",
        });

        expect(showSnackbar).toHaveBeenCalledWith(
            "User added successfully",
            "success"
        );
        expect(handleCloseUserDialog).toHaveBeenCalled();
        expect(setError).not.toHaveBeenCalled();
    });
});
