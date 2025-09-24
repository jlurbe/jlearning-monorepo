"use client"

import { Card, CardContent } from "./ui/card"
import { BookOpen, BarChart3, TrendingUp, Target } from "lucide-react"
import type { VocabularyStats as StatsType } from "../types/vocabulary"

interface VocabularyStatsProps {
  stats: StatsType
}

export function VocabularyStats({ stats }: VocabularyStatsProps) {
  const progressPercentage = stats.total > 0 ? Math.round((stats.byStatus.mastered / stats.total) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Words */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Words</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mastered */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mastered</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.byStatus.mastered}</p>
              <p className="text-xs text-muted-foreground">{progressPercentage}% complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Learning</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.byStatus.learning}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviewing */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reviewing</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.byStatus.reviewing}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
