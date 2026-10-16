'use client';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DURATIONS } from '@/lib/storage';
export default function DurationSelector({ value, onChange, disabled }) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      color="primary"
      value={value}
      disabled={disabled}
      aria-label="Duration in seconds"
      onChange={(_, v) => {
        if (v) onChange(v);
      }}
    >
      {DURATIONS.map((d) => (
        <ToggleButton key={d} value={d}>
          {d}s
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
