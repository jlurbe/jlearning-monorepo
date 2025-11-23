import { Test, TestingModule } from '@nestjs/testing';
import { JapanesWordsController } from './japanese-words.controller';
import { JapaneseWordsCommandService } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/services/japanese-words-command.service';
import { JapaneseWordsQueryService } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/services/japanese-words-query.service';
import { AiVocabularyService } from '@jlearning-monorepo/api-common/contexts/japanese-words/application/services/ai-vocabulary.service';
import { CreateJapaneseWordDto } from '@jlearning-monorepo/api-common/contexts/japanese-words/domain/dto/create-japanese-word.dto';
import { JapaneseWordEntity } from '../../../../../libs/api-common/src/lib/contexts/japanese-words/domain/entities/japanese-word';
import { NotFoundException } from '@nestjs/common';

describe('JapanesWordsController', () => {
  let controller: JapanesWordsController;
  let commandService: JapaneseWordsCommandService;
  let queryService: JapaneseWordsQueryService;
  let aiService: AiVocabularyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JapanesWordsController],
      providers: [
        {
          provide: JapaneseWordsCommandService,
          useValue: {
            createJapaneseWord: jest.fn(),
            createManyJapaneseWords: jest.fn(),
            updateJapaneseWord: jest.fn(),
            deleteJapaneseWord: jest.fn(),
          },
        },
        {
          provide: JapaneseWordsQueryService,
          useValue: {
            getAllJapaneseWords: jest.fn(),
            getJapaneseWordById: jest.fn(),
          },
        },
        {
          provide: AiVocabularyService,
          useValue: {
            extractVocabularyFromText: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JapanesWordsController>(JapanesWordsController);
    commandService = module.get<JapaneseWordsCommandService>(
      JapaneseWordsCommandService
    );
    queryService = module.get<JapaneseWordsQueryService>(
      JapaneseWordsQueryService
    );
    aiService = module.get<AiVocabularyService>(AiVocabularyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a japanese word', async () => {
      const dto: CreateJapaneseWordDto = {
        word: 'word',
        reading: 'reading',
        translation: 'translation',
        pronunciation: 'pronunciation',
        exampleSentence: 'sentence',
        type: 'noun' as any,
        notes: 'notes',
        status: 'learning' as any,
        difficulty: 'easy' as any,
        reviewedAt: new Date(),
      };

      const expectedEntity = {
        toPrimitives: () => ({ ...dto, id: 'id' }),
      } as unknown as JapaneseWordEntity;

      jest
        .spyOn(commandService, 'createJapaneseWord')
        .mockResolvedValue(expectedEntity);

      const result = await controller.create(dto);

      expect(commandService.createJapaneseWord).toHaveBeenCalled();
      expect(result).toEqual({ ...dto, id: 'id' });
    });
  });

  describe('findAll', () => {
    it('should return an array of japanese words', async () => {
      const expectedEntity = {
        toPrimitives: () => ({ id: 'id' }),
      } as unknown as JapaneseWordEntity;

      jest
        .spyOn(queryService, 'getAllJapaneseWords')
        .mockResolvedValue([expectedEntity]);

      const result = await controller.findAll();

      expect(queryService.getAllJapaneseWords).toHaveBeenCalled();
      expect(result).toEqual([{ id: 'id' }]);
    });
  });

  describe('findOne', () => {
    it('should return a japanese word by id', async () => {
      const expectedEntity = {
        toPrimitives: () => ({ id: 'id' }),
      } as unknown as JapaneseWordEntity;

      jest
        .spyOn(queryService, 'getJapaneseWordById')
        .mockResolvedValue(expectedEntity);

      const result = await controller.findOne('id');

      expect(queryService.getJapaneseWordById).toHaveBeenCalled();
      expect(result).toEqual({ id: 'id' });
    });

    it('should throw NotFoundException if word not found', async () => {
      jest.spyOn(queryService, 'getJapaneseWordById').mockResolvedValue(null);

      await expect(controller.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });
});
