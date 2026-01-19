import { NextRequest, NextResponse } from 'next/server';
import { generateRAGAnswer } from '@/lib/rag-service';
import { getVectorStore } from '@/lib/vector-store';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }
    
    // Check if documents are loaded
    const vectorStore = getVectorStore();
    if (vectorStore.getSize() === 0) {
      return NextResponse.json({
        answer: "Aucun document n'a été chargé. Veuillez d'abord télécharger un document PDF médical pour pouvoir poser des questions.",
        sources: [],
        template: 'general',
      });
    }
    
    console.log('[RAG] Processing question:', question);
    
    // Generate answer using RAG
    const result = await generateRAGAnswer(question, 5);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    );
  }
}
