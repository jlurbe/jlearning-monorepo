import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JapaneseWordsCommandService } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/services/japanese-words-command.service';
import { JapaneseWordsQueryService } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/services/japanese-words-query.service';
import { CreateJapaneseWordCommand } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/commands/create-japanese-word.command';
import { CreateManyJapaneseWordsCommand } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/commands/create-many-japanese-words.command';
import { UpdateJapaneseWordCommand } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/commands/update-japanese-word.command';
import { DeleteJapaneseWordCommand } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/commands/delete-japanese-word.command';
import { GetAllJapaneseWordsQuery } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/queries/get-all-japanese-words.query';
import { GetJapaneseWordByIdQuery } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/queries/get-japanese-word-by-id.query';
import { CreateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/create-japanese-word.dto';
import { CreateManyJapaneseWordsDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/create-many-japanese-words.dto';
import { AnalyzeTextDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/analyze-text.dto';
import { UpdateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/update-japanese-word.dto';
import { AiVocabularyService } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/services/ai-vocabulary.service';
import { JapaneseWordPrimitives } from '../../../../../libs/api-common/src/lib/contexts/japanese-words/domain/entities/japanese-word';

@Controller('japanese-words')
export class JapanesWordsController {
  constructor(
    private readonly japaneseWordsCommandService: JapaneseWordsCommandService,
    private readonly japaneseWordsQueryService: JapaneseWordsQueryService,
    private readonly aiVocabularyService: AiVocabularyService
  ) {}

  @Post('analyze')
  analyzeText(
    @Body() analyzeTextDto: AnalyzeTextDto
  ): Promise<JapaneseWordPrimitives[]> {
    return this.aiVocabularyService
      .extractVocabularyFromText(analyzeTextDto.text)
      .then((words) => words.map((word) => word as JapaneseWordPrimitives));
  }
  @Post()
  async create(
    @Body() createJapaneseWordDto: CreateJapaneseWordDto
  ): Promise<JapaneseWordPrimitives> {
    const command = new CreateJapaneseWordCommand(
      createJapaneseWordDto.word,
      createJapaneseWordDto.reading,
      createJapaneseWordDto.translation,
      createJapaneseWordDto.pronunciation,
      createJapaneseWordDto.exampleSentence,
      createJapaneseWordDto.type,
      createJapaneseWordDto.notes,
      createJapaneseWordDto.status,
      createJapaneseWordDto.difficulty,
      createJapaneseWordDto.reviewedAt
    );

    const result = await this.japaneseWordsCommandService.createJapaneseWord(
      command
    );
    return result.toPrimitives();
  }

  @Post('batch')
  async createMany(
    @Body() createManyDto: CreateManyJapaneseWordsDto
  ): Promise<{ created: number; words: JapaneseWordPrimitives[] }> {
    const commands = createManyDto.words.map(
      (word) =>
        new CreateJapaneseWordCommand(
          word.word,
          word.reading,
          word.translation,
          word.pronunciation,
          word.exampleSentence,
          word.type,
          word.notes,
          word.status,
          word.difficulty,
          word.reviewedAt
        )
    );

    const command = new CreateManyJapaneseWordsCommand(commands);
    const result =
      await this.japaneseWordsCommandService.createManyJapaneseWords(command);

    return {
      created: result.length,
      words: result.map((word) => word.toPrimitives()),
    };
  }

  @Get()
  async findAll(): Promise<JapaneseWordPrimitives[]> {
    const query = new GetAllJapaneseWordsQuery();
    const result = await this.japaneseWordsQueryService.getAllJapaneseWords(
      query
    );
    return result.map((word) => word.toPrimitives());
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<JapaneseWordPrimitives> {
    const query = new GetJapaneseWordByIdQuery(id);
    const word = await this.japaneseWordsQueryService.getJapaneseWordById(
      query
    );
    if (!word) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
    return word.toPrimitives();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJapaneseWordDto: UpdateJapaneseWordDto
  ): Promise<JapaneseWordPrimitives> {
    const command = new UpdateJapaneseWordCommand(
      id,
      updateJapaneseWordDto.word,
      updateJapaneseWordDto.reading,
      updateJapaneseWordDto.translation,
      updateJapaneseWordDto.pronunciation,
      updateJapaneseWordDto.exampleSentence,
      updateJapaneseWordDto.type,
      updateJapaneseWordDto.notes,
      updateJapaneseWordDto.status,
      updateJapaneseWordDto.difficulty,
      updateJapaneseWordDto.reviewedAt
    );

    const updatedWord =
      await this.japaneseWordsCommandService.updateJapaneseWord(command);
    if (!updatedWord) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
    return updatedWord.toPrimitives();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const command = new DeleteJapaneseWordCommand(id);
    await this.japaneseWordsCommandService.deleteJapaneseWord(command);
  }
}
