export enum StudyStatus {
  NOT_LEARNED = 'not_learned',
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
}

export interface VocabularyEntry {
  id: string; // Use string for frontend consistency
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

export interface VocabularyStats {
  total: number;
  byStatus: Record<StudyStatus, number>;
  byType: Record<WordType, number>;
  byDifficulty: Record<DifficultyLevel, number>;
}
