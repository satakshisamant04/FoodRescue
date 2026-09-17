import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  FileText,
  Minimize2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    document: string;
    docType?: string;
  }>;
  timestamp: string;
  isError?: boolean;
}

const SUGGESTED_QUESTIONS = [
  'How can I donate food surplus?',
  'How does an NGO claim food?',
  'What is the volunteer pickup process?',
  'What foods can and cannot be donated?',
  'How does INR meal sponsorship work?',
];

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-init',
  role: 'assistant',
  content:
    'Namaste! I am the **FoodRescue AI Assistant**. I can answer your questions about surplus food donation, NGO claiming, volunteer pickup logistics, FSSAI safety rules, and direct meal sponsorship.',
  timestamp: 'Just now',
};

export function FoodRescueChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom of message list on new message or typing
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    // Reset input
    setInput('');
    setLastFailedMessage(null);

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update conversation state
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Prepare history payload for server-side RAG context
      const historyPayload = newHistory
        .filter((m) => m.id !== 'msg-init')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await api.askChatbot({
        message: messageText,
        history: historyPayload,
      });

      if (res.success && res.answer) {
        const assistantMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: res.answer,
          sources: res.sources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(res.error || 'Unable to receive response from assistant');
      }
    } catch (err) {
      console.error('[Chatbot UI] Error:', err);
      setLastFailedMessage(messageText);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I had trouble connecting to the FoodRescue AI server. Please check your network or try again in a moment.',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_GREETING]);
    setLastFailedMessage(null);
  };

  return (
    <div id="foodrescue-ai-chatbot-root" className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          id="chatbot-open-trigger-btn"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 rounded-full bg-linear-to-r from-[#ae3115] to-[#c73e1d] px-4 py-3 text-white shadow-xl shadow-orange-950/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-900/30 focus:outline-none focus:ring-4 focus:ring-orange-500/30 active:scale-95"
          aria-label="Open FoodRescue AI Assistant"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
            <Sparkles className="h-4 w-4 text-orange-100 transition-transform group-hover:rotate-12" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white"></span>
            </span>
          </div>
          <span className="font-medium text-sm tracking-wide">FoodRescue AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="chatbot-window-container"
          className={`flex flex-col rounded-2xl border border-stone-200 bg-white shadow-2xl transition-all duration-300 dark:border-stone-800 dark:bg-stone-900 ${
            isMinimized
              ? 'h-14 w-80 sm:w-96'
              : 'h-[560px] max-h-[85vh] w-[92vw] sm:w-[420px]'
          }`}
        >
          {/* Header */}
          <div
            id="chatbot-header"
            className="flex items-center justify-between border-b border-stone-200/80 bg-linear-to-r from-[#9b2a12] to-[#b8381b] px-4 py-3 text-white rounded-t-2xl select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs">
                <Bot className="h-5 w-5 text-orange-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-semibold tracking-tight text-white">FoodRescue AI</h2>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase text-orange-100">
                    RAG
                  </span>
                </div>
                <p className="text-[11px] text-orange-100/80 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Grounded Platform Knowledge
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="chatbot-clear-btn"
                onClick={handleClearChat}
                title="Reset Conversation"
                className="rounded-lg p-1.5 text-orange-200 hover:bg-white/15 hover:text-white transition-colors"
                aria-label="Reset Conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                id="chatbot-minimize-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="rounded-lg p-1.5 text-orange-200 hover:bg-white/15 hover:text-white transition-colors"
                aria-label="Minimize or Expand Chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                id="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="rounded-lg p-1.5 text-orange-200 hover:bg-white/15 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Body (Hidden if Minimized) */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div
                id="chatbot-messages-scroll"
                className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50 dark:bg-stone-950/40 text-sm"
              >
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      id={`chat-msg-${msg.id}`}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[88%]">
                        {!isUser && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-800 text-[#ae3115]">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}

                        <div
                          className={`rounded-2xl px-3.5 py-2.5 shadow-xs ${
                            isUser
                              ? 'bg-[#ae3115] text-white rounded-br-xs'
                              : msg.isError
                              ? 'bg-rose-50 border border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200 rounded-bl-xs'
                              : 'bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 text-stone-800 dark:text-stone-100 rounded-bl-xs'
                          }`}
                        >
                          <div className="whitespace-pre-wrap leading-relaxed text-[13.5px]">
                            {msg.content}
                          </div>

                          {/* Sources Attribution */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-stone-200/70 dark:border-stone-700/70 flex flex-wrap items-center gap-1.5">
                              <span className="text-[10.5px] font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                                <FileText className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                Sources:
                              </span>
                              {msg.sources.map((src, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-1 rounded-md bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 text-[11px] font-mono text-stone-700 dark:text-stone-300"
                                >
                                  {src.document}
                                </span>
                              ))}
                            </div>
                          )}

                          <div
                            className={`mt-1 text-[10px] ${
                              isUser
                                ? 'text-orange-200 text-right'
                                : 'text-stone-400 dark:text-stone-500'
                            }`}
                          >
                            {msg.timestamp}
                          </div>
                        </div>

                        {isUser && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading / Thinking Indicator */}
                {isLoading && (
                  <div className="flex items-end gap-2 max-w-[85%]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/70 border border-orange-200 dark:border-orange-800 text-[#ae3115]">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-bl-xs bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 px-4 py-3 shadow-xs">
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ae3115]" />
                        <span>Searching FoodRescue knowledge base & generating answer...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Retry action if last attempt failed */}
                {lastFailedMessage && !isLoading && (
                  <div className="flex justify-center pt-1">
                    <button
                      onClick={() => handleSendMessage(lastFailedMessage)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800 px-3 py-1 text-xs font-medium text-rose-800 dark:text-rose-200 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Retry Question
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Suggestions (shown when 1 or 2 messages in conversation) */}
              {messages.length <= 2 && !isLoading && (
                <div
                  id="chatbot-suggestions-bar"
                  className="border-t border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 px-3 py-2"
                >
                  <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Suggested questions:
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-2.5 py-1 text-[11.5px] text-stone-700 dark:text-stone-300 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 dark:hover:border-orange-700 transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Footer */}
              <div
                id="chatbot-input-bar"
                className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 rounded-b-2xl"
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    id="chatbot-input-field"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about donations, claiming, safety..."
                    disabled={isLoading}
                    maxLength={1000}
                    className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 px-3.5 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:border-[#ae3115] focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
                  />
                  <button
                    id="chatbot-send-btn"
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ae3115] text-white shadow-xs hover:bg-[#972b12] focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-stone-400 dark:text-stone-500">
                  <span>Answers grounded in FoodRescue documentation</span>
                  <span>Enter to send</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
