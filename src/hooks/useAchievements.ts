import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useRoutineProgress, getTodayDateString } from './useRoutineProgress';
import { useJournal } from './useJournal';
import { useProgressPhotos } from './useProgressPhotos';
import { useSavedProducts } from './useSavedProducts';
import { ACHIEVEMENTS, Achievement } from '../data/achievementsData';

export interface EvaluatedAchievement extends Achievement {
  unlocked: boolean;
  currentValue: number;
  progressPercent: number;
  unlockedAt?: string;
  isNew?: boolean;
}

export function useAchievements() {
  const { streak, progress, todayDone } = useRoutineProgress();
  const { entries } = useJournal();
  const { photos } = useProgressPhotos();
  const { saved } = useSavedProducts();

  const todayKey = getTodayDateString();
  const [waterLogs] = useLocalStorage<Record<string, { glasses: number; goal: number }>>('lumie.water_intake', {
    [todayKey]: { glasses: 4, goal: 8 },
  });

  const [importedRoutines, setImportedRoutines] = useLocalStorage<string[]>('lumie.imported_routines', []);

  const [unlockedRecords, setUnlockedRecords] = useLocalStorage<Record<string, string>>('lumie.achievements_unlocked', {
    'badge-glow-pioneer': '2026-10-01T10:00:00.000Z',
    'badge-visual-transformation': '2026-10-05T14:30:00.000Z',
  });

  const currentStreak = streak();
  const todayWater = waterLogs[todayKey]?.glasses ?? 0;

  const waterStreak = useMemo(() => {
    let count = 0;
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const log = waterLogs[iso];
      if (log && log.glasses >= (log.goal || 8)) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [waterLogs]);

  const morningDoneCount = todayDone.filter((id) => id.startsWith('am-')).length;
  const eveningDoneCount = todayDone.filter((id) => id.startsWith('pm-')).length;

  const totalCumulativeSteps = useMemo(() => {
    let sum = 0;
    Object.values(progress).forEach((steps) => {
      if (Array.isArray(steps)) sum += steps.length;
    });
    return sum;
  }, [progress]);

  const evaluatedAchievements: EvaluatedAchievement[] = useMemo(() => {
    return ACHIEVEMENTS.map((ach) => {
      let currentValue = 0;
      switch (ach.metricType) {
        case 'streak_days':
          currentValue = currentStreak;
          break;
        case 'water_today':
          currentValue = todayWater;
          break;
        case 'water_streak':
          currentValue = waterStreak;
          break;
        case 'morning_done':
          currentValue = morningDoneCount;
          break;
        case 'evening_done':
          currentValue = eveningDoneCount;
          break;
        case 'journal_count':
          currentValue = entries.length;
          break;
        case 'photos_count':
          currentValue = photos.length;
          break;
        case 'imported_count':
          currentValue = importedRoutines.length;
          break;
        case 'saved_count':
          currentValue = saved.length;
          break;
        case 'total_steps':
          currentValue = totalCumulativeSteps;
          break;
      }

      const meetsCriteria = currentValue >= ach.target;
      const previouslyUnlocked = !!unlockedRecords[ach.id];
      const isUnlocked = meetsCriteria || previouslyUnlocked;

      let unlockedAt = unlockedRecords[ach.id];
      if (meetsCriteria && !previouslyUnlocked) {
        unlockedAt = new Date().toISOString();
        setTimeout(() => {
          setUnlockedRecords((prev) => ({
            ...prev,
            [ach.id]: new Date().toISOString(),
          }));
        }, 0);
      }

      const progressPercent = Math.min(100, Math.round((currentValue / ach.target) * 100));

      return {
        ...ach,
        unlocked: isUnlocked,
        currentValue,
        progressPercent,
        unlockedAt,
      };
    });
  }, [
    currentStreak,
    todayWater,
    waterStreak,
    morningDoneCount,
    eveningDoneCount,
    entries.length,
    photos.length,
    importedRoutines.length,
    saved.length,
    totalCumulativeSteps,
    unlockedRecords,
    setUnlockedRecords,
  ]);

  const unlockedCount = evaluatedAchievements.filter((a) => a.unlocked).length;
  const totalCount = evaluatedAchievements.length;
  const overallPercentage = Math.round((unlockedCount / totalCount) * 100);

  const userTier = useMemo(() => {
    if (unlockedCount >= 9) return { title: 'Radiance Deity', badge: 'Diamond Tier', level: 4 };
    if (unlockedCount >= 6) return { title: 'Glowing Devotee', badge: 'Gold Tier', level: 3 };
    if (unlockedCount >= 3) return { title: 'Ritual Practitioner', badge: 'Silver Tier', level: 2 };
    return { title: 'Glow Apprentice', badge: 'Bronze Tier', level: 1 };
  }, [unlockedCount]);

  const recordImportedRoutine = (routineId: string) => {
    if (!importedRoutines.includes(routineId)) {
      setImportedRoutines([...importedRoutines, routineId]);
    }
  };

  return {
    achievements: evaluatedAchievements,
    unlockedCount,
    totalCount,
    overallPercentage,
    userTier,
    recordImportedRoutine,
    importedRoutines,
  };
}
