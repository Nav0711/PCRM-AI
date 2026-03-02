import { createContext, useContext } from 'react';

interface AIChatContextType {
  openChat: (initialMessage?: string) => void;
}

const AIChatContext = createContext<AIChatContextType>({ openChat: () => {} });

export const AIChatProvider = AIChatContext.Provider;
export const useAIChat = () => useContext(AIChatContext);
