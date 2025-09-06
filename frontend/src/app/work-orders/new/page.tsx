'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function NewWorkOrderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    vehicleVin: '',
    problemDescription: '',
    estimatedCost: '',
    priority: 'normal',
    assignedTechnician: '',
    estimatedDuration: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Backend API'ye gönder
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://ototakibim-mvp.onrender.com/api'}/work-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('İş emri başarıyla oluşturuldu!');
        
        // 2 saniye sonra iş emirleri listesine yönlendir
        setTimeout(() => {
          router.push('/work-orders');
        }, 2000);
      } else {
        toast.error(result.message || 'İş emri oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('İş emri oluşturulurken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeIn">
            Yeni İş Emri Oluştur
          </h1>
          <p className="text-xl text-blue-200 animate-slideUp">
            Müşteri ve araç bilgilerini girerek yeni iş emri oluşturun
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Müşteri Bilgileri */}
            <div className="glass-card p-8 animate-scaleIn">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  👤
                </span>
                Müşteri Bilgileri
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Müşteri Adı *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Müşteri adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="0555 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="musteri@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Araç Bilgileri */}
            <div className="glass-card p-8 animate-scaleIn">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  🚗
                </span>
                Araç Bilgileri
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Marka *
                  </label>
                  <input
                    type="text"
                    name="vehicleBrand"
                    value={formData.vehicleBrand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Toyota, BMW, Mercedes..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Corolla, 3 Series..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Yıl
                  </label>
                  <input
                    type="number"
                    name="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="2020"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Plaka *
                  </label>
                  <input
                    type="text"
                    name="vehiclePlate"
                    value={formData.vehiclePlate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="34 ABC 123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    VIN Kodu
                  </label>
                  <input
                    type="text"
                    name="vehicleVin"
                    value={formData.vehicleVin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="17 karakterlik VIN kodu"
                  />
                </div>
              </div>
            </div>

            {/* İş Emri Detayları */}
            <div className="glass-card p-8 animate-scaleIn">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  🔧
                </span>
                İş Emri Detayları
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Problem Açıklaması *
                  </label>
                  <textarea
                    name="problemDescription"
                    value={formData.problemDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                    placeholder="Aracın yaşadığı problemi detaylı olarak açıklayın..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Tahmini Maliyet
                    </label>
                    <input
                      type="number"
                      name="estimatedCost"
                      value={formData.estimatedCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Öncelik
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value="low">Düşük</option>
                      <option value="normal">Normal</option>
                      <option value="high">Yüksek</option>
                      <option value="urgent">Acil</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Teknisyen
                    </label>
                    <select
                      name="assignedTechnician"
                      value={formData.assignedTechnician}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value="">Teknisyen Seçin</option>
                      <option value="tech1">Ahmet Yılmaz</option>
                      <option value="tech2">Mehmet Demir</option>
                      <option value="tech3">Ali Kaya</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Tahmini Süre (Saat)
                    </label>
                    <input
                      type="number"
                      name="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={handleInputChange}
                      min="0.5"
                      step="0.5"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                      placeholder="2.5"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Notlar
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
                    placeholder="Ek notlar, özel talimatlar..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => router.push('/work-orders')}
                className="px-8 py-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
              >
                <span className="mr-2">←</span>
                İptal
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✓</span>
                    İş Emri Oluştur
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
