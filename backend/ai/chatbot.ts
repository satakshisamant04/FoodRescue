import { GoogleGenAI } from '@google/genai';
import { defaultRetriever, FoodRescueRetriever, RetrievalResult } from './retriever.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatbotRequest {
  message: string;
  history?: ChatMessage[];
  user?: {
    id?: string;
    role?: string;
    name?: string;
  };
}

export interface ChatbotResponse {
  answer: string;
  sources: Array<{
    document: string;
    docType?: string;
  }>;
  retrievedCount: number;
}

const SYSTEM_PROMPT = `You are FoodRescue AI Assistant, an AI assistant for the FoodRescue India platform.

Answer questions using the provided FoodRescue context.
Do not invent FoodRescue features, policies, procedures, or database information.
If the answer cannot be found in the provided context, clearly say that the information is not available in the current FoodRescue knowledge base rather than making up an answer.
Keep responses concise, helpful, and easy to understand.
Prioritize retrieved FoodRescue context over general knowledge.
Format your answer with clean markdown, bullet points, or numbered lists when appropriate for readability.`;

export class FoodRescueChatbot {
  private retriever: FoodRescueRetriever;
  private ai: GoogleGenAI | null = null;
  private modelName: string = 'gemini-3.6-flash';
  private fallbackModel: string = 'gemini-3.1-flash-lite';

  constructor(retriever?: FoodRescueRetriever) {
    this.retriever = retriever || defaultRetriever;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }

  /**
   * Main RAG entry point
   */
  async answerQuestion(request: ChatbotRequest): Promise<ChatbotResponse> {
    const rawMessage = request.message;

    // 1. Input sanitization & validation
    if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) {
      throw new Error('Message is required and cannot be empty.');
    }

    const question = rawMessage.trim();
    if (question.length > 1000) {
      throw new Error('Message is too long. Please limit your inquiry to 1000 characters.');
    }

    // 2. Retrieve relevant context chunks using vector similarity
    let retrievalResult: RetrievalResult;
    try {
      retrievalResult = await this.retriever.retrieve(question);
    } catch (retrievalErr) {
      console.error('[Chatbot] Retrieval step failed:', retrievalErr);
      retrievalResult = {
        query: question,
        chunks: [],
        formattedContext: '',
        sources: [],
      };
    }

    // 3. Construct prompt with retrieved context
    const hasContext = retrievalResult.chunks.length > 0;
    
    // Check if similarity scores are adequate (if top chunk score is low or unrelated)
    const topScore = hasContext ? retrievalResult.chunks[0].score : 0;
    const isMarginalRelevance = topScore < 0.28;

    let promptContents = '';

    if (hasContext && !isMarginalRelevance) {
      promptContents = `Retrieved FoodRescue Knowledge Base Context:\n==============================\n${retrievalResult.formattedContext}\n==============================\n\n`;
    } else {
      promptContents = `Retrieved FoodRescue Knowledge Base Context:\n==============================\n[No closely matching FoodRescue documentation found for this question]\n==============================\n\n`;
    }

    // Include recent conversation history if provided (max last 4 turns)
    if (request.history && request.history.length > 0) {
      const recentHistory = request.history.slice(-4);
      promptContents += 'Recent Conversation History:\n';
      for (const turn of recentHistory) {
        promptContents += `${turn.role === 'user' ? 'User' : 'FoodRescue Assistant'}: ${turn.content}\n`;
      }
      promptContents += '\n';
    }

    promptContents += `Current User Question: ${question}\n\nPlease provide an accurate, grounded answer based strictly on the FoodRescue context above. If the context does not contain the answer or the question is completely unrelated to FoodRescue India, state that the information is not available in the FoodRescue knowledge base.`;

    // 4. Generate answer from LLM
    if (!this.ai) {
      if (hasContext && !isMarginalRelevance) {
        const topChunk = retrievalResult.chunks[0];
        return {
          answer: `Here is the relevant information from FoodRescue India documentation:\n\n${topChunk.text.slice(0, 400)}...\n\n(Note: To enable natural generative responses, configure GEMINI_API_KEY in your server environment.)`,
          sources: retrievalResult.sources,
          retrievedCount: retrievalResult.chunks.length,
        };
      } else {
        return {
          answer: "I couldn't find enough information in the FoodRescue knowledge base to answer that accurately.",
          sources: [],
          retrievedCount: 0,
        };
      }
    }

    // Call LLM with primary model, then fallback model if primary experiences temporary demand spikes
    const candidateModels = [this.modelName, this.fallbackModel];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await this.ai.models.generateContent({
          model,
          contents: promptContents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.2,
          },
        });

        const answerText = response.text || "I couldn't find enough information in the FoodRescue knowledge base to answer that accurately.";
        const sourcesToReturn = (hasContext && !isMarginalRelevance) ? retrievalResult.sources : [];

        return {
          answer: answerText.trim(),
          sources: sourcesToReturn,
          retrievedCount: retrievalResult.chunks.length,
        };
      } catch (llmError) {
        lastError = llmError;
        console.warn(`[Chatbot] Model ${model} returned error, trying fallback if available:`, (llmError as Error).message);
      }
    }

    console.error('[Chatbot] All candidate LLM models failed:', lastError);
    // If LLM fails completely, fall back gracefully to top retrieved context snippet without throwing 500
    if (hasContext && !isMarginalRelevance) {
      return {
        answer: `I found the following relevant policy in the FoodRescue documentation:\n\n${retrievalResult.chunks[0].text}`,
        sources: retrievalResult.sources,
        retrievedCount: retrievalResult.chunks.length,
      };
    }

    return {
      answer: "I am unable to retrieve that information right now. Please try asking again in a moment.",
      sources: [],
      retrievedCount: 0,
    };
  }
}

// Default singleton chatbot instance
export const defaultChatbot = new FoodRescueChatbot();
