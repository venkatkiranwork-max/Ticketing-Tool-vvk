import { Select, MenuItem } from '@mui/material';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: FilterOption[];
  minWidth?: number;
}

export function FilterDropdown({ value, onChange, options, minWidth = 160 }: FilterDropdownProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      sx={{ borderRadius: '10px', minWidth }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
