import { getEmbeddingsProvider } from './embeddings.js';
import { defaultVectorStore, IVectorStore, SearchResult } from './vectorStore.js';

export interface RetrievalResult {
  query: string;
  chunks: Array<{
    id: string;
    text: string;
    score: number;
    metadata: {
      source: string;
      docType?: string;
      chunkIndex: number;
      title?: string;
      [key: string]: any;
    };
  }>;
  formattedContext: string;
  sources: Array<{ document: string; docType?: string }>;
}

export class FoodRescueRetriever {
  private vectorStore: IVectorStore;
  private defaultTopK: number;

  constructor(vectorStore?: IVectorStore, topK?: number) {
    this.vectorStore = vectorStore || defaultVectorStore;
    const envTopK = process.env.TOP_K ? parseInt(process.env.TOP_K, 10) : 4;
    this.defaultTopK = topK || (isNaN(envTopK) ? 4 : envTopK);
  }

  /**
   * Retrieves top-k most relevant FoodRescue knowledge chunks for a given query.
   */
  async retrieve(query: string, topK?: number): Promise<RetrievalResult> {
    const k = topK || this.defaultTopK;
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return {
        query,
        chunks: [],
        formattedContext: '',
        sources: [],
      };
    }

    const embeddingsProvider = getEmbeddingsProvider();

    // 1. Generate embedding for user query
    const queryVector = await embeddingsProvider.embedQuery(trimmedQuery);

    // 2. Perform similarity search against vector store
    const rawResults: SearchResult[] = await this.vectorStore.similaritySearch(queryVector, k);

    // Filter results if similarity is too low or format chunks
    const chunks = rawResults.map((res) => ({
      id: res.document.id,
      text: res.document.text,
      score: Math.round(res.score * 1000) / 1000,
      metadata: res.document.metadata,
    }));

    // 3. Format context string for prompt injection
    const formattedContext = chunks
      .map(
        (chunk, idx) =>
          `[Document Snippet #${idx + 1} | Source: ${chunk.metadata.source} (Similarity: ${(chunk.score * 100).toFixed(1)}%)]\n${chunk.text}`
      )
      .join('\n\n---\n\n');

    // 4. Extract unique source documents
    const uniqueSourcesMap = new Map<string, { document: string; docType?: string }>();
    for (const chunk of chunks) {
      if (chunk.metadata.source && !uniqueSourcesMap.has(chunk.metadata.source)) {
        uniqueSourcesMap.set(chunk.metadata.source, {
          document: chunk.metadata.source,
          docType: chunk.metadata.docType,
        });
      }
    }

    const sources = Array.from(uniqueSourcesMap.values());

    return {
      query: trimmedQuery,
      chunks,
      formattedContext,
      sources,
    };
  }
}

// Default singleton instance
export const defaultRetriever = new FoodRescueRetriever();
