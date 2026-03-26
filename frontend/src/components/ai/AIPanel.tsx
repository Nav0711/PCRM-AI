import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, AlertCircle, RefreshCw, Briefcase, TrendingUp, Calendar, AlertTriangle, Sparkles, MessageSquare } from 'lucide-react';
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

export function AIPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [briefing, setBriefing] = useState<any>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  useEffect(() => {
    fetchBriefing();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const fetchBriefing = async () => {
    setBriefingLoading(true);
    try {
      const res = await apiClient.getTodayBriefing();
      if (res.data) {
        const briefingData = res.data as any;
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

  const politicianName = user?.name || POLITICIAN.name;

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full min-h-0 overflow-hidden">
      {/* Left Column: Morning Briefing */}
      <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">Morning Briefing</h2>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(briefing?.briefing?.date || Date.now()).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 bg-secondary/10">
          {briefingLoading ? (
            <div className="flex flex-col space-y-4 items-center justify-center h-full text-muted-foreground">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/50" />
              <p className="text-sm animate-pulse">Generating your morning briefing...</p>
            </div>
          ) : briefing ? (
            <div className="space-y-6">

              {/* AI Summary Section */}
              <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
                <div className="bg-primary/5 px-5 py-3 border-b border-primary/10 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm text-primary uppercase tracking-wider">Executive Summary</h3>
                </div>
                <div className="p-5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {briefing.briefing?.ai_summary}
                </div>
              </div>

              {/* Trend Alerts Section */}
              {briefing.briefing?.trend_alert && briefing.briefing.trend_alert !== 'No alerts today.' && (
                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900 shadow-sm overflow-hidden">
                  <div className="bg-red-100 dark:bg-red-900/40 px-5 py-3 border-b border-red-200 dark:border-red-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <h3 className="font-semibold text-sm text-red-800 dark:text-red-300 uppercase tracking-wider">Action Needed</h3>
                  </div>
                  <div className="p-5 text-sm leading-relaxed text-red-900/90 dark:text-red-300/90 whitespace-pre-wrap">
                    {briefing.briefing.trend_alert}
                  </div>
                </div>
              )}
            </div>
          ) : (
             <div className="flex h-full items-center justify-center text-muted-foreground">
               Unable to load briefing data today.
             </div>
          )}
        </div>
      </div>

      {/* Right Column: AI Chat Interface */}
      <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">AI Co-Pilot</h2>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Talk to your constituency data directly</p>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.length === 0 && !loading && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs text-primary font-bold">AI</span>
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-border/50">
                  <p className="text-sm text-foreground/90">
                    Welcome back, {politicianName.split(' ').pop()}. I'm your continuous AI assistant. You can ask me to draft speeches, handle media inquiries, or simply pull up stats for the upcoming council meeting. How can I help?
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pl-11">
                {STARTER_CHIPS.map(chip => (
                  <button
                    key={chip.text}
                    onClick={() => handleSend(chip.text)}
                    className="text-xs bg-card border rounded-full px-3.5 py-2 hover:bg-secondary hover:border-primary/50 transition-all text-left shadow-sm"
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
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-3 mt-1">
                  <span className="text-xs text-primary font-bold">AI</span>
                </div>
              )}
              <div className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-secondary border border-border/50 rounded-tl-none text-foreground'
              )}>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                <p className={cn('text-[10px] mt-2 font-medium', msg.role === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground')}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {loading && <TypingIndicator />}

          {error && (
            <div className="flex items-start gap-3 pl-11">
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
                <button onClick={() => { setError(null); const last = [...messages].reverse().find(m => m.role === 'user'); if (last) handleSend(last.content); }} className="ml-2 p-1.5 hover:bg-destructive/20 rounded-md transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Input Box */}
        <div className="p-4 border-t bg-card shrink-0">
          <div className="relative flex items-center shadow-sm rounded-xl border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query data, draft a speech, or get insights..."
              disabled={loading}
              rows={1}
              className="flex-1 resize-none bg-transparent px-4 py-3.5 text-sm focus:outline-none disabled:opacity-50 min-h-[52px] max-h-32"
            />
            <div className="px-2">
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="h-9 w-9 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1">
              <Briefcase className="h-3 w-3" /> Empowered by Gemini AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
