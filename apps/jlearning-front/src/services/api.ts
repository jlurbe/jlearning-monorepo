import axios from 'axios';
import type { VocabularyEntry } from '@jlearning-monorepo/api-common/shared/vocabulary';

const apiClient = axios.create({
  baseURL: '/api', // The base URL will be proxied by Vite during development
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getWords = async (): Promise<VocabularyEntry[]> => {
  const response = await apiClient.get('/words');
  // The API returns 'id' as a number, but the frontend might expect a string.
  // Also, the API uses createdAt/updatedAt, but the component might not.
  // The backend now returns UUIDs as strings, so no explicit conversion is needed.
  return response.data;
};

export const addWord = async (
  entry: Omit<VocabularyEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<VocabularyEntry> => {
  const response = await apiClient.post('/words', entry);
  return {
    ...response.data,
  };
};

export const updateWord = async (
  id: string,
  updates: Partial<VocabularyEntry>
): Promise<VocabularyEntry> => {
  const response = await apiClient.patch(`/words/${id}`, updates);
  return response.data;
};

export const deleteWord = async (id: string): Promise<void> => {
  await apiClient.delete(`/words/${id}`);
};
