'use client';

import { useState } from 'react';
import { Brain, Activity } from 'lucide-react';
import { FileUpload } from '@/components/file-upload';
import { QuestionAnswer } from '@/components/question-answer';
import { DocumentInfo } from '@/components/document-info';

interface DocumentData {
  fileName: string;
  pages: number;
  chunks: number;
}

export default function Home() {
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);

  const handleUploadSuccess = (data: DocumentData) => {
    setDocumentData(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">RAG Médical</h1>
                <p className="text-xs text-muted-foreground">
                  Système de Question-Réponse Contextuel
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Info banner */}
        <div className="mb-8 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Système RAG Spécialisé en Santé Mentale
              </h2>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Ce système utilise la recherche augmentée par génération (RAG) pour extraire
                des informations précises depuis des documents cliniques PDF. Il combine des
                embeddings sémantiques (all-MiniLM-L6-v2), une base vectorielle FAISS simulée,
                et des modèles de langage avancés pour fournir des réponses structurées sur
                les troubles, diagnostics et traitements.
              </p>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Upload and Info */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <DocumentInfo
              fileName={documentData?.fileName || null}
              pages={documentData?.pages || null}
              chunks={documentData?.chunks || null}
            />
          </div>

          {/* Right column - Q&A */}
          <div className="lg:col-span-2">
            <QuestionAnswer documentLoaded={!!documentData} />
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border">
            <div className="text-primary font-semibold mb-2">Pipeline Complet</div>
            <p className="text-sm text-muted-foreground">
              Extraction, nettoyage et segmentation sémantique intelligente
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border">
            <div className="text-primary font-semibold mb-2">Embeddings</div>
            <p className="text-sm text-muted-foreground">
              Modèle all-MiniLM-L6-v2 pour la vectorisation sémantique
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border">
            <div className="text-primary font-semibold mb-2">Base Vectorielle</div>
            <p className="text-sm text-muted-foreground">
              Recherche sémantique rapide avec similarité cosinus
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border">
            <div className="text-primary font-semibold mb-2">Templates Médicaux</div>
            <p className="text-sm text-muted-foreground">
              Réponses structurées selon le contexte médical
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t py-6 text-center text-sm text-muted-foreground">
        <p>
          Système RAG Médical - Pipeline complet de traitement de documents cliniques
        </p>
        <p className="mt-1">
          Technologies: Next.js, Transformers.js, RAG, Embeddings Sémantiques
        </p>
      </footer>
    </main>
  );
}
