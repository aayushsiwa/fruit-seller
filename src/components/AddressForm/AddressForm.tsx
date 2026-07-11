import { PincodeOffice } from '@/entity/Pincodes/Pincodes';
import { Address } from '@/types/index';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

interface AddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
  offices: PincodeOffice[];
  selectedOffice: PincodeOffice | null;
  onSelectOffice: (office: PincodeOffice | null) => void;
  showSaveCheckbox?: boolean;
  saveToProfile?: boolean;
  onSaveToProfileChange?: (save: boolean) => void;
}

export default function AddressForm({
  address,
  onChange,
  offices,
  selectedOffice,
  onSelectOffice,
  showSaveCheckbox = false,
  saveToProfile = true,
  onSaveToProfileChange,
}: AddressFormProps) {
  return (
    <Box
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextField
        fullWidth
        label="Country"
        value={address.country}
        disabled
        variant="outlined"
        size="small"
        required
      />

      <TextField
        fullWidth
        label="Address Line 1 (Street, Company, C/O)"
        value={address.street}
        onChange={(e) => onChange({ ...address, street: e.target.value })}
        variant="outlined"
        size="small"
        required
      />

      <TextField
        fullWidth
        label="Address Line 2 (Apartment, Suite, Unit, Building, Floor)"
        value={address.street2 || ''}
        onChange={(e) => onChange({ ...address, street2: e.target.value })}
        variant="outlined"
        size="small"
      />

      <TextField
        fullWidth
        label="Mobile Number"
        value={address.phone}
        onChange={(e) => onChange({ ...address, phone: e.target.value })}
        variant="outlined"
        size="small"
        required
      />

      <TextField
        fullWidth
        label="Pin Code"
          value={address.postalCode}
          onChange={(e) => onChange({ ...address, postalCode: e.target.value })}
        variant="outlined"
        size="small"
        required
      />

      <FormControl fullWidth size="small">
        <Select
          displayEmpty
          disabled={offices.length === 0}
          value={selectedOffice?.officeName ?? ''}
          onChange={(e) => {
            const office = offices.find((o) => o.officeName === e.target.value);
            onSelectOffice(office ?? null);
          }}
          renderValue={(value) => {
            if (!value) {
              return (
                <Typography color="text.secondary">
                  {offices.length === 0
                    ? 'Enter Pin Code first'
                    : 'Select Locality'}
                </Typography>
              );
            }
            return value;
          }}
        >
          {offices.map((office) => (
            <MenuItem key={office.officeName} value={office.officeName}>
              {office.officeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        <TextField
          fullWidth
          label="City"
          value={address.city}
          disabled
          variant="outlined"
          size="small"
          required
        />
        <TextField
          fullWidth
          label="State"
          value={address.state}
          disabled
          variant="outlined"
          size="small"
          required
        />
      </Box>

      {showSaveCheckbox && (
        <FormControlLabel
          control={
            <Checkbox
              checked={saveToProfile}
              onChange={(e) => onSaveToProfileChange?.(e.target.checked)}
              color="primary"
            />
          }
          label="Save this address to my profile"
        />
      )}
    </Box>
  );
}
