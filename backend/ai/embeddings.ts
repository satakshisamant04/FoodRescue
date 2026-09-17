import { GoogleGenAI } from '@google/genai';

export interface EmbeddingsProvider {
  embedQuery(text: string): Promise<number[]>;
  embedDocuments(texts: string[]): Promise<number[][]>;
}

/**
 * Gemini Embedding Provider using the official @google/genai SDK.
 * Uses 'gemini-embedding-2-preview' for state-of-the-art semantic search.
 */
export class GeminiEmbeddings implements EmbeddingsProvider {
  private ai: GoogleGenAI | null = null;
  private model: string = 'gemini-embedding-2-preview';

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (key) {
      this.ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    if (model) {
      this.model = model;
    }
  }

  async embedQuery(text: string): Promise<number[]> {
    if (!this.ai) {
      throw new Error('Gemini API key is not configured for embeddings.');
    }

    const response = await this.ai.models.embedContent({
      model: this.model,
      contents: text,
    });

    const values = response.embeddings?.[0]?.values;
    if (!values || values.length === 0) {
      throw new Error('No embedding returned from Gemini API.');
    }

    return values;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];
    // Process sequentially or in controlled batches to avoid rate limits
    for (const text of texts) {
      const vec = await this.embedQuery(text);
      results.push(vec);
    }
    return results;
  }
}

/**
 * Fallback Local Embedding Provider
 * Generates deterministic 384-dimensional term-frequency feature vectors.
 * Used automatically if an external API key is missing during local dry runs or tests.
 */
export class FallbackLocalEmbeddings implements EmbeddingsProvider {
  private dimension: number = 384;

  private hashToken(token: string): number {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash << 5) - hash + token.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  async embedQuery(text: string): Promise<number[]> {
    const vector = new Array(this.dimension).fill(0);
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1);

    if (tokens.length === 0) return vector;

    for (const token of tokens) {
      const idx = this.hashToken(token) % this.dimension;
      vector[idx] += 1;
    }

    // Normalize
    let norm = 0;
    for (let i = 0; i < this.dimension; i++) {
      norm += vector[i] * vector[i];
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < this.dimension; i++) {
        vector[i] /= norm;
      }
    }

    return vector;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embedQuery(t)));
  }
}

/**
 * Factory helper to get the active embeddings provider.
 * Automatically selects Gemini embeddings if API key is present.
 */
export function getEmbeddingsProvider(): EmbeddingsProvider {
  if (process.env.GEMINI_API_KEY) {
    return new GeminiEmbeddings(process.env.GEMINI_API_KEY);
  }
  console.warn('[Embeddings] GEMINI_API_KEY not found; falling back to local feature embeddings.');
  return new FallbackLocalEmbeddings();
}
