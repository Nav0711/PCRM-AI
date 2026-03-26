import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { X, Trash2, Send, AlertCircle, RefreshCw, FileText, MessageSquare, TrendingUp, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage, sendChatMessage, beautifyAIResponse } from '@/services/aiService';
import { TypingIndicator } from './TypingIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { POLITICIAN } from '@/data/mock';
import { apiClient } from '@/services/apiClient';

const STARTER_CHIPS = [
  { emoji: '🎤', text: 'Draft a speech on accomplishments' },
  { emoji: '📰', text: 'Draft a media response' },
  { emoji: '📊', text: 'Constituency Data Overview' },
  { emoji: '🔴', text: 'Which tasks are most overdue?' },
];

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const CHAT_STORAGE_KEY = 'pcrm_ai_chat_history';

export function ChatDrawer({ open, onClose, initialMessage }: ChatDrawerProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'briefing' | 'chat'>('briefing');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastInitialMessage = useRef<string | undefined>();

  const [briefing, setBriefing] = useState<any>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save chat history:', err);
    }
  }, [messages]);

  useEffect(() => {
    if (!open) {
      lastInitialMessage.current = undefined;
      return;
    }

    if (initialMessage && initialMessage !== lastInitialMessage.current) {
      lastInitialMessage.current = initialMessage;
      setActiveTab('chat');
      handleSend(initialMessage);
    }
  }, [open, initialMessage]);

  useEffect(() => {
    if (open && activeTab === 'briefing' && !briefing) {
      fetchBriefing();
    }
  }, [open, activeTab]);

  useEffect(() => {
    if (open && activeTab === 'chat') {
      inputRef.current?.focus();
    }
  }, [open, activeTab]);

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading, activeTab]);

  const fetchBriefing = async () => {
    setBriefingLoading(true);
    try {
      const res = await apiClient.getTodayBriefing();
      if (res.data) {
        const briefingData = res.data;
        if (briefingData.briefing?.ai_summary) {
          briefingData.briefing.ai_summary = beautifyAIResponse(briefingData.briefing.ai_summary);
        }
        if (briefingData.briefing?.trend_alert) {
          briefingData.briefing.trend_alert = beautifyAIResponse(briefingData.briefing.trend_alert);
        }
        setBriefing(briefingData);
      }
    } catch (err) {
      console.error('Failed to fetch briefing:', err);
    } finally {
      setBriefingLoading(false);
    }
  };

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setError(null);

    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    let queryType = 'general';
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes('speech')) queryType = 'speech';
    else if (lowerMsg.includes('media')) queryType = 'media';
    else if (lowerMsg.includes('data') || lowerMsg.includes('overview') || lowerMsg.includes('stats')) queryType = 'data';

    try {
      const { reply } = await sendChatMessage(newMessages, queryType);
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
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setError(null);
  };

  if (!open) return null;

  const politicianName = user?.name || POLITICIAN.name;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[60] lg:bg-transparent lg:backdrop-blur-none" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[61] w-full sm:w-[450px] bg-card border-l shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex flex-col border-b shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="text-sm">✦</span>
              </div>
              <h3 className="font-semibold text-sm">Constituency AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              {activeTab === 'chat' && messages.length > 0 && (
                <button onClick={clearChat} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Clear chat">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex px-4 gap-4 mt-auto">
            <button
              onClick={() => setActiveTab('briefing')}
              className={cn(
                "pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2",
                activeTab === 'briefing' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="h-4 w-4" />
              Daily Briefing
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={cn(
                "pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2",
                activeTab === 'chat' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </button>
          </div>
        </div>

        {activeTab === 'briefing' ? (
          <div className="flex-1 overflow-y-auto p-5 bg-secondary/20">
            {briefingLoading ? (
              <div className="flex flex-col space-y-4 items-center justify-center h-full text-muted-foreground">
                <RefreshCw className="h-8 w-8 animate-spin text-primary/50" />
                <p className="text-sm animate-pulse">Generating your morning briefing...</p>
              </div>
            ) : briefing ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">Morning Briefing</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(briefing.briefing?.date || Date.now()).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-lg border p-3 shadow-sm">
                    <div className="text-muted-foreground text-xs font-medium mb-1">Total Open</div>
                    <div className="text-2xl font-bold">{briefing.stats?.total_open || 0}</div>
                  </div>
                  <div className="bg-background rounded-lg border p-3 shadow-sm">
                    <div className="text-muted-foreground text-xs font-medium mb-1">Resolved Today</div>
                    <div className="text-2xl font-bold text-green-600">{briefing.stats?.resolved_today || 0}</div>
                  </div>
                  <div className="bg-background rounded-lg border p-3 shadow-sm">
                    <div className="text-muted-foreground text-xs font-medium mb-1">New Since Yesterday</div>
                    <div className="text-2xl font-bold text-blue-600">{briefing.stats?.new_since_yesterday || 0}</div>
                  </div>
                  <div className="bg-background rounded-lg border p-3 shadow-sm">
                    <div className="text-muted-foreground text-xs font-medium mb-1">SLA Breaches</div>
                    <div className="text-2xl font-bold text-red-600">{briefing.stats?.sla_breaches || 0}</div>
                  </div>
                </div>

                <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
                  <div className="bg-primary/5 px-4 py-3 border-b border-primary/10 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm text-primary">AI Summary</h3>
                  </div>
                  <div className="p-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {briefing.briefing?.ai_summary}
                  </div>
                </div>

                {briefing.briefing?.trend_alert && briefing.briefing.trend_alert !== 'No alerts today.' && (
                  <div className="bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900 shadow-sm overflow-hidden">
                    <div className="bg-red-100 dark:bg-red-900/40 px-4 py-3 border-b border-red-200 dark:border-red-900 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <h3 className="font-semibold text-sm text-red-800 dark:text-red-300">Trend Alerts</h3>
                    </div>
                    <div className="p-4 text-sm leading-relaxed text-red-900/90 dark:text-red-300/90 whitespace-pre-wrap">
                      {briefing.briefing.trend_alert}
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setActiveTab('chat');
                      setInput(`Ask about ${briefing.stats?.total_open || 0} open complaints...`);
                      inputRef.current?.focus();
                    }}
                    className="w-full py-2.5 rounded-lg border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Discuss this briefing
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <>
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
            <div className="border-t px-4 py-3 shrink-0 space-y-2 bg-background">
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
          </>
        )}
      </div>
    </>
  );
}
