import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles, MessageSquare } from 'lucide-react';
import { getAIInsights } from '@/services/aiService';
import { cn } from '@/lib/utils';

interface AIInsightsCardProps {
  page: string;
  title: string;
  onAskFollowUp: (context: string) => void;
}

export function AIInsightsCard({ page, title, onAskFollowUp }: AIInsightsCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAIInsights(page)
      .then(r => setSuggestions(r.suggestions))
      .catch(() => setSuggestions(['Unable to load AI insights.']))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="rounded-lg border overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.04), hsl(210 80% 52% / 0.06))' }}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        {collapsed ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
      </button>

      <div className={cn('transition-all duration-200', collapsed ? 'max-h-0 overflow-hidden' : 'max-h-96')}>
        <div className="px-4 pb-3 space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-4 bg-muted/50 rounded animate-pulse" style={{ width: `${70 + i * 8}%` }} />
              ))}
            </div>
          ) : (
            <>
              <ul className="space-y-1.5">
                {suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onAskFollowUp(`Tell me more about the ${page} insights`)}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-2"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Ask Follow-up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
