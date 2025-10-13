import { Entity } from '../../../shared/domain/entities/entity';
import {
  DifficultyLevel as DifficultyLevelEnum,
  StudyStatus as StudyStatusEnum,
  WordType as WordTypeEnum,
  JapaneseWord,
} from '../../../shared/domain/japanese-word.type';
import { Id } from '../value-objects/id.js';
import { Word } from '../value-objects/word.js';
import { Reading } from '../value-objects/reading.js';
import { Translation } from '../value-objects/translation.js';
import { Pronunciation } from '../value-objects/pronunciation.js';
import { ExampleSentence } from '../value-objects/example-sentence.js';
import { WordType } from '../value-objects/word-type.js';
import { DifficultyLevel } from '../value-objects/difficulty-level.js';
import { StudyStatus } from '../value-objects/study-status.js';
import { Notes } from '../value-objects/notes.js';
import { ReviewedAt } from '../value-objects/reviewed-at.js';

export class JapaneseWordPrimitives implements JapaneseWord {
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
  implements Entity<JapaneseWordEntity, JapaneseWordPrimitives>
{
  readonly id?: Id;
  readonly word: Word;
  readonly reading?: Reading | null;
  readonly translation?: Translation | null;
  readonly pronunciation?: Pronunciation | null;
  readonly exampleSentence?: ExampleSentence | null;
  readonly type?: WordType | null;
  readonly difficulty?: DifficultyLevel | null;
  readonly status?: StudyStatus | null;
  readonly notes?: Notes | null;
  readonly reviewedAt?: ReviewedAt | null;

  constructor(primitive: JapaneseWordPrimitives) {
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

  toPrimitives(): JapaneseWordPrimitives {
    return {
      id: this.id?.value,
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
