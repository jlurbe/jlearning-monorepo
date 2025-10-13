import { Module } from '@nestjs/common';
import { JapanesWordsController } from './japanese-words.controller';
import { JapaneseWordsRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/repositories/japanese-words.repository';
import { JapaneseWordsDrizzleRepository } from '@jlearning-monorepo/api-common/contexts/japanese-words/infrastructure/repositories/japanese-words-drizzle.repository';
import { AiVocabularyExtractorPort } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/ports/ai-vocabulary-extractor.port';
import { GoogleGeminiAiAdapter } from '@jlearning-monorepo/api-common/contexts/japanese-words/infrastructure/adapters/google-gemini-ai.adapter';
import { DatabaseService } from '../common/database/database.service';
import { JapaneseWordsCommandService } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/services/japanese-words-command.service';
import { JapaneseWordsQueryService } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/services/japanese-words-query.service';
import { AiVocabularyService } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/services/ai-vocabulary.service';
import { CreateJapaneseWordHandler } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/commands/handlers/create-japanese-word.handler';
import { CreateManyJapaneseWordsHandler } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/commands/handlers/create-many-japanese-words.handler';
import { UpdateJapaneseWordHandler } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/commands/handlers/update-japanese-word.handler';
import { DeleteJapaneseWordHandler } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/commands/handlers/delete-japanese-word.handler';
import { GetAllJapaneseWordsHandler } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/queries/handlers/get-all-japanese-words.handler';
import { GetJapaneseWordByIdHandler } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/queries/handlers/get-japanese-word-by-id.handler';

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
    {
      provide: AiVocabularyExtractorPort,
      useClass: GoogleGeminiAiAdapter,
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
    AiVocabularyService,
  ],
})
export class JapaneseWordsModule {}
