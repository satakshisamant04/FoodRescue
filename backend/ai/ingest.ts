import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { getEmbeddingsProvider } from './embeddings.js';
import { defaultVectorStore, VectorDocument } from './vectorStore.js';

// Load environment variables (.env)
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_DIR = path.resolve(__dirname, 'documents');

interface IngestStats {
  filesProcessed: number;
  chunksCreated: number;
  vectorsStored: number;
  durationMs: number;
}

/**
 * Derives document type classification from filename
 */
function getDocumentType(filename: string): string {
  if (filename.includes('faq')) return 'faq';
  if (filename.includes('safety')) return 'safety_protocol';
  if (filename.includes('pickup')) return 'logistics';
  if (filename.includes('guidelines')) return 'guidelines';
  if (filename.includes('guide')) return 'user_guide';
  return 'general_documentation';
}

/**
 * Runs the FoodRescue knowledge base document ingestion pipeline.
 */
export async function runIngestion(options?: { clearExisting?: boolean }): Promise<IngestStats> {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('🌱 Starting FoodRescue Knowledge Base Ingestion Pipeline');
  console.log(`📂 Scanning directory: ${DOCUMENTS_DIR}`);
  console.log('====================================================');

  if (!fs.existsSync(DOCUMENTS_DIR)) {
    throw new Error(`Knowledge base directory not found at: ${DOCUMENTS_DIR}`);
  }

  const files = fs.readdirSync(DOCUMENTS_DIR).filter((f) => f.endsWith('.txt') || f.endsWith('.md'));
  if (files.length === 0) {
    console.warn('⚠️ No text/markdown documents found in documents directory.');
    return { filesProcessed: 0, chunksCreated: 0, vectorsStored: 0, durationMs: Date.now() - startTime };
  }

  console.log(`📄 Found ${files.length} knowledge base documents:`, files);

  // Initialize LangChain RecursiveCharacterTextSplitter
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 120,
    separators: ['\n\n', '\n', '. ', '? ', '! ', ' ', ''],
  });

  const embeddingsProvider = getEmbeddingsProvider();
  const vectorDocs: VectorDocument[] = [];

  for (const filename of files) {
    const filePath = path.join(DOCUMENTS_DIR, filename);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const docType = getDocumentType(filename);

    console.log(`\n⏳ Processing "${filename}" (${rawContent.length} bytes)...`);

    // Split text into semantic chunks
    const chunks = await textSplitter.splitText(rawContent);
    console.log(`   ✂️ Created ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i].trim();
      if (!chunkText) continue;

      // Unique deterministic ID based on filename and index to ensure idempotent updates
      const chunkId = `chunk-${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}-${i}`;

      try {
        const embedding = await embeddingsProvider.embedQuery(chunkText);

        vectorDocs.push({
          id: chunkId,
          text: chunkText,
          embedding,
          metadata: {
            source: filename,
            docType,
            chunkIndex: i,
            totalChunks: chunks.length,
            title: filename.replace(/\.(txt|md)$/i, '').replace(/[-_]/g, ' ').toUpperCase(),
            updatedAt: new Date().toISOString(),
          },
        });
      } catch (embedErr) {
        console.error(`   ❌ Failed to embed chunk ${i} of ${filename}:`, embedErr);
        throw embedErr;
      }
    }
  }

  if (options?.clearExisting) {
    console.log('\n🧹 Clearing prior vectors as requested...');
    await defaultVectorStore.clear();
  }

  console.log(`\n💾 Storing ${vectorDocs.length} vector embeddings in modular store...`);
  await defaultVectorStore.addDocuments(vectorDocs);

  const totalInStore = await defaultVectorStore.count();
  const durationMs = Date.now() - startTime;

  console.log('====================================================');
  console.log(`✅ Ingestion Complete in ${(durationMs / 1000).toFixed(2)}s`);
  console.log(`📊 Documents Processed: ${files.length}`);
  console.log(`📊 Chunks Ingested: ${vectorDocs.length}`);
  console.log(`📊 Total Vectors in Database: ${totalInStore}`);
  console.log('====================================================\n');

  return {
    filesProcessed: files.length,
    chunksCreated: vectorDocs.length,
    vectorsStored: totalInStore,
    durationMs,
  };
}

// Allow direct execution via CLI `npm run ingest` or `tsx backend/ai/ingest.ts`
if (process.argv[1] && process.argv[1].includes('ingest')) {
  runIngestion({ clearExisting: true })
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Ingestion failed with error:', err);
      process.exit(1);
    });
}
