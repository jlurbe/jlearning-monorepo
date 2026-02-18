import { Routes, Route, useLocation } from 'react-router-dom';
import { VocabularyManager } from '../components/vocabulary-manager';
import HiraganaPage from '../pages/hiragana';
import KatakanaPage from '../pages/katakana';
import { Breadcrumbs } from '../components/breadcrumbs';
import KanjiPage from '../pages/kanji';
import { ButtonLink } from '../components/ui/button-link';
import { Button } from '../components/ui/button';

import { useAuth } from '../contexts/auth-context';
import { ProtectedRoute } from '../components/protected-route';
import LoginPage from '../pages/login-page';

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const { logout } = useAuth();

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
        {!isLoginPage && (
          <div className="flex justify-between items-center mb-4 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
            <div className="flex gap-4">
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
            <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive">
              Logout
            </Button>
          </div>
        )}
        {!isLoginPage && <Breadcrumbs />}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<VocabularyManager />} />
              <Route path="/hiragana" element={<HiraganaPage />} />
              <Route path="/katakana" element={<KatakanaPage />} />
              <Route path="/kanji" element={<KanjiPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </main>
  );
}
