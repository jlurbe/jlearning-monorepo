import { Module } from '@nestjs/common';
import { JapanesWordsController } from './japanese-words.controller';
import { AiService } from './services/ai.service';
import { JapaneseWordsRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/repositories/japanese-words.repository';
import { JapaneseWordsDrizzleRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/infrastructure/repositories/japanese-words-drizzle.repository';
import { DatabaseService } from '../common/database/database.service';
import {
  JapaneseWordsCommandService,
  JapaneseWordsQueryService,
  CreateJapaneseWordHandler,
  CreateManyJapaneseWordsHandler,
  UpdateJapaneseWordHandler,
  DeleteJapaneseWordHandler,
  GetAllJapaneseWordsHandler,
  GetJapaneseWordByIdHandler,
} from '@jlearning-monorepo/api-common/contexts/japanese-words/application';

@Module({
  imports: [],
  controllers: [JapanesWordsController],
  providers: [
    // Infrastructure
    DatabaseService,
    {
      provide: 'IDatabaseService',
      useExisting: DatabaseService,
    },
    {
      provide: JapaneseWordsRepository,
      useClass: JapaneseWordsDrizzleRepository,
    },

    // Command Handlers
    CreateJapaneseWordHandler,
    CreateManyJapaneseWordsHandler,
    UpdateJapaneseWordHandler,
    DeleteJapaneseWordHandler,

    // Query Handlers
    GetAllJapaneseWordsHandler,
    GetJapaneseWordByIdHandler,

    // Application Services
    JapaneseWordsCommandService,
    JapaneseWordsQueryService,

    // Other Services
    AiService,
  ],
})
export class JapaneseWordsModule {}
