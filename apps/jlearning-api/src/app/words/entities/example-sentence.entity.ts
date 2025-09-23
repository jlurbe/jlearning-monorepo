import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JapaneseWord } from './japanese-word.entity';

@Entity('example_sentences')
export class ExampleSentence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false, name: 'sentence_jp' })
  sentenceJp: string; // Japanese sentence

  @Column({ type: 'text', nullable: false, name: 'sentence_reading' })
  sentenceReading: string; // Hiragana/Katakana reading

  @Column({ type: 'text', nullable: false, name: 'sentence_en' })
  sentenceEn: string; // English translation

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(
    () => JapaneseWord,
    (japaneseWord) => japaneseWord.exampleSentences,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'word_id' })
  japaneseWord: JapaneseWord;
}
