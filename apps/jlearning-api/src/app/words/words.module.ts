import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JapaneseWord } from './entities/japanese-word.entity';
import { JapaneseWordService } from './services/japanese-word.service';
import { WordsController } from './words.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JapaneseWord])],
  controllers: [WordsController],
  providers: [JapaneseWordService],
})
export class WordsModule {}
