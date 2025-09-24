import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  WordType,
  StudyStatus,
  DifficultyLevel,
} from '@jlearning-monorepo/api-common/shared/vocabulary';
import { CreateExampleSentenceDto } from './create-example-sentence.dto';

export class CreateJapaneseWordDto {
  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsNotEmpty()
  reading: string;

  @IsString()
  @IsNotEmpty()
  translation: string;

  @IsString()
  @IsNotEmpty()
  pronunciation: string;

  @IsEnum(WordType)
  @IsNotEmpty()
  type: WordType;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(StudyStatus)
  @IsOptional()
  status?: StudyStatus;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  reviewedAt?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExampleSentenceDto)
  @IsOptional()
  exampleSentences?: CreateExampleSentenceDto[];
}
