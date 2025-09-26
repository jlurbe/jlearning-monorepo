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
import { CreateJapaneseWordDto } from './dto/create-japanese-word.dto';
import { CreateManyJapaneseWordsDto } from './dto/create-many-japanese-words.dto';
import { AnalyzeTextDto } from './dto/analyze-text.dto';
import { UpdateJapaneseWordDto } from './dto/update-japanese-word.dto';
import { AiService } from './services/ai.service';

@Controller('japanese-words')
export class JapanesWordsController {
  constructor(
    private readonly japaneseWordService: JapaneseWordsService,
    private readonly aiService: AiService
  ) {}

  @Post('analyze')
  analyzeText(@Body() analyzeTextDto: AnalyzeTextDto) {
    return this.aiService.getVocabularyFromText(analyzeTextDto.text);
  }
  @Post()
  create(@Body() createJapaneseWordDto: CreateJapaneseWordDto) {
    return this.japaneseWordService.createJapaneseWord(createJapaneseWordDto);
  }

  @Post('batch')
  async createMany(@Body() createManyDto: CreateManyJapaneseWordsDto) {
    const result = await this.japaneseWordService.createManyJapaneseWords(
      createManyDto.words
    );
    return { created: result.identifiers.length };
  }

  @Get()
  findAll() {
    return this.japaneseWordService.getAllJapaneseWords();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const word = await this.japaneseWordService.getJapaneseWordById(id);
    if (!word) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
    return word;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJapaneseWordDto: UpdateJapaneseWordDto
  ) {
    const updatedWord = await this.japaneseWordService.updateJapaneseWord(
      id,
      updateJapaneseWordDto
    );
    if (!updatedWord) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
    return updatedWord;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.japaneseWordService.deleteJapaneseWord(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
  }
}
