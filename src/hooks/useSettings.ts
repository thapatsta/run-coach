import { useState, useCallback } from 'react';
import type { AppSettings, Shoe } from '../types';
import { getSettings, saveSettings as storageSaveSettings } from '../lib/storage';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  const saveSettings = useCallback((updated: AppSettings) => {
    storageSaveSettings(updated);
    setSettings(updated);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      const updated = { ...settings, ...patch };
      storageSaveSettings(updated);
      setSettings(updated);
    },
    [settings],
  );

  const addShoe = useCallback(
    (shoe: Shoe) => {
      const shoes = [...(settings.shoes ?? []), shoe];
      updateSettings({ shoes });
    },
    [settings, updateSettings],
  );

  const updateShoe = useCallback(
    (shoe: Shoe) => {
      const shoes = (settings.shoes ?? []).map((s) => (s.id === shoe.id ? shoe : s));
      updateSettings({ shoes });
    },
    [settings, updateSettings],
  );

  const accumulateShoeKm = useCallback(
    (shoeId: string, km: number) => {
      const shoes = (settings.shoes ?? []).map((s) =>
        s.id === shoeId ? { ...s, totalKm: s.totalKm + km } : s,
      );
      updateSettings({ shoes });
    },
    [settings, updateSettings],
  );

  return { settings, saveSettings, updateSettings, addShoe, updateShoe, accumulateShoeKm };
}
