'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  RefreshCw,
  Zap,
  Brain,
  Wrench,
  DollarSign,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import PremiumButton from '../PremiumButton';
import PremiumCard from '../PremiumCard';
import { useAIChat } from '../../hooks/useAI';
import { ChatMessage } from '../../services/aiService';

interface AIChatAssistantProps {
  context?: {
    vehicleId?: string;
    diagnosticId?: string;
    maintenanceId?: string;
  };
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ context }) => {
  const { chatHistory, loading, sendChatMessage, fetchChatHistory } = useAIChat();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatHistory(context);
  }, [fetchChatHistory, context]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      await sendChatMessage(userMessage, context);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      icon: Wrench,
      text: 'Bakım önerisi',
      action: 'Aracım için bakım önerilerini göster'
    },
    {
      icon: DollarSign,
      text: 'Maliyet analizi',
      action: 'Bu ayki bakım maliyetlerimi analiz et'
    },
    {
      icon: Calendar,
      text: 'Randevu planla',
      action: 'Yaklaşan bakım için randevu planla'
    },
    {
      icon: AlertTriangle,
      text: 'Sorun bildir',
      action: 'Aracımda bir sorun var, yardım et'
    }
  ];

  const handleQuickAction = (action: string) => {
    setMessage(action);
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Asistan</h3>
          <p className="text-sm text-gray-600">OtoTakibim AI destekli yardımcınız</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Çevrimiçi</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Merhaba! Size nasıl yardımcı olabilirim?
            </h4>
            <p className="text-gray-600 mb-6">
              Araç bakımı, maliyet analizi, randevu planlama ve daha fazlası için sorularınızı sorabilirsiniz.
            </p>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleQuickAction(action.action)}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <action.icon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{action.text}</span>
                  </div>
                  <p className="text-xs text-gray-600">{action.action}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {chatHistory.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-br from-blue-600 to-purple-600'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                  <div className={`text-xs mt-2 ${
                    msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <PremiumButton
            onClick={handleSendMessage}
            disabled={!message.trim() || loading}
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-4 h-4" />}
            isLoading={loading}
          >
            Gönder
          </PremiumButton>
        </div>
        
        {/* Quick Actions in Input */}
        {chatHistory.length > 0 && (
          <div className="flex gap-2 mt-3">
            {quickActions.slice(0, 2).map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
              >
                {action.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatAssistant;
