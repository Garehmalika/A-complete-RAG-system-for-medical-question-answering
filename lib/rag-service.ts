// RAG (Retrieval-Augmented Generation) service

import { generateEmbedding } from './embeddings';
import { getVectorStore } from './vector-store';
import { detectTemplate, formatPromptWithTemplate } from './medical-templates';

export interface RAGResponse {
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

// Generate answer using RAG approach
export async function generateRAGAnswer(
  question: string,
  topK: number = 5
): Promise<RAGResponse> {
  try {
    // 1. Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question);
    
    // 2. Retrieve relevant chunks from vector store
    const vectorStore = getVectorStore();
    const relevantChunks = vectorStore.search(questionEmbedding, topK);
    
    if (relevantChunks.length === 0) {
      return {
        answer: "Aucun document n'a été chargé. Veuillez d'abord télécharger un document PDF médical.",
        sources: [],
        template: 'general',
      };
    }
    
    // 3. Detect appropriate template
    const template = detectTemplate(question);
    
    // 4. Format prompt with context and template
    const contextTexts = relevantChunks.map(chunk => chunk.text);
    const prompt = formatPromptWithTemplate(question, contextTexts, template);
    
    // 5. Call LLM to generate answer
    const response = await fetch('https://llm.blackbox.ai/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_TV7rWt4ZWZoK4Z',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx',
      },
      body: JSON.stringify({
        model: 'openrouter/claude-sonnet-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more precise medical answers
        max_tokens: 2000,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate answer from LLM');
    }
    
    const data = await response.json();
    const answer = data.choices[0].message.content;
    
    // 6. Format sources
    const sources = relevantChunks.map(chunk => ({
      text: chunk.text.substring(0, 200) + '...',
      metadata: chunk.metadata,
    }));
    
    return {
      answer,
      sources,
      template: template.name,
    };
  } catch (error) {
    console.error('Error generating RAG answer:', error);
    throw new Error('Failed to generate answer');
  }
}
