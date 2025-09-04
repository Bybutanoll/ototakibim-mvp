'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Settings, 
  X,
  Lightbulb,
  Wrench,
  Car,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionType?: 'maintenance' | 'pricing' | 'appointment' | 'general';
}

interface AISuggestion {
  type: 'maintenance' | 'pricing' | 'appointment' | 'general';
  title: string;
  description: string;
  action?: string;
  icon: React.ReactNode;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiSuggestions: AISuggestion[] = [
    {
      type: 'maintenance',
      title: 'Bakım Önerileri',
      description: 'Aracınız için AI destekli bakım önerileri alın',
      action: 'Aracımın bakım durumu nasıl?',
      icon: <Wrench className="w-5 h-5" />
    },
    {
      type: 'pricing',
      title: 'Fiyat Analizi',
      description: 'Servis fiyatlarınızı optimize edin',
      action: 'Fiyatlarımı nasıl optimize edebilirim?',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      type: 'appointment',
      title: 'Randevu Yönetimi',
      description: 'Randevu sisteminizi optimize edin',
      action: 'Randevu sistemimi nasıl iyileştirebilirim?',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      type: 'general',
      title: 'Genel Sorular',
      description: 'OtoTakibim hakkında sorularınız',
      action: 'OtoTakibim nasıl çalışır?',
      icon: <MessageCircle className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'ai',
        content: 'Merhaba! Ben OtoTakibim AI asistanınız. Size nasıl yardımcı olabilirim? Araç bakımı, fiyatlandırma, randevu yönetimi veya genel sorularınız için buradayım. 🚗',
        timestamp: new Date(),
        suggestions: [
          'Aracımın bakım durumu nasıl?',
          'Fiyatlarımı nasıl optimize edebilirim?',
          'Randevu sistemimi nasıl iyileştirebilirim?'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        actionType: aiResponse.actionType
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): { content: string; suggestions?: string[]; actionType?: string } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('bakım') || message.includes('maintenance')) {
      return {
        content: 'Aracınızın bakım durumunu analiz ediyorum... 🔍\n\n**Mevcut Durum:**\n• Motor yağı: 85% (İyi durumda)\n• Fren sistemi: 92% (Mükemmel)\n• Lastikler: 78% (Kontrol edilmeli)\n• Klima: 88% (İyi durumda)\n\n**Öneriler:**\n• 2 hafta içinde lastik kontrolü yapılmalı\n• 1 ay içinde genel bakım önerilir\n• Motor yağı 3 ay sonra değiştirilebilir\n\nDetaylı bakım planı oluşturmamı ister misiniz?',
        suggestions: [
          'Detaylı bakım planı oluştur',
          'Bakım maliyeti hesapla',
          'Randevu oluştur'
        ],
        actionType: 'maintenance'
      };
    }
    
    if (message.includes('fiyat') || message.includes('pricing') || message.includes('maliyet')) {
      return {
        content: 'Fiyat analizi yapıyorum... 💰\n\n**Mevcut Fiyatlarınız:**\n• Motor yağı değişimi: ₺450\n• Fren balata değişimi: ₺800\n• Genel bakım: ₺1,200\n\n**Pazar Analizi:**\n• Ortalama fiyat: ₺520 (Motor yağı)\n• Rekabetçi fiyat: ₺480-500\n• Premium fiyat: ₺550+\n\n**Öneriler:**\n• Motor yağı fiyatınız rekabetçi ✅\n• Fren balata fiyatınız ortalamanın altında ✅\n• Genel bakım fiyatınız uygun ✅\n\nFiyat optimizasyonu için detaylı analiz yapmamı ister misiniz?',
        suggestions: [
          'Detaylı fiyat analizi',
          'Rekabet analizi',
          'Fiyat önerileri'
        ],
        actionType: 'pricing'
      };
    }
    
    if (message.includes('randevu') || message.includes('appointment')) {
      return {
        content: 'Randevu sisteminizi analiz ediyorum... 📅\n\n**Mevcut Durum:**\n• Bu hafta: 12 randevu\n• Gelecek hafta: 8 randevu\n• Ortalama bekleme süresi: 2 gün\n• İptal oranı: %8\n\n**Öneriler:**\n• Online randevu sistemi kullanımı: %95 ✅\n• SMS hatırlatmaları: %88 ✅\n• Müşteri memnuniyeti: 4.7/5 ✅\n\n**İyileştirme Önerileri:**\n• WhatsApp entegrasyonu eklenebilir\n• Otomatik hatırlatma sistemi geliştirilebilir\n• Müşteri geri bildirim sistemi eklenebilir',
        suggestions: [
          'WhatsApp entegrasyonu',
          'Otomatik hatırlatma',
          'Müşteri geri bildirim sistemi'
        ],
        actionType: 'appointment'
      };
    }
    
    if (message.includes('nasıl') || message.includes('how') || message.includes('çalışır')) {
      return {
        content: 'OtoTakibim sistemi hakkında bilgi veriyorum... 🚗\n\n**OtoTakibim Nedir?**\nOtoTakibim, oto tamir servisleri için geliştirilmiş kapsamlı bir yönetim sistemidir.\n\n**Ana Özellikler:**\n• Araç ve müşteri yönetimi\n• Randevu ve iş emri takibi\n• Finansal analiz ve raporlama\n• AI destekli bakım önerileri\n• Mobil uygulama desteği\n• Push bildirimleri\n\n**Faydalar:**\n• %40 maliyet düşüşü\n• %60 verimlilik artışı\n• Müşteri memnuniyeti artışı\n• Otomatik süreçler\n\nHangi özellik hakkında daha detaylı bilgi almak istersiniz?',
        suggestions: [
          'Araç yönetimi',
          'Finansal analiz',
          'Mobil uygulama'
        ],
        actionType: 'general'
      };
    }
    
    // Default response
    return {
      content: 'Anladım! Size nasıl yardımcı olabileceğimi düşünüyorum... 🤔\n\nAraç bakımı, fiyatlandırma, randevu yönetimi veya OtoTakibim sistemi hakkında daha spesifik sorular sorabilirsiniz. Size en iyi şekilde yardımcı olmak için buradayım!',
      suggestions: [
        'Araç bakım önerileri',
        'Fiyat analizi',
        'Randevu sistemi'
      ],
      actionType: 'general'
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage(suggestion);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'tr-TR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSendMessage(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">OtoTakibim AI</h3>
                <p className="text-xs text-blue-200">Çevrimiçi</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length > 0 && messages[messages.length - 1].type === 'ai' && messages[messages.length - 1].suggestions && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Mesajınızı yazın..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}