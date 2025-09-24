import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JapaneseWord } from './entities/japanese-word.entity';
import { JapaneseWordService } from './services/japanese-word.service';
import { WordsController } from './words.controller';
import { AiService } from './services/ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([JapaneseWord])],
  controllers: [WordsController],
  providers: [JapaneseWordService, AiService],
})
export class WordsModule {}
