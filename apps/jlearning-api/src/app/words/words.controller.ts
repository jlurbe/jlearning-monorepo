import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JapaneseWordService } from './services/japanese-word.service';
import { CreateJapaneseWordDto } from './dto/create-japanese-word.dto';
import { UpdateJapaneseWordDto } from './dto/update-japanese-word.dto';

@Controller('words')
export class WordsController {
  constructor(private readonly japaneseWordService: JapaneseWordService) {}

  @Post()
  create(@Body() createJapaneseWordDto: CreateJapaneseWordDto) {
    const { exampleSentences, ...wordData } = createJapaneseWordDto;
    return this.japaneseWordService.createJapaneseWord(
      wordData,
      exampleSentences
    );
  }

  @Get()
  findAll() {
    return this.japaneseWordService.getAllJapaneseWords();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const word = await this.japaneseWordService.getJapaneseWordById(id);
    if (!word) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
    return word;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJapaneseWordDto: UpdateJapaneseWordDto
  ) {
    const { exampleSentences, ...wordData } = updateJapaneseWordDto;
    // Note: This simple update doesn't handle updating/adding/removing example sentences, only the word's properties.
    const updatedWord = await this.japaneseWordService.updateJapaneseWord(
      id,
      wordData
    );
    if (!updatedWord) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
    return updatedWord;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.japaneseWordService.deleteJapaneseWord(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
  }
}
