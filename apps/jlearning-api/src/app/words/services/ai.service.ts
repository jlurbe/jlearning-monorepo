import { Injectable } from '@nestjs/common';
import {
  DifficultyLevel,
  StudyStatus,
  VocabularyEntry,
  WordType,
} from '@jlearning-monorepo/api-common/shared/vocabulary';

@Injectable()
export class AiService {
  // In a real application, this would make an API call to an external AI service.
  // For this example, we'll simulate the AI's response.
  async getVocabularyFromText(
    text: string
  ): Promise<Partial<VocabularyEntry>[]> {
    const simulatedAiResponse = this.simulateAiResponse(text);
    return this.parseMarkdownTable(simulatedAiResponse);
  }

  private simulateAiResponse(text: string): string {
    // This is a mock response based on the user's prompt example.
    // A real implementation would use the `text` variable in a prompt to an AI.
    if (text.includes('学校')) {
      return `
| Word | Reading | Translation | Pronunciation | Example Sentence | Type | Notes |
|---|---|---|---|---|---|---|
| 学校 | がっこう | school | gakkō | 学校へ行きます。(がっこう へ いきます。) “I go to school.” | noun | A place where students study; used with へ or に for direction. |
| へ | へ | (direction particle) | e | 日本へ行きます。(にほん へ いきます。) “I go to Japan.” | particle | Indicates direction or destination; pronounced “え”. |
| 行きます | いきます | to go | ikimasu | 明日行きます。(あした いきます。) “I will go tomorrow.” | verb | Polite form of 行く; used for movement toward a place. |
      `;
    }
    return `
| Word | Reading | Translation | Pronunciation | Example Sentence | Type | Notes |
|---|---|---|---|---|---|---|
| 日本語 | にほんご | Japanese language | nihongo | 日本語は面白いです。(にほんごは おもしろいです。) "Japanese is interesting." | noun | The language of Japan. |
    `;
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
