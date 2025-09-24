import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateJapaneseWordDto } from './create-japanese-word.dto';

export class CreateManyJapaneseWordsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJapaneseWordDto)
  words: CreateJapaneseWordDto[];
}
