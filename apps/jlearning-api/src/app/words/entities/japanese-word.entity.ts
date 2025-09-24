import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  StudyStatus,
  DifficultyLevel,
  WordType,
  VocabularyEntry,
} from '@jlearning-monorepo/api-common/shared/vocabulary';

@Entity('japanese_words')
export class JapaneseWord implements VocabularyEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  word: string; // Kanji/Kana

  @Column({ type: 'text', nullable: false })
  reading: string; // Hiragana/Katakana

  @Column({ type: 'text', nullable: false })
  translation: string; // English meaning

  @Column({ type: 'text', nullable: false })
  pronunciation: string; // Romaji

  @Column({ type: 'text', nullable: true, name: 'example_sentence' })
  exampleSentence: string | null;

  @Column({ type: 'simple-enum', enum: WordType, nullable: false })
  type: WordType; // Noun, Verb, etc.

  @Column({ type: 'text', nullable: true })
  notes: string | null; // Usage, nuance

  @Column({
    type: 'simple-enum',
    enum: StudyStatus,
    default: StudyStatus.NOT_LEARNED,
  })
  status: StudyStatus; // Learning status

  @Column({
    type: 'simple-enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.BEGINNER,
  })
  difficulty: DifficultyLevel; // Difficulty level

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true, name: 'reviewed_at' })
  reviewedAt: Date | null;
}
