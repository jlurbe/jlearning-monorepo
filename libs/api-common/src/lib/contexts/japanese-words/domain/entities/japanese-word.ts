import { Entity } from '../../../shared/domain/entities/entity';
import {
  DifficultyLevel as DifficultyLevelEnum,
  StudyStatus as StudyStatusEnum,
  WordType as WordTypeEnum,
  JapaneseWord,
} from '../../../shared/domain/japanese-word.type';
import {
  Id,
  Word,
  Reading,
  Translation,
  Pronunciation,
  ExampleSentence,
  WordType,
  DifficultyLevel,
  StudyStatus,
  Notes,
  ReviewedAt,
} from '../value-objects';

export class JapaneseWordPrimitive implements JapaneseWord {
  id?: string;
  word!: string;
  reading?: string | null;
  translation?: string | null;
  pronunciation?: string | null;
  exampleSentence?: string | null;
  type?: WordTypeEnum | null;
  difficulty?: DifficultyLevelEnum | null;
  status?: StudyStatusEnum | null;
  notes?: string | null;
  reviewedAt?: Date | null;
}

export class JapaneseWordEntity
  implements Entity<JapaneseWordEntity, JapaneseWordPrimitive>
{
  private readonly id: Id;
  private readonly word: Word;
  private readonly reading?: Reading | null;
  private readonly translation?: Translation | null;
  private readonly pronunciation?: Pronunciation | null;
  private readonly exampleSentence?: ExampleSentence | null;
  private readonly type?: WordType | null;
  private readonly difficulty?: DifficultyLevel | null;
  private readonly status?: StudyStatus | null;
  private readonly notes?: Notes | null;
  private readonly reviewedAt?: ReviewedAt | null;

  constructor(primitive: JapaneseWordPrimitive) {
    this.id = new Id(primitive.id || crypto.randomUUID());
    this.word = new Word(primitive.word);
    this.reading = primitive.reading ? new Reading(primitive.reading) : null;
    this.translation = primitive.translation
      ? new Translation(primitive.translation)
      : null;
    this.pronunciation = primitive.pronunciation
      ? new Pronunciation(primitive.pronunciation)
      : null;
    this.exampleSentence = primitive.exampleSentence
      ? new ExampleSentence(primitive.exampleSentence)
      : null;
    this.type = primitive.type ? new WordType(primitive.type) : null;
    this.difficulty = primitive.difficulty
      ? new DifficultyLevel(primitive.difficulty)
      : null;
    this.status = primitive.status ? new StudyStatus(primitive.status) : null;
    this.notes = primitive.notes ? new Notes(primitive.notes) : null;
    this.reviewedAt = primitive.reviewedAt
      ? new ReviewedAt(primitive.reviewedAt)
      : null;
  }

  toPrimitives(): JapaneseWordPrimitive {
    return {
      id: this.id.value,
      word: this.word.value,
      reading: this.reading?.value || null,
      translation: this.translation?.value || null,
      pronunciation: this.pronunciation?.value || null,
      exampleSentence: this.exampleSentence?.value || null,
      type: this.type?.value || null,
      difficulty: this.difficulty?.value || null,
      status: this.status?.value || null,
      notes: this.notes?.value || null,
      reviewedAt: this.reviewedAt?.value
        ? new Date(this.reviewedAt.value)
        : null,
    };
  }
}
