'use client';

import React from "react"

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onUploadSuccess: (data: UploadResult) => void;
}

interface UploadResult {
  fileName: string;
  pages: number;
  chunks: number;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Veuillez sélectionner un fichier PDF');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setProgress(100);
      setSuccess(true);
      onUploadSuccess(data);

      // Reset after success
      setTimeout(() => {
        setFile(null);
        setProgress(0);
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Télécharger un document PDF
        </CardTitle>
        <CardDescription>
          Téléchargez un document médical PDF pour interroger son contenu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex-1 cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary transition-colors"
            >
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {file ? file.name : 'Cliquez pour sélectionner un fichier PDF'}
              </p>
              {file && (
                <p className="text-xs text-muted-foreground mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </label>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? 'Traitement en cours...' : 'Traiter le document'}
          </Button>
        </div>

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              {progress < 30 && 'Extraction du texte...'}
              {progress >= 30 && progress < 60 && 'Segmentation sémantique...'}
              {progress >= 60 && progress < 90 && 'Génération des embeddings...'}
              {progress >= 90 && 'Finalisation...'}
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <p className="text-sm">Document traité avec succès!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
