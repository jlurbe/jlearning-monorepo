import { PartialType } from '@nestjs/mapped-types';
import { CreateJapaneseWordDto } from './create-japanese-word.dto';

export class UpdateJapaneseWordDto extends PartialType(CreateJapaneseWordDto) {}
