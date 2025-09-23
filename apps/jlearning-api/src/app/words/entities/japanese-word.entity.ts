import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  StudyStatus,
  DifficultyLevel,
  WordType,
} from '../../enums/vocabulary.enums';
import { ExampleSentence } from './example-sentence.entity';

@Entity('japanese_words')
export class JapaneseWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  word: string; // Kanji/Kana

  @Column({ type: 'text', nullable: false })
  reading: string; // Hiragana/Katakana

  @Column({ type: 'text', nullable: false })
  translation: string; // English meaning

  @Column({ type: 'text', nullable: false })
  pronunciation: string; // Romaji

  @Column({
    type: 'enum',
    enum: WordType,
    nullable: false,
  })
  type: WordType; // Noun, Verb, etc.

  @Column({ type: 'text', nullable: true })
  notes: string | null; // Usage, nuance

  @Column({ type: 'enum', enum: StudyStatus, default: StudyStatus.NOT_LEARNED })
  status: StudyStatus; // Learning status

  @Column({
    type: 'enum',
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

  @OneToMany(
    () => ExampleSentence,
    (exampleSentence) => exampleSentence.japaneseWord,
    { cascade: true }
  )
  exampleSentences: ExampleSentence[];
}
