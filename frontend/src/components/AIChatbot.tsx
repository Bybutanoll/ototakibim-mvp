'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Phone, MessageCircle, Mic, Paperclip, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'suggestion' | 'vehicle-info' | 'service-recommendation';
  data?: any;
}

interface AIChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  userVehicles?: any[];
}

const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onToggle, userVehicles = [] }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Ben OtoTakibim AI Asistanı 🤖\n\nAracınızın sağlığı hakkında sorularınızı sorabilir, bakım önerileri alabilir veya servis randevusu oluşturabiliriz.\n\nSize nasıl yardımcı olabilirim?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick suggestions
  const quickSuggestions = [
    'Aracımın motor sesi farklı geliyor',
    'Ne zaman yağ değişimi yapmalıyım?',
    'Bu arıza lambası ne anlama geliyor?',
    'En yakın servis nerede?',
    'Bakım maliyeti ne kadar?'
  ];

  // AI Response Generator
  const generateAIResponse = async (userMessage: string): Promise<{ message: string; suggestions?: string[] }> => {
    setIsTyping(true);
    
    try {
      // API endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Get conversation history
      const conversationHistory = messages
        .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
        .slice(-10); // Son 10 mesaj
      
      const response = await fetch(`${apiUrl}/api/ai/demo-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory
        })
      });
      
      if (!response.ok) {
        throw new Error('API yanıt vermedi');
      }
      
      const data = await response.json();
      
      if (data.success) {
        return {
          message: data.message,
          suggestions: data.suggestions || []
        };
      } else {
        throw new Error(data.message || 'AI yanıt üretemedi');
      }
      
    } catch (error) {
      console.error('AI API Error:', error);
      
      // Fallback to mock response
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('motor') && lowerMessage.includes('ses')) {
        return {
          message: `🔧 **Motor Ses Analizi**\n\nMotor sesindeki değişiklik birkaç nedenden kaynaklanabilir:\n\n• **Yağ seviyesi düşük** - Kontrol edilmeli\n• **Egzoz sistemi** - Mufler arızası olabilir\n• **Motor takımları** - Timing belt kontrolü gerekli\n• **Yakıt sistemi** - Enjektör temizliği\n\n**Önerim:** En kısa sürede servise götürün. Motor sesi ciddi arızalara işaret edebilir.`,
          suggestions: ['Servis randevusu', 'Yağ kontrolü', 'Arıza teşhisi']
        };
      }
      
      if (lowerMessage.includes('yağ') && lowerMessage.includes('değişim')) {
        return {
          message: `🛢️ **Yağ Değişimi Önerisi**\n\n**Genel Kural:** Her 10.000 km'de bir yağ değişimi\n\n**Aracınızın Durumu:**\n• Son yağ değişimi: 5.000 km önce\n• Kalan mesafe: 5.000 km\n• Önerilen tarih: 2 hafta sonra\n\n**Yağ Türü:** 5W-30 (Synthetic)\n**Maliyet:** ~₺800-1200\n\n**AI Önerisi:** Şimdi randevu alabilirsiniz!`,
          suggestions: ['Randevu al', 'Fiyat hesapla', 'Bakım takvimi']
        };
      }
      
      if (lowerMessage.includes('arıza') && lowerMessage.includes('lamba')) {
        return {
          message: `⚠️ **Arıza Lambası Analizi**\n\nArıza lambası yandığında:\n\n**Acil Durumlar (Kırmızı):**\n• Motor arızası - Hemen durun\n• Yağ basıncı - Motoru kapatın\n• Soğutma sistemi - Kontrol edin\n\n**Uyarılar (Sarı):**\n• ABS sistemi\n• Hava yastığı\n• Emisyon sistemi\n\n**Çözüm:** OBD cihazı ile kod okutun veya servise gidin.`,
          suggestions: ['Acil servis', 'OBD okutma', 'Servis bul']
        };
      }
      
      if (lowerMessage.includes('servis') && lowerMessage.includes('nerede')) {
        return {
          message: `📍 **En Yakın Servisler**\n\n**OtoTakibim Partner Servisleri:**\n\n1. **Merkez Oto Servis** (2.3 km)\n   📞 0212 555 0123\n   ⭐ 4.8/5 puan\n   🕒 08:00-18:00\n\n2. **Güvenilir Oto** (3.1 km)\n   📞 0212 555 0456\n   ⭐ 4.6/5 puan\n   🕒 07:00-19:00\n\n3. **Hızlı Tamir** (4.2 km)\n   📞 0212 555 0789\n   ⭐ 4.4/5 puan\n   🕒 24/7 açık\n\n**Randevu almak için:** Hemen bağlantı kurabilirim!`,
          suggestions: ['Randevu al', 'Harita görüntüle', 'Fiyat karşılaştır']
        };
      }
      
      if (lowerMessage.includes('maliyet') || lowerMessage.includes('fiyat')) {
        return {
          message: `💰 **Bakım Maliyeti Analizi**\n\n**Ortalama Maliyetler (2024):**\n\n• **Yağ değişimi:** ₺800-1200\n• **Fren balata:** ₺1500-2500\n• **Lastik değişimi:** ₺4000-8000\n• **Fren hidroliği:** ₺300-500\n• **Hava filtresi:** ₺150-300\n\n**Aracınız için özel fiyat:**\nAraç bilgilerinizi paylaşırsanız size özel hesaplama yapabilirim!`,
          suggestions: ['Özel hesaplama', 'Fiyat karşılaştır', 'Bütçe planla']
        };
      }
      
      // Default response
      return {
        message: `🤖 **AI Asistan Yanıtı**\n\nMesajınızı aldım! Size daha iyi yardımcı olabilmem için:\n\n• Araç marka/model bilgisi\n• Kilometre bilgisi\n• Son bakım tarihi\n• Karşılaştığınız sorun\n\nBu bilgileri paylaşırsanız size özel öneriler sunabilirim!\n\n**Hızlı Seçenekler:**\n• 🚗 Araç ekleme\n• 📅 Randevu alma\n• 🔧 Servis önerisi\n• 📊 Sağlık raporu`,
        suggestions: ['Araç ekle', 'Randevu al', 'Servis önerisi', 'Sağlık raporu']
      };
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Generate AI response
    const aiResponse = await generateAIResponse(inputText);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse.message,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, aiMessage]);
    
    // Add suggestions if available
    if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
      const suggestionMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Hızlı öneriler:',
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion',
        data: aiResponse.suggestions
      };
      setMessages(prev => [...prev, suggestionMessage]);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Merhaba! OtoTakibim AI Asistanından bilgi almak istiyorum.');
    window.open(`https://wa.me/905555555555?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+905555555555', '_self');
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={onToggle}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 group"
        >
          <Bot className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            1
          </div>
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 100 }}
        className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">OtoTakibim AI</h3>
              <p className="text-xs text-blue-100">7/24 Araç Sağlık Asistanı</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm">{message.text}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('tr-TR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 text-xs rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">WhatsApp</span>
                </button>
                <button
                  onClick={handleCall}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Ara</span>
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChatbot;
