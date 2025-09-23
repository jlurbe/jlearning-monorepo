import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JapaneseWord } from './entities/japanese-word.entity';
import { ExampleSentence } from './entities/example-sentence.entity';
import { JapaneseWordService } from './services/japanese-word.service';
import { ExampleSentenceService } from './services/example-sentence.service';
import { WordsController } from './words.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JapaneseWord, ExampleSentence])],
  controllers: [WordsController],
  providers: [JapaneseWordService, ExampleSentenceService],
})
export class WordsModule {}
