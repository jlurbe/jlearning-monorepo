import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  WordType,
  StudyStatus,
  DifficultyLevel,
} from '@jlearning-monorepo/api-common/shared/vocabulary';

export class CreateJapaneseWordDto {
  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsOptional()
  reading?: string;

  @IsString()
  @IsOptional()
  translation?: string;

  @IsString()
  @IsOptional()
  pronunciation?: string;

  @IsString()
  @IsOptional()
  exampleSentence?: string;

  @IsEnum(WordType)
  @IsOptional()
  type?: WordType;

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
}
