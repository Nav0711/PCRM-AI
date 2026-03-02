import { Sparkles } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
  hasNew?: boolean;
}

export function FloatingChatButton({ onClick, hasNew }: FloatingChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl active:scale-95"
    >
      <Sparkles className="h-5 w-5" />
      <span className="text-sm font-medium">AI Assistant</span>
      {hasNew && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent border-2 border-card" />
      )}
    </button>
  );
}
