import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useState } from 'react';
import { useVocabulary } from '../hooks/use-vocabulary';

// Helper to extract kanji from a string (simple version)
function extractKanjis(text: string): string[] {
  // Kanji unicode range: \u4e00-\u9faf
  return Array.from(new Set(text.match(/[\u4e00-\u9faf]/g) || []));
}

export default function KanjiPage() {
  const { entries } = useVocabulary();
  // Map: difficulty -> Set of kanji
  const kanjiByDifficulty: Record<string, Set<string>> = {};
  entries.forEach((entry) => {
    const diff = entry.difficulty || 'unknown';
    if (!kanjiByDifficulty[diff]) kanjiByDifficulty[diff] = new Set();
    extractKanjis(entry.word).forEach((k) => kanjiByDifficulty[diff].add(k));
  });
  const [selectedKanji, setSelectedKanji] = useState<string | null>(null);
  // Find info for selected kanji
  const kanjiInfo = selectedKanji
    ? entries.find((e) => e.word.includes(selectedKanji))
    : null;
  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Kanji in Your Vocabulary</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(kanjiByDifficulty).length === 0 && (
            <p className="text-muted-foreground animate-fade-in">
              No kanji found in your vocabulary.
            </p>
          )}
          {Object.entries(kanjiByDifficulty).map(([diff, kanjis], diffIndex) => (
            <div key={diff} className="mb-6 animate-fade-in-up" style={{ animationDelay: `${diffIndex * 0.1}s`, animationFillMode: 'backwards' }}>
              <div className="font-bold mb-2 capitalize">{diff}</div>
              <div className="flex flex-wrap gap-2">
                {[...kanjis].map((k, idx) => (
                  <Badge
                    key={k}
                    className={`cursor-pointer text-2xl px-3 py-2 hover:scale-110 transition-all duration-200 animate-scale-in ${
                      selectedKanji === k ? 'bg-blue-600 text-white' : ''
                    }`}
                    style={{ animationDelay: `${diffIndex * 0.1 + idx * 0.02}s`, animationFillMode: 'backwards' }}
                    onClick={() => setSelectedKanji(k)}
                  >
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          {selectedKanji && kanjiInfo && (
            <div className="mt-8 p-4 border rounded bg-muted animate-slide-down">
              <div className="text-4xl font-bold mb-2">{selectedKanji}</div>
              <div className="mb-1">
                <span className="font-semibold">Word Example:</span>{' '}
                {kanjiInfo.word}
              </div>
              {kanjiInfo.reading && (
                <div>
                  <span className="font-semibold">Reading:</span>{' '}
                  {kanjiInfo.reading}
                </div>
              )}
              {kanjiInfo.translation && (
                <div>
                  <span className="font-semibold">Translation:</span>{' '}
                  {kanjiInfo.translation}
                </div>
              )}
              {kanjiInfo.exampleSentence && (
                <div>
                  <span className="font-semibold">Example Sentence:</span>{' '}
                  {kanjiInfo.exampleSentence}
                </div>
              )}
              {kanjiInfo.notes && (
                <div>
                  <span className="font-semibold">Notes:</span>{' '}
                  {kanjiInfo.notes}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
