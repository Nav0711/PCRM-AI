import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { X, Trash2, Send, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage, sendChatMessage } from '@/services/aiService';
import { TypingIndicator } from './TypingIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { POLITICIAN } from '@/data/mock';

const STARTER_CHIPS = [
  { emoji: '🔴', text: 'Which tasks are most overdue?' },
  { emoji: '✅', text: "What's pending my approval?" },
  { emoji: '📊', text: 'How are my workers performing?' },
  { emoji: '✍️', text: 'Help me write rejection feedback' },
];

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export function ChatDrawer({ open, onClose, initialMessage }: ChatDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialSent = useRef(false);

  // Handle initial message when drawer opens
  useEffect(() => {
    if (open && initialMessage && !initialSent.current) {
      initialSent.current = true;
      handleSend(initialMessage);
    }
    if (!open) {
      initialSent.current = false;
    }
  }, [open, initialMessage]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setError(null);

    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const { reply } = await sendChatMessage(newMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      setError('Unable to get a response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  if (!open) return null;

  const politicianName = user?.name || POLITICIAN.name;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[60] lg:bg-transparent lg:backdrop-blur-none" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[61] w-full sm:w-[400px] bg-card border-l shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm">✦</span>
            </div>
            <h3 className="font-semibold text-sm">Constituency AI Assistant</h3>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button onClick={clearChat} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Clear chat">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs">✦</span>
                </div>
                <div className="bg-secondary rounded-lg rounded-tl-none px-3.5 py-2.5">
                  <p className="text-xs text-muted-foreground mb-0.5">✦ AI</p>
                  <p className="text-sm">Hi {politicianName.split(' ').pop()}, I'm your Constituency Assistant. Ask me anything about your tasks, workers, or pending approvals.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pl-9">
                {STARTER_CHIPS.map(chip => (
                  <button
                    key={chip.text}
                    onClick={() => handleSend(chip.text)}
                    className="text-xs border rounded-full px-3 py-1.5 hover:bg-secondary hover:border-primary/30 transition-colors text-left"
                  >
                    {chip.emoji} {chip.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-2.5 mt-0.5">
                  <span className="text-xs">✦</span>
                </div>
              )}
              <div className={cn(
                'max-w-[85%] rounded-lg px-3.5 py-2.5',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-secondary rounded-tl-none'
              )}>
                {msg.role === 'assistant' && i === messages.findIndex(m => m.role === 'assistant') && (
                  <p className="text-xs text-muted-foreground mb-1">✦ AI</p>
                )}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                <p className={cn('text-[10px] mt-1.5', msg.role === 'user' ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground')}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {loading && <TypingIndicator />}

          {error && (
            <div className="flex items-start gap-2.5 pl-9">
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg px-3.5 py-2.5 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
                <button onClick={() => { setError(null); const last = [...messages].reverse().find(m => m.role === 'user'); if (last) handleSend(last.content); }} className="ml-1 p-1 hover:bg-destructive/10 rounded">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t px-4 py-3 shrink-0 space-y-2">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your constituency work…"
              disabled={loading}
              rows={1}
              className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 max-h-24"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">Powered by AI</p>
        </div>
      </div>
    </>
  );
}
