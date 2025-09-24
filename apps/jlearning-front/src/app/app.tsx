import { VocabularyManager } from "../components/vocabulary-manager"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">日本語学習アプリ</h1>
          <p className="text-lg text-muted-foreground">Japanese Language Learning App</p>
        </div>
        <VocabularyManager />
      </div>
    </main>
  )
}
