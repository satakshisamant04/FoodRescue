import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface VectorDocument {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    docType?: string;
    chunkIndex: number;
    title?: string;
    [key: string]: any;
  };
}

export interface SearchResult {
  document: VectorDocument;
  score: number; // Cosine similarity (1.0 = identical, 0.0 = orthogonal)
}

export interface IVectorStore {
  addDocuments(documents: VectorDocument[]): Promise<void>;
  similaritySearch(queryEmbedding: number[], topK: number): Promise<SearchResult[]>;
  clear(): Promise<void>;
  count(): Promise<number>;
  getAllDocuments(): Promise<VectorDocument[]>;
}

/**
 * Calculates cosine similarity between two numeric vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Modular Local Persistent Vector Store
 * Saves vector embeddings and chunk metadata to a dedicated JSON file in the data/ directory.
 * Built with full modularity so it can be swapped with ChromaDB or Pinecone without altering the RAG pipeline.
 */
export class LocalVectorStore implements IVectorStore {
  private filePath: string;
  private documents: VectorDocument[] = [];
  private isLoaded: boolean = false;

  constructor(filePath?: string) {
    this.filePath = filePath || path.resolve(__dirname, '../../data/vector-store.json');
  }

  private ensureLoaded(): void {
    if (this.isLoaded) return;

    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        this.documents = JSON.parse(content);
      } else {
        this.documents = [];
      }
    } catch (err) {
      console.warn('[VectorStore] Warning reading vector store file, initializing empty:', err);
      this.documents = [];
    }
    this.isLoaded = true;
  }

  private persist(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.documents, null, 2), 'utf-8');
    } catch (err) {
      console.error('[VectorStore] Error writing vector store to disk:', err);
    }
  }

  async addDocuments(newDocs: VectorDocument[]): Promise<void> {
    this.ensureLoaded();

    // Replace any existing docs with matching IDs to make ingestion repeatable
    const existingMap = new Map<string, VectorDocument>();
    for (const doc of this.documents) {
      existingMap.set(doc.id, doc);
    }

    for (const doc of newDocs) {
      existingMap.set(doc.id, doc);
    }

    this.documents = Array.from(existingMap.values());
    this.persist();
  }

  async similaritySearch(queryEmbedding: number[], topK: number = 4): Promise<SearchResult[]> {
    this.ensureLoaded();

    if (this.documents.length === 0) {
      return [];
    }

    const scored: SearchResult[] = this.documents.map((doc) => ({
      document: doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    // Sort descending by similarity score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  }

  async clear(): Promise<void> {
    this.documents = [];
    this.isLoaded = true;
    this.persist();
  }

  async count(): Promise<number> {
    this.ensureLoaded();
    return this.documents.length;
  }

  async getAllDocuments(): Promise<VectorDocument[]> {
    this.ensureLoaded();
    return [...this.documents];
  }
}

// Default singleton vector store instance
export const defaultVectorStore: IVectorStore = new LocalVectorStore();
