export interface VocabularyEntry {
  id: string;
  word: string;
  reading: string;
  translation: string;
  pronunciation: string;
  exampleSentence: string;
  type: WordType;
  difficulty: DifficultyLevel;
  status: StudyStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WordType =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'particle'
  | 'conjunction'
  | 'interjection'
  | 'counter'
  | 'expression';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type StudyStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface VocabularyStats {
  total: number;
  byStatus: Record<StudyStatus, number>;
  byType: Record<WordType, number>;
  byDifficulty: Record<DifficultyLevel, number>;
}
