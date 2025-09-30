import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  initialMessage?: string;
}

// ⚠️ PERSONALIZE ESTAS CONSTANTES PARA SEU PROJETO
const WEBHOOK_URL = '/api/webhook'; // URL do seu backend/webhook
const WHATSAPP_NUMBER = '5527999999999'; // Seu número de WhatsApp (formato internacional sem +)
const WHATSAPP_MESSAGE = 'Olá! Vim pelo site e gostaria de saber mais.'; // Mensagem padrão
const BOT_NAME = 'Assistente Virtual'; // Nome do seu bot
const WELCOME_MESSAGE = '👋 Olá! Como posso ajudar?'; // Mensagem de boas-vindas

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onToggle,
  initialMessage
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() =>
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ⚠️ PERSONALIZE ESTAS PERGUNTAS RÁPIDAS
  const quickQuestions = [
    "Como funciona?",
    "Quais são os preços?",
    "Quero uma demonstração",
    "Falar com atendente"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: WELCOME_MESSAGE,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);

      if (initialMessage) {
        setTimeout(() => {
          handleSendMessage(initialMessage);
        }, 1000);
      }
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

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
        const responseText = await response.text();
        let data;

        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          data = { response: responseText };
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.output?.response || data.response || data.output || responseText || getDefaultResponse(messageText),
          sender: 'bot',
          timestamp: new Date()
        };

        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1500);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getDefaultResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, fallbackMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  // ⚠️ PERSONALIZE AS RESPOSTAS PADRÃO PARA SEU NEGÓCIO
  const getDefaultResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('reunião') || lowerMessage.includes('demonstração')) {
      return 'Ótimo! Vou conectar você com nossa equipe. Clique no botão do WhatsApp! 🗓️';
    }

    if (lowerMessage.includes('preço') || lowerMessage.includes('valor')) {
      return 'Temos diferentes planos para atender sua necessidade. Entre em contato para um orçamento personalizado! 💰';
    }

    return 'Nossa equipe pode ajudar melhor. Que tal continuar no WhatsApp? 😊';
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Botão flutuante quando fechado
  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  // Widget aberto
  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{BOT_NAME}</div>
            <div className="text-xs text-green-600 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Online agora
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start space-x-2",
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl p-3",
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 border border-gray-200'
              )}
            >
              <div className="text-sm">{message.text}</div>
              <div className={cn(
                "text-xs mt-1",
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              )}>
                {formatTime(message.timestamp)}
              </div>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-gray-100 border border-gray-200 p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        {/* Quick Questions */}
        {messages.length === 1 && !isTyping && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 text-center">Perguntas rápidas:</div>
            <div className="grid gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(question)}
                  className="text-xs h-auto py-2 px-3 justify-start"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={openWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Continue no WhatsApp</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            disabled={isTyping}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};