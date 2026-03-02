import { useState } from 'react';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { getApprovalAIReview } from '@/services/aiService';

interface ApprovalAIReviewProps {
  taskId: string;
}

export function ApprovalAIReview({ taskId }: ApprovalAIReviewProps) {
  const [review, setReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReview = async () => {
    setLoading(true);
    try {
      const { review: r } = await getApprovalAIReview(taskId);
      setReview(r);
    } catch {
      setReview('Unable to generate AI review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={fetchReview}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border hover:bg-secondary transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : review ? (
          <RefreshCw className="h-3.5 w-3.5" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        {review ? 'Refresh Review' : 'AI Review'}
      </button>

      {review && (
        <div className="rounded-md p-3 text-sm" style={{ backgroundColor: 'hsl(210 80% 52% / 0.08)' }}>
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="italic text-foreground/90 whitespace-pre-wrap leading-relaxed">{review}</p>
          </div>
        </div>
      )}
    </div>
  );
}
