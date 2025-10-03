import { Module } from '@nestjs/common';
import { JapaneseWordsService } from './services/japanese-words.service';
import { JapanesWordsController } from './japanese-words.controller';
import { AiService } from './services/ai.service';
import { JapaneseWordsRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/repositories/japanese-words.repository';
import { JapaneseWordsDrizzleRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/infrastructure/repositories/japanese-words-drizzle.repository';
import { DatabaseService } from '../common/database/database.service';

@Module({
  imports: [],
  controllers: [JapanesWordsController],
  providers: [
    JapaneseWordsService,
    DatabaseService,
    {
      provide: 'IDatabaseService',
      useExisting: DatabaseService,
    },
    {
      provide: JapaneseWordsRepository,
      useClass: JapaneseWordsDrizzleRepository,
    },
    AiService,
  ],
})
export class JapaneseWordsModule {}
