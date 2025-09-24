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

    console.log(aiResponse.text);

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
        difficulty: DifficultyLevel.BEGINNER,
        type: WordType.OTHER,
      };

      headers.forEach((header, index) => {
        const key = header.replace(/ /g, '').toLowerCase();
        const value = rowValues[index];
        // Map snake_case or camelCase headers to our camelCase properties
        const propertyMap: { [key: string]: keyof VocabularyEntry } = {
          word: 'word',
          reading: 'reading',
          translation: 'translation',
          pronunciation: 'pronunciation',
          examplesentence: 'exampleSentence',
          type: 'type',
          difficulty: 'difficulty',
          notes: 'notes',
        };
        if (propertyMap[key]) {
          (entry as any)[key] = value;
        }
      });
      entries.push(entry);
    }

    console.log(entries);
    return entries;
  }
}
