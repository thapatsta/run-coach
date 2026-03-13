import { useState, useCallback } from 'react';
import type { Run } from '../types';
import { getRuns, saveRun as storageSaveRun, deleteRun as storageDeleteRun } from '../lib/storage';

export function useRuns() {
  const [runs, setRuns] = useState<Run[]>(() => getRuns());

  const saveRun = useCallback((run: Run) => {
    storageSaveRun(run);
    setRuns(getRuns());
  }, []);

  const deleteRun = useCallback((id: string) => {
    storageDeleteRun(id);
    setRuns((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getRunById = useCallback(
    (id: string) => runs.find((r) => r.id === id),
    [runs],
  );

  const refresh = useCallback(() => {
    setRuns(getRuns());
  }, []);

  return { runs, saveRun, deleteRun, getRunById, refresh };
}
