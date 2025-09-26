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
export class JapaneseWordEntity implements VocabularyEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false, unique: true })
  word: string;

  @Column({ type: 'text', nullable: true })
  reading: string | null; // Hiragana/Katakana

  @Column({ type: 'text', nullable: true })
  translation: string | null; // English meaning

  @Column({ type: 'text', nullable: true })
  pronunciation: string | null; // Romaji

  @Column({ type: 'text', nullable: true, name: 'example_sentence' })
  exampleSentence: string | null;

  @Column({ type: 'simple-enum', enum: WordType, nullable: true })
  type: WordType | null; // Noun, Verb, etc.

  @Column({ type: 'text', nullable: true })
  notes: string | null; // Usage, nuance

  @Column({
    type: 'simple-enum',
    enum: StudyStatus,
    default: StudyStatus.NEW,
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
