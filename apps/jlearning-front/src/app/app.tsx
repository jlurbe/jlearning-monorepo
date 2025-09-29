import { Routes, Route } from 'react-router-dom';
import { VocabularyManager } from '../components/vocabulary-manager';
import HiraganaPage from '../pages/hiragana';
import KatakanaPage from '../pages/katakana';
import { Breadcrumbs } from '../components/breadcrumbs';
import KanjiPage from '../pages/kanji';
import { ButtonLink } from '../components/ui/button-link';

export default function App() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            日本語学習アプリ
          </h1>
          <p className="text-lg text-muted-foreground">
            Japanese Language Learning App
          </p>
        </div>
        <div className="flex gap-4 mb-4">
          <ButtonLink to="/" variant="secondary" size="sm">
            Vocabulary
          </ButtonLink>
          <ButtonLink to="/hiragana" variant="secondary" size="sm">
            Hiragana
          </ButtonLink>
          <ButtonLink to="/katakana" variant="secondary" size="sm">
            Katakana
          </ButtonLink>
          <ButtonLink to="/kanji" variant="secondary" size="sm">
            Kanji
          </ButtonLink>
        </div>
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<VocabularyManager />} />
          <Route path="/hiragana" element={<HiraganaPage />} />
          <Route path="/katakana" element={<KatakanaPage />} />
          <Route path="/kanji" element={<KanjiPage />} />
        </Routes>
      </div>
    </main>
  );
}
