// Exemplo: Adicionar histórico de conversas (localStorage)
// Adicione estes hooks no componente ChatWidget

import { useEffect } from 'react';

// ... código existente do ChatWidget ...

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onToggle,
  initialMessage
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => {
    // Tentar carregar sessionId existente ou criar novo
    const saved = localStorage.getItem('chatSessionId');
    if (saved) return saved;

    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatSessionId', newId);
    return newId;
  });

  // Carregar mensagens salvas quando o componente montar
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Converter timestamps de string para Date
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, [sessionId]);

  // Salvar mensagens sempre que mudarem
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // Função para limpar histórico (opcional)
  const clearChatHistory = () => {
    localStorage.removeItem(`chat_messages_${sessionId}`);
    localStorage.removeItem('chatSessionId');
    setMessages([]);
  };

  // Adicionar botão para limpar histórico no header (opcional)
  // <Button onClick={clearChatHistory} variant="ghost" size="sm">
  //   Limpar histórico
  // </Button>

  // ... resto do código ...
};