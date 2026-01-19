// PDF processing and text extraction service

export interface ExtractedText {
  text: string;
  pages: number;
  metadata: {
    fileName: string;
    extractedAt: string;
  };
}

export async function extractTextFromPDF(file: File): Promise<ExtractedText> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Dynamic import to avoid client-side bundling issues
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    
    return {
      text: data.text,
      pages: data.numpages,
      metadata: {
        fileName: file.name,
        extractedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Clean extracted text
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
    .replace(/[^\x00-\x7F]+/g, ' ') // Remove non-ASCII characters
    .trim();
}

// Semantic chunking - split text into meaningful chunks while preserving context
export function semanticChunking(
  text: string,
  chunkSize: number = 500,
  overlap: number = 100
): string[] {
  const cleanedText = cleanText(text);
  const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    
    if (currentChunk.length + trimmedSentence.length < chunkSize) {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + '.');
      }
      
      // Add overlap by including last few words from previous chunk
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 5)).join(' ');
      currentChunk = overlapWords ? overlapWords + '. ' + trimmedSentence : trimmedSentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk + '.');
  }
  
  return chunks.filter(chunk => chunk.length > 50); // Filter out very small chunks
}
