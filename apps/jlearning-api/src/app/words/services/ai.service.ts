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
    const lines = markdown.trim().split('\n');
    if (lines.length < 3) {
      return [];
    }

    const headers = lines[0]
      .split('|')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    const rows = lines.slice(2);

    const entries: Partial<VocabularyEntry>[] = [];

    for (const row of rows) {
      const values = row.split('|').map((v) => v.trim());
      // The first and last elements will be empty strings from the outer pipes
      const rowValues = values.slice(1, -1);

      const entry: Partial<VocabularyEntry> = {
        status: StudyStatus.NEW,
        difficulty: DifficultyLevel.BEGINNER,
      };

      headers.forEach((header, index) => {
        const key = header.replace(/ /g, '').toLowerCase();
        const value = rowValues[index];
        if (key === 'examplesentence') {
          entry['exampleSentence'] = value;
        } else if (Object.values(WordType).includes(value as WordType)) {
          entry['type'] = value as WordType;
        } else if (
          key in entry ||
          key === 'word' ||
          key === 'reading' ||
          key === 'translation' ||
          key === 'pronunciation' ||
          key === 'notes'
        ) {
          (entry as any)[key] = value;
        }
      });
      entries.push(entry);
    }

    return entries;
  }
}
