import { Entity } from '../../../shared/domain/entities/entity';
import {
  DifficultyLevel,
  StudyStatus,
  WordType,
  JapaneseWord,
} from '../../../shared/domain/japanese-word.type';

export class JapaneseWordPrimitive implements JapaneseWord {
  id?: string;
  word!: string;
  reading?: string | null;
  translation?: string | null;
  pronunciation?: string | null;
  exampleSentence?: string | null;
  type?: WordType | null;
  difficulty?: DifficultyLevel | null;
  status?: StudyStatus | null;
  notes?: string | null;
  reviewedAt?: Date | null;
}

export class JapaneseWordEntity
  implements Entity<JapaneseWordEntity, JapaneseWordPrimitive>
{
  private readonly id?: string;
  private readonly word!: string;
  private readonly reading?: string | null;
  private readonly translation?: string | null;
  private readonly pronunciation?: string | null;
  private readonly exampleSentence?: string | null;
  private readonly type?: WordType | null;
  private readonly difficulty?: DifficultyLevel | null;
  private readonly status?: StudyStatus | null;
  private readonly notes?: string | null;
  private readonly reviewedAt?: Date | null;

  constructor(primitive: JapaneseWordPrimitive) {
    this.id = primitive.id || crypto.randomUUID();
    this.word = primitive.word;
    this.reading = primitive.reading;
    this.translation = primitive.translation;
    this.pronunciation = primitive.pronunciation;
    this.exampleSentence = primitive.exampleSentence;
    this.type = primitive.type;
    this.difficulty = primitive.difficulty;
    this.status = primitive.status;
    this.notes = primitive.notes;
    this.reviewedAt = primitive.reviewedAt;
  }

  toPrimitives(): JapaneseWordPrimitive {
    return {
      id: this.id,
      word: this.word,
      reading: this.reading,
      translation: this.translation,
      pronunciation: this.pronunciation,
      exampleSentence: this.exampleSentence,
      type: this.type,
      difficulty: this.difficulty,
      status: this.status,
      notes: this.notes,
      reviewedAt: this.reviewedAt,
    };
  }
}
