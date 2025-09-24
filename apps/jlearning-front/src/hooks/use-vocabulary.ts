'use client';

import { useState, useEffect } from 'react';
import type { VocabularyEntry, VocabularyStats } from '../types/vocabulary';

const STORAGE_KEY = 'japanese-vocabulary';

export function useVocabulary() {
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt),
        }));
        setEntries(entriesWithDates);
      }
    } catch (error) {
      console.error('Failed to load vocabulary entries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch (error) {
        console.error('Failed to save vocabulary entries:', error);
      }
    }
  }, [entries, loading]);

  const addEntry = (
    entry: Omit<VocabularyEntry, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newEntry: VocabularyEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEntries((prev) => [...prev, newEntry]);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<VocabularyEntry>) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date() }
          : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const getStats = (): VocabularyStats => {
    const stats: VocabularyStats = {
      total: entries.length,
      byStatus: {
        new: 0,
        learning: 0,
        reviewing: 0,
        mastered: 0,
      },
      byType: {
        noun: 0,
        verb: 0,
        adjective: 0,
        adverb: 0,
        particle: 0,
        conjunction: 0,
        interjection: 0,
        counter: 0,
        expression: 0,
      },
      byDifficulty: {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
      },
    };

    entries.forEach((entry) => {
      stats.byStatus[entry.status]++;
      stats.byType[entry.type]++;
      stats.byDifficulty[entry.difficulty]++;
    });

    return stats;
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    getStats,
  };
}
