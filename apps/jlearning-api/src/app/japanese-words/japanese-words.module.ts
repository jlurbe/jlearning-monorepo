import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JapaneseWordsService } from './services/japanese-words.service';
import { JapanesWordsController } from './japanese-words.controller';
import { AiService } from './services/ai.service';
import { JapaneseWordEntity } from '@jlearning-monorepo/api-common/contexts/japanese-words/infrastructure/entities/japanese-word.entity';
import { JapaneseWordsRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/repositories/japanese-words.repository';
import { JapaneseWordsTypeormRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/infrastructure/repositories/japanese-words-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JapaneseWordEntity])],
  controllers: [JapanesWordsController],
  providers: [
    JapaneseWordsService,
    {
      provide: JapaneseWordsRepository,
      useClass: JapaneseWordsTypeormRepository,
    },
    AiService,
  ],
})
export class JapaneseWordsModule {}
