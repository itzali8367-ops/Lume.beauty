import { JournalEntry } from '../types';
import { useLocalStorage } from './useLocalStorage';

const seedJournalEntries: JournalEntry[] = [
  {
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    rating: 5,
    mood: 'Radiant',
    moodIcon: '✨',
    skinFeel: ['Plump', 'Calm', 'Hydrated'],
    note: 'Double cleansed with Centella oil, followed by ceramide barrier mist. Skin woke up visibly bouncy and glowing without any morning redness!',
    routineCorrelation: {
      morningDone: true,
      eveningDone: true,
      stepsCompleted: 8,
      waterGlasses: 8,
      waterGoal: 8,
      streakDays: 6,
    },
  },
  {
    date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    rating: 4,
    mood: 'Calm',
    moodIcon: '🌿',
    skinFeel: ['Smooth', 'Balanced'],
    note: 'Applied SPF 50 generously before outdoor walk. Barrier felt protected all afternoon.',
    routineCorrelation: {
      morningDone: true,
      eveningDone: true,
      stepsCompleted: 7,
      waterGlasses: 7,
      waterGoal: 8,
      streakDays: 5,
    },
  },
];

export function useJournal() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('lumie.journal', seedJournalEntries);

  return {
    entries,
    addEntry: (entry: JournalEntry) => {
      setEntries((prev) => [entry, ...prev.filter((item) => item.date !== entry.date)]);
    },
    deleteEntry: (date: string) => {
      setEntries((prev) => prev.filter((item) => item.date !== date));
    },
  };
}
