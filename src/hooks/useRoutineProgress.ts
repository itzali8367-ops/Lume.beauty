import { useLocalStorage } from './useLocalStorage';

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useRoutineProgress() {
  const [progress, setProgress] = useLocalStorage<Record<string, string[]>>('lumie.progress', {});
  const today = getTodayDateString();
  const todayDone = progress[today] ?? [];

  return {
    progress,
    todayDone,
    isDone: (stepId: string) => todayDone.includes(stepId),
    toggleStep: (stepId: string) => {
      setProgress((prev) => {
        const current = prev[today] ?? [];
        const next = current.includes(stepId)
          ? current.filter((id) => id !== stepId)
          : [...current, stepId];
        return { ...prev, [today]: next };
      });
    },
    addSteps: (stepIds: string[]) => {
      setProgress((prev) => {
        const current = prev[today] ?? [];
        const next = Array.from(new Set([...current, ...stepIds]));
        return { ...prev, [today]: next };
      });
    },
    removeSteps: (stepIds: string[]) => {
      setProgress((prev) => {
        const current = prev[today] ?? [];
        const next = current.filter((id) => !stepIds.includes(id));
        return { ...prev, [today]: next };
      });
    },
    completedCount: (stepIds: string[]) => stepIds.filter((id) => todayDone.includes(id)).length,
    last7Days: () => {
      const days: { label: string; date: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const iso = d.toISOString().slice(0, 10);
        days.push({
          label: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
          date: iso,
          count: (progress[iso] ?? []).length,
        });
      }
      return days;
    },
    streak: () => {
      let count = 0;
      const d = new Date();
      const todayIso = d.toISOString().slice(0, 10);
      
      // If nothing done today yet, check if streak from yesterday is still alive
      if ((progress[todayIso] ?? []).length === 0) {
        d.setDate(d.getDate() - 1);
      }
      
      // Count consecutive days backward (capped to prevent infinite loops)
      for (let i = 0; i < 365; i++) {
        const iso = d.toISOString().slice(0, 10);
        if ((progress[iso] ?? []).length > 0) {
          count++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
      return count;
    },
  };
}
