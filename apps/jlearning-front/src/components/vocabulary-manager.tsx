"use client"
import { Card, CardContent } from "./ui/card"
import { VocabularyTable } from "./vocabulary-table"
import { VocabularyStats } from "./vocabulary-stats"
import { BookOpen } from "lucide-react"
import { useVocabulary } from "../hooks/use-vocabulary"
import type { VocabularyEntry } from "@jlearning-monorepo/api-common/shared/vocabulary"

export function VocabularyManager() {
  const { entries, loading, addEntry, updateEntry, deleteEntry, getStats } = useVocabulary()

  const handleUpdateEntry = (id: string, updates: Partial<VocabularyEntry>) => {
    updateEntry(id, updates)
  }

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
  }

  const handleAddEntry = (entry: Omit<VocabularyEntry, "id" | "createdAt" | "updatedAt">) => {
    addEntry(entry)
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
      <VocabularyStats stats={stats} />

      <Card>
        <CardContent className="p-0">
          <VocabularyTable
            entries={entries}
            onUpdate={handleUpdateEntry}
            onDelete={handleDeleteEntry}
            onAdd={handleAddEntry}
          />
        </CardContent>
      </Card>
    </div>
  )
}
