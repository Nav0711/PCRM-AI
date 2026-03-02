export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-xs">✦</span>
      </div>
      <div className="bg-secondary rounded-lg rounded-tl-none px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot [animation-delay:0.2s]" />
          <span className="typing-dot [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}
