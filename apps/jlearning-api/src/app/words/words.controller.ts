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
import { JapaneseWordService } from './services/japanese-word.service';
import { CreateJapaneseWordDto } from './dto/create-japanese-word.dto';
import { AnalyzeTextDto } from './dto/analyze-text.dto';
import { UpdateJapaneseWordDto } from './dto/update-japanese-word.dto';
import { AiService } from './services/ai.service';

@Controller('words')
export class WordsController {
  constructor(
    private readonly japaneseWordService: JapaneseWordService,
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
