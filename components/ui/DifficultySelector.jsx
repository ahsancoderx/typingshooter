'use client';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
export default function DifficultySelector({ value, onChange, disabled }) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      color="primary"
      value={value}
      disabled={disabled}
      aria-label="Difficulty"
      onChange={(_, v) => {
        if (v) onChange(v);
      }}
    >
      <ToggleButton value="easy">Easy</ToggleButton>
      <ToggleButton value="medium">Medium</ToggleButton>
      <ToggleButton value="hard">Hard</ToggleButton>
    </ToggleButtonGroup>
  );
}
