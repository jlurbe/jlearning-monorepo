import { Test, TestingModule } from '@nestjs/testing';
import { JapaneseWordsCommandService } from './japanese-words-command.service';
import { CreateJapaneseWordHandler } from '../commands/handlers/create-japanese-word.handler';
import { CreateManyJapaneseWordsHandler } from '../commands/handlers/create-many-japanese-words.handler';
import { UpdateJapaneseWordHandler } from '../commands/handlers/update-japanese-word.handler';
import { DeleteJapaneseWordHandler } from '../commands/handlers/delete-japanese-word.handler';
import { CreateJapaneseWordCommand } from '../commands/create-japanese-word.command';
import { JapaneseWordEntity } from '../../domain/entities/japanese-word';
import { CreateManyJapaneseWordsCommand } from '../commands/create-many-japanese-words.command';
import { UpdateJapaneseWordCommand } from '../commands/update-japanese-word.command';
import { DeleteJapaneseWordCommand } from '../commands/delete-japanese-word.command';


describe('JapaneseWordsCommandService', () => {
  let service: JapaneseWordsCommandService;
  let createHandler: CreateJapaneseWordHandler;
  let createManyHandler: CreateManyJapaneseWordsHandler;
  let updateHandler: UpdateJapaneseWordHandler;
  let deleteHandler: DeleteJapaneseWordHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JapaneseWordsCommandService,
        {
          provide: CreateJapaneseWordHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateManyJapaneseWordsHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateJapaneseWordHandler,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteJapaneseWordHandler,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<JapaneseWordsCommandService>(
      JapaneseWordsCommandService
    );
    createHandler = module.get<CreateJapaneseWordHandler>(
      CreateJapaneseWordHandler
    );
    createManyHandler = module.get<CreateManyJapaneseWordsHandler>(
      CreateManyJapaneseWordsHandler
    );
    updateHandler = module.get<UpdateJapaneseWordHandler>(
      UpdateJapaneseWordHandler
    );
    deleteHandler = module.get<DeleteJapaneseWordHandler>(
      DeleteJapaneseWordHandler
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createJapaneseWord', () => {
    it('should call CreateJapaneseWordHandler.execute', async () => {
      const command = new CreateJapaneseWordCommand(
        'word',
        'reading',
        'translation',
        'pronunciation',
        'sentence',
        'noun',
        'notes',
        'learning',
        'easy',
        new Date()
      );
      const expectedResult = {} as JapaneseWordEntity;
      jest.spyOn(createHandler, 'execute').mockResolvedValue(expectedResult);

      const result = await service.createJapaneseWord(command);

      expect(createHandler.execute).toHaveBeenCalledWith(command);
      expect(result).toBe(expectedResult);
    });
  });

  describe('createManyJapaneseWords', () => {
    it('should call CreateManyJapaneseWordsHandler.execute', async () => {
      const command = new CreateManyJapaneseWordsCommand([]);
      const expectedResult = [] as JapaneseWordEntity[];
      jest
        .spyOn(createManyHandler, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await service.createManyJapaneseWords(command);

      expect(createManyHandler.execute).toHaveBeenCalledWith(command);
      expect(result).toBe(expectedResult);
    });
  });

  describe('updateJapaneseWord', () => {
    it('should call UpdateJapaneseWordHandler.execute', async () => {
      const command = new UpdateJapaneseWordCommand(
        'id',
        'word',
        'reading',
        'translation',
        'pronunciation',
        'sentence',
        'noun',
        'notes',
        'learning',
        'easy',
        new Date()
      );
      const expectedResult = {} as JapaneseWordEntity;
      jest.spyOn(updateHandler, 'execute').mockResolvedValue(expectedResult);

      const result = await service.updateJapaneseWord(command);

      expect(updateHandler.execute).toHaveBeenCalledWith(command);
      expect(result).toBe(expectedResult);
    });
  });

  describe('deleteJapaneseWord', () => {
    it('should call DeleteJapaneseWordHandler.execute', async () => {
      const command = new DeleteJapaneseWordCommand('id');
      jest.spyOn(deleteHandler, 'execute').mockResolvedValue(undefined);

      await service.deleteJapaneseWord(command);

      expect(deleteHandler.execute).toHaveBeenCalledWith(command);
    });
  });
});
