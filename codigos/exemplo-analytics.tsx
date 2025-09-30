// Exemplo: Analytics/Tracking com Google Analytics
// Adicione este código no componente ChatWidget

// Declare o tipo do gtag (no início do arquivo ou em um arquivo de tipos)
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onToggle,
  initialMessage
}) => {
  // ... código existente ...

  // Track quando o chat é aberto
  useEffect(() => {
    if (isOpen && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'chat_opened', {
        event_category: 'engagement',
        event_label: 'Chat Widget',
        session_id: sessionId
      });
    }
  }, [isOpen, sessionId]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    // Track mensagem enviada
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'chat_message_sent', {
        event_category: 'engagement',
        event_label: 'User Message',
        message_length: messageText.length,
        session_id: sessionId
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          message: messageText,
          sessionId,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response || getDefaultResponse(messageText),
          sender: 'bot',
          timestamp: new Date()
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);

          // Track resposta recebida
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'chat_response_received', {
              event_category: 'engagement',
              event_label: 'Bot Response',
              response_length: botMessage.text.length,
              session_id: sessionId
            });
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Track erro
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'chat_error', {
          event_category: 'error',
          event_label: 'Message Send Failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          session_id: sessionId
        });
      }

      // ... resto do código de erro ...
    }
  };

  const openWhatsApp = () => {
    // Track clique no botão WhatsApp
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'whatsapp_button_clicked', {
        event_category: 'conversion',
        event_label: 'WhatsApp Redirect',
        session_id: sessionId
      });
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank');
  };

  // Track quick questions
  const handleQuickQuestion = (question: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'quick_question_clicked', {
        event_category: 'engagement',
        event_label: question,
        session_id: sessionId
      });
    }

    handleSendMessage(question);
  };

  // ... resto do código ...

  // No JSX, substitua onClick dos quick questions:
  // <Button onClick={() => handleQuickQuestion(question)}>
  //   {question}
  // </Button>
};

// ========================================
// ALTERNATIVA: Facebook Pixel
// ========================================

declare global {
  interface Window {
    fbq?: (
      command: string,
      event: string,
      params?: Record<string, any>
    ) => void;
  }
}

// Track com Facebook Pixel:
if (typeof window.fbq !== 'undefined') {
  window.fbq('track', 'Lead', {
    content_name: 'Chat Widget',
    content_category: 'engagement'
  });
}

// ========================================
// ALTERNATIVA: Mixpanel
// ========================================

import mixpanel from 'mixpanel-browser';

// Inicializar Mixpanel (fazer isso uma vez no início do app)
mixpanel.init('SEU_TOKEN_MIXPANEL');

// Track eventos:
mixpanel.track('Chat Opened', {
  session_id: sessionId,
  timestamp: new Date().toISOString()
});

mixpanel.track('Message Sent', {
  session_id: sessionId,
  message_length: messageText.length
});