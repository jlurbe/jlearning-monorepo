import { Injectable } from '@nestjs/common';
import { JapaneseWord } from '../../../shared/domain/japanese-word.type';
import { AiVocabularyExtractorPort } from '../../domain/ports/ai-vocabulary-extractor.port';

/**
 * Application service for AI-powered Japanese vocabulary analysis.
 * This service orchestrates the vocabulary extraction process using the injected AI adapter.
 */
@Injectable()
export class AiVocabularyService {
  constructor(
    private readonly aiVocabularyExtractor: AiVocabularyExtractorPort
  ) {}

  /**
   * Extracts Japanese vocabulary from the given text using AI analysis.
   * @param text - The Japanese text to analyze
   * @returns Promise resolving to an array of partial Japanese word objects
   */
  async extractVocabularyFromText(
    text: string
  ): Promise<Partial<JapaneseWord>[]> {
    return this.aiVocabularyExtractor.extractVocabularyFromText(text);
  }
}
