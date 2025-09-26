import axios from 'axios';
import type { JapaneseWord } from '@jlearning-monorepo/api-common/contexts/shared/domain/japanese-word.type';

const apiClient = axios.create({
  baseURL: '/api', // The base URL will be proxied by Vite during development
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getWords = async (): Promise<JapaneseWord[]> => {
  const response = await apiClient.get('/japanese-words');
  // The API returns 'id' as a number, but the frontend might expect a string.
  // Also, the API uses createdAt/updatedAt, but the component might not.
  // The backend now returns UUIDs as strings, so no explicit conversion is needed.
  return response.data;
};

export const analyzeText = async (
  text: string
): Promise<Partial<JapaneseWord>[]> => {
  const response = await apiClient.post('/japanese-words/analyze', { text });
  return response.data;
};

export const addWord = async (
  entry: Omit<JapaneseWord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<JapaneseWord> => {
  const response = await apiClient.post('/japanese-words', entry);
  return {
    ...response.data,
  };
};

export const addManyWords = async (
  entries: Omit<JapaneseWord, 'id' | 'createdAt' | 'updatedAt'>[]
): Promise<{ created: number }> => {
  const response = await apiClient.post('/japanese-words/batch', {
    words: entries,
  });
  return response.data;
};

export const updateWord = async (
  id: string,
  updates: Partial<JapaneseWord>
): Promise<JapaneseWord> => {
  const response = await apiClient.patch(`/japanese-words/${id}`, updates);
  return response.data;
};

export const deleteWord = async (id: string): Promise<void> => {
  await apiClient.delete(`/japanese-words/${id}`);
};
