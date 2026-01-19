import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, semanticChunking } from '@/lib/pdf-processor';
import { generateEmbeddings } from '@/lib/embeddings';
import { getVectorStore, DocumentChunk } from '@/lib/vector-store';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }
    
    // 1. Extract text from PDF
    console.log('[RAG] Extracting text from PDF...');
    const extractedData = await extractTextFromPDF(file);
    
    // 2. Split text into semantic chunks
    console.log('[RAG] Creating semantic chunks...');
    const chunks = semanticChunking(extractedData.text, 500, 100);
    
    if (chunks.length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the PDF' },
        { status: 400 }
      );
    }
    
    // 3. Generate embeddings for each chunk
    console.log(`[RAG] Generating embeddings for ${chunks.length} chunks...`);
    const embeddings = await generateEmbeddings(chunks);
    
    // 4. Store chunks with embeddings in vector store
    const vectorStore = getVectorStore();
    vectorStore.clear(); // Clear previous documents
    
    const documents: DocumentChunk[] = chunks.map((chunk, index) => ({
      id: `${file.name}-chunk-${index}`,
      text: chunk,
      embedding: embeddings[index],
      metadata: {
        source: file.name,
        section: `Chunk ${index + 1}/${chunks.length}`,
      },
    }));
    
    vectorStore.addDocuments(documents);
    
    console.log(`[RAG] Successfully processed ${chunks.length} chunks`);
    
    return NextResponse.json({
      success: true,
      fileName: file.name,
      pages: extractedData.pages,
      chunks: chunks.length,
      message: 'Document processed successfully',
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF file' },
      { status: 500 }
    );
  }
}
