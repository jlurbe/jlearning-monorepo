import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { AiVocabularyExtractorPort } from '../../domain/ports/ai-vocabulary-extractor.port';
import {
  JapaneseWord,
  StudyStatus,
} from '../../../shared/domain/japanese-word.type';
import { GET_VOCABULARY_PROMPT } from '../constants/ai-prompts';

/**
 * Google Gemini AI adapter for vocabulary extraction.
 * Implements the AiVocabularyExtractorPort using Google's Gemini API.
 */
@Injectable()
export class GoogleGeminiAiAdapter extends AiVocabularyExtractorPort {
  private readonly logger = new Logger(GoogleGeminiAiAdapter.name);

  async extractVocabularyFromText(
    text: string
  ): Promise<Partial<JapaneseWord>[]> {
    try {
      const ai = new GoogleGenAI({});

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: this.buildPrompt(text),
      });

      this.logger.log(`AI Response: ${aiResponse.text}`);

      return this.parseMarkdownTable(aiResponse.text ?? '');
    } catch (error) {
      this.logger.error('Failed to extract vocabulary from text', error);
      throw new Error(
        `AI vocabulary extraction failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  private buildPrompt(text: string): string {
    return GET_VOCABULARY_PROMPT.replace('[PASTE_JAPANESE_TEXT_HERE]', text);
  }

  private parseMarkdownTable(markdown: string): Partial<JapaneseWord>[] {
    const rawLines = markdown.trim().split('\n');
    if (rawLines.length < 3) {
      return [];
    }

    const headers = this.extractHeaders(rawLines[0]);
    const processedRows = this.processTableRows(rawLines.slice(2));

    return this.convertRowsToJapaneseWords(headers, processedRows);
  }

  private extractHeaders(headerLine: string): string[] {
    return headerLine
      .split('|')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
  }

  private processTableRows(rawRows: string[]): string[] {
    const processedRows: string[] = [];
    let currentRow = '';

    for (const line of rawRows) {
      if (line.startsWith('|') && currentRow) {
        processedRows.push(currentRow);
        currentRow = line;
      } else {
        currentRow += (currentRow ? '\n' : '') + line;
      }
    }

    if (currentRow) {
      processedRows.push(currentRow);
    }

    return processedRows;
  }

  private convertRowsToJapaneseWords(
    headers: string[],
    rows: string[]
  ): Partial<JapaneseWord>[] {
    const entries: Partial<JapaneseWord>[] = [];

    for (const row of rows) {
      const values = row.split('|').map((v) => v.trim());
      const rowValues = values.slice(1, -1);

      const entry: Partial<JapaneseWord> = {
        status: StudyStatus.NEW,
      };

      this.mapRowToEntry(headers, rowValues, entry);

      if (this.isValidEntry(entry)) {
        entries.push(entry);
      } else {
        this.logger.warn(
          `Skipping entry without word field: ${JSON.stringify(entry)}`
        );
      }
    }

    return entries;
  }

  private mapRowToEntry(
    headers: string[],
    rowValues: string[],
    entry: Partial<JapaneseWord>
  ): void {
    headers.forEach((header, index) => {
      const key = this.convertHeaderToProperty(header);
      const value = rowValues[index];

      if (this.isValidProperty(key, value)) {
        (entry as Record<string, unknown>)[key] = value.trim();
      }
    });
  }

  private convertHeaderToProperty(header: string): string {
    return header.toLowerCase().replace(/ (\w)/g, (_, c) => c.toUpperCase());
  }

  private isValidProperty(key: string, value: string): boolean {
    const validKeys: Array<keyof JapaneseWord> = [
      'word',
      'reading',
      'translation',
      'pronunciation',
      'exampleSentence',
      'type',
      'difficulty',
      'notes',
      'status',
    ];

    return validKeys.includes(key as keyof JapaneseWord) && value !== undefined;
  }

  private isValidEntry(entry: Partial<JapaneseWord>): boolean {
    return entry.word !== undefined && entry.word.trim() !== '';
  }
}
