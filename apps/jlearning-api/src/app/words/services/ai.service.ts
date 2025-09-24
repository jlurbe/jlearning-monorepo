import { Injectable } from '@nestjs/common';
import {
  DifficultyLevel,
  StudyStatus,
  VocabularyEntry,
  WordType,
} from '@jlearning-monorepo/api-common/shared/vocabulary';
import { GoogleGenAI } from '@google/genai';
import { GET_VOCABULARY_PROMPT } from '../consts/prompt';

@Injectable()
export class AiService {
  // In a real application, this would make an API call to an external AI service.
  // For this example, we'll simulate the AI's response.
  async getVocabularyFromText(
    text: string
  ): Promise<Partial<VocabularyEntry>[]> {
    const ai = new GoogleGenAI({});

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${GET_VOCABULARY_PROMPT.replace(
        '[PASTE_JAPANESE_TEXT_HERE]',
        text
      )}`,
    });

    return this.parseMarkdownTable(aiResponse.text);
  }

  private parseMarkdownTable(markdown: string): Partial<VocabularyEntry>[] {
    const rawLines = markdown.trim().split('\n');
    if (rawLines.length < 3) {
      return [];
    }

    const headers = rawLines[0]
      .split('|')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);

    // Re-join multi-line cells before splitting into rows
    const processedRows: string[] = [];
    let currentRow = '';
    for (const line of rawLines.slice(2)) {
      if (line.startsWith('|') && currentRow) {
        processedRows.push(currentRow);
        currentRow = line;
      } else {
        // Append multi-line content to the current row, separated by a newline
        currentRow += (currentRow ? '\n' : '') + line;
      }
    }
    if (currentRow) {
      processedRows.push(currentRow);
    }

    const entries: Partial<VocabularyEntry>[] = [];

    for (const row of processedRows) {
      const values = row.split('|').map((v) => v.trim());
      const rowValues = values.slice(1, -1);

      const entry: Partial<VocabularyEntry> = {
        status: StudyStatus.NEW,
      };

      headers.forEach((header, index) => {
        // This correctly converts a header like "Example Sentence" to "exampleSentence"
        const key = header
          .toLowerCase()
          .replace(/ (\w)/g, (_, c) => c.toUpperCase());
        const value = rowValues[index];

        // A simple check to see if the generated key is a valid property of our entry
        const validKeys: Array<keyof VocabularyEntry> = [
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
        if (validKeys.includes(key as keyof VocabularyEntry)) {
          (entry as any)[key] = value;
        }
      });
      entries.push(entry);
    }

    return entries;
  }
}
