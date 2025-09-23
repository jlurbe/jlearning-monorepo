import { IsString, IsNotEmpty } from 'class-validator';

export class CreateExampleSentenceDto {
  @IsString()
  @IsNotEmpty()
  sentenceJp: string;

  @IsString()
  @IsNotEmpty()
  sentenceReading: string;

  @IsString()
  @IsNotEmpty()
  sentenceEn: string;
}
