// Embeddings service using Transformers.js for all-MiniLM-L6-v2 model

let pipeline: any = null;

async function loadPipeline() {
  if (!pipeline) {
    const { pipeline: createPipeline } = await import('@xenova/transformers');
    pipeline = await createPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return pipeline;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const pipe = await loadPipeline();
    const output = await pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  
  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    embeddings.push(embedding);
  }
  
  return embeddings;
}
