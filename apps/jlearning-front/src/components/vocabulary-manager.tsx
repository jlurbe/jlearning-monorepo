"use client"
import { Card, CardContent } from "./ui/card"
import { VocabularyTable } from "./vocabulary-table"
import { VocabularyStats } from "./vocabulary-stats"
import { BookOpen } from "lucide-react"
import { useVocabulary } from "../hooks/use-vocabulary"
import type {
  JapaneseWord,
  JapaneseWordsStats as StatsType,
} from '@jlearning-monorepo/api-common/contexts/shared/domain/japanese-word.type';

export function VocabularyManager() {
  const { entries, loading, addEntry, addMultipleEntries, updateEntry, deleteEntry, getStats } =
    useVocabulary();

  const handleUpdateEntry = (id: string, updates: Partial<JapaneseWord>) => {
    updateEntry(id, updates)
  }

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
  }

  const handleAddEntry = (entry: Omit<JapaneseWord, "id" | "createdAt" | "updatedAt">) => {
    addEntry(entry)
  }

  const handleAddMultipleEntries = (
    entries: Omit<JapaneseWord, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => {
    addMultipleEntries(entries);
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your vocabulary...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6"> 
      <VocabularyStats stats={stats as StatsType} />

      <Card>
        <CardContent className="p-0">
          <VocabularyTable
            entries={entries}
            onUpdate={handleUpdateEntry}
            onDelete={handleDeleteEntry}
            onAdd={handleAddEntry}
            onAddMultiple={handleAddMultipleEntries}
          />
        </CardContent>
      </Card>
    </div>
  )
}
