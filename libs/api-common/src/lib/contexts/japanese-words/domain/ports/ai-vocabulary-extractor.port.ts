import { JapaneseWord } from '../../../shared/domain/japanese-word.type';

/**
 * Port interface for AI-powered vocabulary extraction from Japanese text.
 * This abstraction allows the domain to work with any AI service implementation.
 */
export abstract class AiVocabularyExtractorPort {
  /**
   * Extracts Japanese vocabulary from the given text using AI analysis.
   * @param text - The Japanese text to analyze
   * @returns Promise resolving to an array of partial Japanese word objects
   */
  abstract extractVocabularyFromText(
    text: string
  ): Promise<Partial<JapaneseWord>[]>;
}
