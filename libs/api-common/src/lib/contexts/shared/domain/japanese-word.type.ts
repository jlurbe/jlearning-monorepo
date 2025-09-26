export enum StudyStatus {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEWING = 'reviewing',
  MASTERED = 'mastered',
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum WordType {
  NOUN = 'noun',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  ADVERB = 'adverb',
  PARTICLE = 'particle',
  CONJUNCTION = 'conjunction',
  INTERJECTION = 'interjection',
  COUNTER = 'counter',
  EXPRESSION = 'expression',
  OTHER = 'other',
}

export interface JapaneseWord {
  id: string;
  word: string;
  reading: string | null;
  translation: string | null;
  pronunciation: string | null;
  exampleSentence: string | null;
  type: WordType | null;
  difficulty: DifficultyLevel | null;
  status: StudyStatus | null;
  notes: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JapaneseWordsStats {
  total: number;
  byStatus: Record<StudyStatus, number>;
  byType: Record<WordType, number>;
  byDifficulty: Record<DifficultyLevel, number>;
}
