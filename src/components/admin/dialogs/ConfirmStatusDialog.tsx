import { ConfirmStatusDialogProps } from '@/types/index';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

const ConfirmStatusDialog: React.FC<ConfirmStatusDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  currentStatus,
  newStatus,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Status Change</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Are you sure you want to change the order status from{' '}
          <strong>{currentStatus}</strong> to <strong>{newStatus}</strong>?
        </DialogContentText>
        <Alert severity="warning">
          Status changes are irreversible. Once the status is set to{' '}
          <strong>{newStatus}</strong>, it cannot be reverted to a previous
          state.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Confirm Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmStatusDialog;
