import { useState, useEffect, useCallback } from 'react';
import {
  type JapaneseWord,
  DifficultyLevel,
  StudyStatus,
  WordType,
} from '@jlearning-monorepo/api-common/contexts/shared/domain/japanese-word.type';
import * as api from '../services/api';

export function useVocabulary() {
  const [entries, setEntries] = useState<JapaneseWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    try {
      setLoading(true);
      const words = await api.getWords();
      setEntries(words);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vocabulary. Please ensure the API is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const addEntry = async (
    newEntry: Omit<JapaneseWord, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const addedEntry = await api.addWord(newEntry);
      setEntries((prev) => [...prev, addedEntry]);
    } catch (err) {
      console.error('Failed to add word:', err);
      // Optionally, set an error state to show in the UI
    }
  };

  const addMultipleEntries = async (
    newEntries: Omit<JapaneseWord, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => {
    try {
      // Use the new, efficient batch endpoint
      await api.addManyWords(newEntries);
      // After a successful batch-add, refetch all words to get the updated list
      await fetchWords();
    } catch (err) {
      console.error('Failed to add multiple words:', err);
    }
  };
  const updateEntry = async (id: string, updates: Partial<JapaneseWord>) => {
    try {
      const updatedEntry = await api.updateWord(id, updates);
      setEntries((prev) => prev.map((e) => (e.id === id ? updatedEntry : e)));
    } catch (err) {
      console.error('Failed to update word:', err);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await api.deleteWord(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Failed to delete word:', err);
    }
  };

  const getStats = useCallback(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.total++;
        if (entry.status) {
          acc.byStatus[entry.status]++;
        }
        if (entry.type) {
          acc.byType[entry.type]++;
        }
        if (entry.difficulty) {
          acc.byDifficulty[entry.difficulty]++;
        }
        return acc;
      },
      {
        total: 0,
        byStatus: {
          [StudyStatus.NEW]: 0,
          [StudyStatus.LEARNING]: 0,
          [StudyStatus.REVIEWING]: 0,
          [StudyStatus.MASTERED]: 0,
        },
        byType: (Object.values(WordType) as WordType[]).reduce((acc, type) => {
          acc[type] = 0;
          return acc;
        }, {} as Record<WordType, number>),
        byDifficulty: (
          Object.values(DifficultyLevel) as DifficultyLevel[]
        ).reduce((acc, difficulty) => {
          acc[difficulty] = 0;
          return acc;
        }, {} as Record<DifficultyLevel, number>),
      }
    );
  }, [entries]);

  return {
    entries,
    loading,
    error,
    addEntry,
    addMultipleEntries,
    updateEntry,
    deleteEntry,
    getStats,
  };
}
