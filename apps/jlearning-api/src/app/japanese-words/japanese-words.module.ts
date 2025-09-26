import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JapaneseWordEntity } from './entities/japanese-word.entity';
import { JapaneseWordsService } from './services/japanese-words.service';
import { JapanesWordsController } from './japanese-words.controller';
import { AiService } from './services/ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([JapaneseWordEntity])],
  controllers: [JapanesWordsController],
  providers: [JapaneseWordsService, AiService],
})
export class JapaneseWordsModule {}
