import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useAi } from "./hooks/useAi";

type AiContextType = {
  chats: object[];
  handleNewChats: (prompts: string[]) => Promise<void>;
};

const AiContext = createContext<AiContextType | undefined>(undefined);

export const AiProvider = ({ children }: { children: ReactNode }) => {
  const { getRes } = useAi();
  const [chats, setChats] = useState<any[]>([]);

  const handleNewChats = async (prompts: string[]) => {
    const res = await getRes(prompts);
    setChats(res.data.chats);
  };

  return (
    <AiContext.Provider value={{ chats, handleNewChats }}>
      {children}
    </AiContext.Provider>
  );
};

export const useAiContext = () => {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error("useAiContext must be used within an AiProvider");
  }
  return context;
};
