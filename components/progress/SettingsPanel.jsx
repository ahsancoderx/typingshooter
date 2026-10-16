'use client';
import { useState } from 'react';
import { Button, FormControlLabel, Switch } from '@mui/material';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import DifficultySelector from '@/components/ui/DifficultySelector';
import DurationSelector from '@/components/ui/DurationSelector';
import { resetAll, updateSettings, useAppData } from '@/lib/storage';
export default function SettingsPanel() {
  const { settings, results } = useAppData();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <>
      <section className="panel settings-grid">
        <div>
          <h2>Preferred difficulty</h2>
          <p className="muted note">Used by the typing test and the game unless you change it there.</p>
          <DifficultySelector
            value={settings.difficulty}
            onChange={(difficulty) => updateSettings({ difficulty })}
          />
        </div>
        <div>
          <h2>Default test duration</h2>
          <p className="muted note">Starting duration on the typing test page.</p>
          <DurationSelector value={settings.duration} onChange={(duration) => updateSettings({ duration })} />
        </div>
        <div>
          <h2>Sound and motion</h2>
          <FormControlLabel
            control={
              <Switch
                checked={settings.sound}
                onChange={(e) => updateSettings({ sound: e.target.checked })}
              />
            }
            label="Sound effects in the game and mistake sounds in the test"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.reducedMotion}
                onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              />
            }
            label="Reduce motion (fewer particles, no bubble sway or blinking cursor)"
          />
        </div>
      </section>
      <section className="panel">
        <h2>Your data</h2>
        <p className="muted">
          Progress and settings are stored in this browser only (localStorage). They are not synced across
          devices, and clearing browser data removes them. You have {results.length} saved session
          {results.length === 1 ? '' : 's'}.
        </p>
        <Button
          color="error"
          variant="outlined"
          onClick={() => {
            setDone(false);
            setConfirm(true);
          }}
        >
          Reset all progress
        </Button>
        {done ? (
          <p role="status" className="note">
            All saved progress and settings were reset.
          </p>
        ) : null}
      </section>
      <ConfirmDialog
        open={confirm}
        title="Reset all progress?"
        body="This permanently deletes your saved tests, game results, lesson progress, and settings from this browser. This cannot be undone."
        confirmLabel="Reset everything"
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          resetAll();
          setConfirm(false);
          setDone(true);
        }}
      />
    </>
  );
}
