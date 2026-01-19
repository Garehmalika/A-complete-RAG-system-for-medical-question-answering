'use client';

import React from "react"

import { useState } from 'react';
import { Send, Loader2, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionAnswerProps {
  documentLoaded: boolean;
}

interface Answer {
  answer: string;
  sources: Array<{
    text: string;
    metadata: {
      source: string;
      page?: number;
    };
  }>;
  template: string;
}

interface Message {
  type: 'question' | 'answer';
  content: string;
  sources?: Answer['sources'];
  template?: string;
}

export function QuestionAnswer({ documentLoaded }: QuestionAnswerProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const currentQuestion = question;
    setQuestion('');
    setLoading(true);

    // Add question to messages
    setMessages(prev => [...prev, { type: 'question', content: currentQuestion }]);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: currentQuestion }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data: Answer = await response.json();

      // Add answer to messages
      setMessages(prev => [
        ...prev,
        {
          type: 'answer',
          content: data.answer,
          sources: data.sources,
          template: data.template,
        },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          type: 'answer',
          content: 'Une erreur est survenue lors de la génération de la réponse.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Quels sont les symptômes de la dépression ?",
    "Comment diagnostique-t-on un trouble anxieux ?",
    "Quels sont les traitements disponibles pour le TDAH ?",
    "Quelle est la prévalence du trouble bipolaire ?",
  ];

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Poser une question
        </CardTitle>
        <CardDescription>
          {documentLoaded
            ? 'Interrogez le document en langage naturel'
            : 'Téléchargez un document pour commencer'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 && documentLoaded && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Questions suggérées :
              </p>
              <div className="grid gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(q)}
                    className="text-left text-sm p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className="space-y-2">
              {message.type === 'question' ? (
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.template && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Template: {message.template}
                        </p>
                      </div>
                    )}
                  </div>

                  {message.sources && message.sources.length > 0 && (
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Sources ({message.sources.length})
                      </summary>
                      <div className="mt-2 space-y-2 pl-6">
                        {message.sources.map((source, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-secondary/50 rounded p-2"
                          >
                            <p className="text-muted-foreground mb-1">
                              {source.metadata.source}
                              {source.metadata.page && ` - Page ${source.metadata.page}`}
                            </p>
                            <p>{source.text}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm">Génération de la réponse...</p>
            </div>
          )}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              documentLoaded
                ? 'Posez votre question médicale...'
                : 'Téléchargez un document d\'abord'
            }
            disabled={!documentLoaded || loading}
            className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button type="submit" disabled={!documentLoaded || loading || !question.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
