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
import { JapaneseWordsService } from './services/japanese-words.service';
import { CreateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/create-japanese-word.dto';
import { CreateManyJapaneseWordsDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/create-many-japanese-words.dto';
import { AnalyzeTextDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/analyze-text.dto';
import { UpdateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/update-japanese-word.dto';
import { AiService } from './services/ai.service';
import { JapaneseWordPrimitives } from '../../../../../libs/api-common/src/lib/contexts/japanese-words/domain/entities/japanese-word';

@Controller('japanese-words')
export class JapanesWordsController {
  constructor(
    private readonly japaneseWordService: JapaneseWordsService,
    private readonly aiService: AiService
  ) {}

  @Post('analyze')
  analyzeText(
    @Body() analyzeTextDto: AnalyzeTextDto
  ): Promise<JapaneseWordPrimitives[]> {
    return this.aiService
      .getVocabularyFromText(analyzeTextDto.text)
      .then((words) => words.map((word) => word as JapaneseWordPrimitives));
  }
  @Post()
  create(
    @Body() createJapaneseWordDto: CreateJapaneseWordDto
  ): Promise<JapaneseWordPrimitives> {
    return this.japaneseWordService
      .createJapaneseWord(createJapaneseWordDto)
      .then((word) => word.toPrimitives());
  }

  @Post('batch')
  async createMany(
    @Body() createManyDto: CreateManyJapaneseWordsDto
  ): Promise<{ created: number; words: JapaneseWordPrimitives[] }> {
    const result = await this.japaneseWordService.createManyJapaneseWords(
      createManyDto.words
    );
    return {
      created: result.length,
      words: result.map((word) => word.toPrimitives()),
    };
  }

  @Get()
  async findAll(): Promise<JapaneseWordPrimitives[]> {
    return this.japaneseWordService
      .getAllJapaneseWords()
      .then((words) => words.map((word) => word.toPrimitives()));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<JapaneseWordPrimitives> {
    const word = await this.japaneseWordService.getJapaneseWordById(id);
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
    const updatedWord = await this.japaneseWordService.updateJapaneseWord(
      id,
      updateJapaneseWordDto
    );
    if (!updatedWord) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
    return updatedWord.toPrimitives();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.japaneseWordService.deleteJapaneseWord(id);
  }
}
