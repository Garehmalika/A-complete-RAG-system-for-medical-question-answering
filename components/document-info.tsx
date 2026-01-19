'use client';

import { FileText, BookOpen, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentInfoProps {
  fileName: string | null;
  pages: number | null;
  chunks: number | null;
}

export function DocumentInfo({ fileName, pages, chunks }: DocumentInfoProps) {
  if (!fileName) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            État du système
          </CardTitle>
          <CardDescription>Informations sur le document chargé</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun document chargé</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Document chargé
        </CardTitle>
        <CardDescription>Informations sur le document actuel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Nom du fichier</p>
              <p className="text-sm text-muted-foreground break-all">{fileName}</p>
            </div>
          </div>

          {pages !== null && (
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nombre de pages</p>
                <p className="text-sm text-muted-foreground">{pages} pages</p>
              </div>
            </div>
          )}

          {chunks !== null && (
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Segments indexés</p>
                <p className="text-sm text-muted-foreground">
                  {chunks} chunks vectorisés
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ Base vectorielle prête
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Le système est prêt à répondre à vos questions
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
