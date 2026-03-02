import { useState, useEffect } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { getTaskAISuggestions } from '@/services/aiService';

interface TaskAISuggestionsProps {
  taskId: string;
  taskTitle: string;
  workerName: string;
  onAskAI: (message: string) => void;
}

export function TaskAISuggestions({ taskId, taskTitle, workerName, onAskAI }: TaskAISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTaskAISuggestions(taskId)
      .then(r => setSuggestions(r.suggestions))
      .catch(() => setSuggestions(['Unable to load suggestions.']))
      .finally(() => setLoading(false));
  }, [taskId]);

  return (
    <div className="rounded-lg border p-4 space-y-3" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.03), hsl(210 80% 52% / 0.05))' }}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">AI Suggestions</h4>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-4 bg-muted/50 rounded animate-pulse" style={{ width: `${60 + i * 12}%` }} />
          ))}
        </div>
      ) : (
        <>
          <ul className="space-y-1.5">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onAskAI(`I'm looking at the task "${taskTitle}" assigned to ${workerName}. What should I do?`)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Ask AI about this task
          </button>
        </>
      )}
    </div>
  );
}
