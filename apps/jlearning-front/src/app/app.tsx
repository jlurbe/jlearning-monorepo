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
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold text-foreground mb-2 hover:scale-105 transition-transform duration-300">
            日本語学習アプリ
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            Japanese Language Learning App
          </p>
        </div>
        <div className="flex gap-4 mb-4 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <ButtonLink to="/" variant="secondary" size="sm" className="hover:scale-105 transition-transform duration-200">
            Vocabulary
          </ButtonLink>
          <ButtonLink to="/hiragana" variant="secondary" size="sm" className="hover:scale-105 transition-transform duration-200">
            Hiragana
          </ButtonLink>
          <ButtonLink to="/katakana" variant="secondary" size="sm" className="hover:scale-105 transition-transform duration-200">
            Katakana
          </ButtonLink>
          <ButtonLink to="/kanji" variant="secondary" size="sm" className="hover:scale-105 transition-transform duration-200">
            Kanji
          </ButtonLink>
        </div>
        <Breadcrumbs />
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
          <Routes>
            <Route path="/" element={<VocabularyManager />} />
            <Route path="/hiragana" element={<HiraganaPage />} />
            <Route path="/katakana" element={<KatakanaPage />} />
            <Route path="/kanji" element={<KanjiPage />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}
