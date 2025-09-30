import React, { useState } from "react";
import { ChatWidget } from "@/components/ChatWidget";

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string>();

  const handleChatOpen = (message?: string) => {
    setInitialMessage(message);
    setIsChatOpen(true);
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen">
      {/* Seu conteúdo aqui */}
      <main>
        <h1>Minha Aplicação</h1>

        {/* Exemplo: Botão para abrir chat com mensagem específica */}
        <button onClick={() => handleChatOpen("Quero saber sobre preços")}>
          Consultar Preços
        </button>
      </main>

      {/* Widget de Chat */}
      <ChatWidget
        isOpen={isChatOpen}
        onToggle={handleChatToggle}
        initialMessage={initialMessage}
      />
    </div>
  );
};

export default App;