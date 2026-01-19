// Vector store implementation using in-memory storage
// This simulates FAISS functionality for semantic search

export interface DocumentChunk {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    page?: number;
    section?: string;
  };
}

export class VectorStore {
  private chunks: DocumentChunk[] = [];

  addDocuments(documents: DocumentChunk[]): void {
    this.chunks.push(...documents);
  }

  // Cosine similarity between two vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Search for most relevant chunks based on query embedding
  search(queryEmbedding: number[], topK: number = 5): DocumentChunk[] {
    const similarities = this.chunks.map((chunk) => ({
      chunk,
      similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    // Sort by similarity (highest first) and return top K
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topK).map((item) => item.chunk);
  }

  clear(): void {
    this.chunks = [];
  }

  getSize(): number {
    return this.chunks.length;
  }
}

// Global vector store instance
let vectorStore: VectorStore | null = null;

export function getVectorStore(): VectorStore {
  if (!vectorStore) {
    vectorStore = new VectorStore();
  }
  return vectorStore;
}
