'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  WrenchIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowRightIcon,
  UserIcon,
  TruckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface WorkOrder {
  id: string;
  customerName: string;
  vehicleInfo: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  estimatedCost: number;
  createdAt: string;
  updatedAt: string;
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    
    // Demo veriler
    const demoWorkOrders: WorkOrder[] = [
      {
        id: '1',
        customerName: 'Ahmet Yılmaz',
        vehicleInfo: 'BMW X5 - 2020',
        description: 'Motor yağı değişimi ve genel bakım',
        status: 'completed',
        priority: 'medium',
        estimatedCost: 2500,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-16'
      },
      {
        id: '2',
        customerName: 'Fatma Demir',
        vehicleInfo: 'Mercedes C200 - 2019',
        description: 'Fren sistemi kontrolü ve balata değişimi',
        status: 'in-progress',
        priority: 'high',
        estimatedCost: 1800,
        createdAt: '2024-01-17',
        updatedAt: '2024-01-17'
      },
      {
        id: '3',
        customerName: 'Mehmet Kaya',
        vehicleInfo: 'Audi A4 - 2021',
        description: 'Klima bakımı ve gaz doldurma',
        status: 'pending',
        priority: 'low',
        estimatedCost: 1200,
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18'
      }
    ];

    setWorkOrders(demoWorkOrders);
    setIsLoading(false);
  }, []);

  // Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.2 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 60) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.05 * (1 - distance / 60)})`;
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'in-progress':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'in-progress':
        return <ClockIcon className="h-4 w-4" />;
      case 'pending':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'cancelled':
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredWorkOrders = workOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-600/20 animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 transform group-hover:scale-110">
                  <WrenchIcon className="h-6 w-6 text-white" />
                </div>
                <SparklesIcon className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  İş Emirleri
                </h1>
                <p className="text-xs text-gray-400">Yönetim Paneli</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105"
              >
                ← Dashboard'a Dön
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Header Section */}
          <div className="px-4 py-6 sm:px-0 mb-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    İş Emirleri Yönetimi
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Tüm iş emirlerini görüntüleyin ve yönetin
                  </p>
                </div>
                <button
                  onClick={() => router.push('/work-orders/new')}
                  className="group bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
                >
                  <PlusIcon className="h-5 w-5 group-hover:animate-pulse" />
                  <span>Yeni İş Emri</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="group bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Toplam</p>
                      <p className="text-2xl font-bold text-white">{workOrders.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="group bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Bekleyen</p>
                      <p className="text-2xl font-bold text-yellow-400">{workOrders.filter(o => o.status === 'pending').length}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="group bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Devam Eden</p>
                      <p className="text-2xl font-bold text-blue-400">{workOrders.filter(o => o.status === 'in-progress').length}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <WrenchIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="group bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Tamamlanan</p>
                      <p className="text-2xl font-bold text-green-400">{workOrders.filter(o => o.status === 'completed').length}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 py-6 sm:px-0 mb-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Müşteri, araç veya açıklama ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div className="relative">
                  <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="all">Tüm Durumlar</option>
                    <option value="pending">Bekleyen</option>
                    <option value="in-progress">Devam Eden</option>
                    <option value="completed">Tamamlanan</option>
                    <option value="cancelled">İptal Edilen</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Work Orders List */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <div className="p-6">
                {filteredWorkOrders.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <DocumentTextIcon className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-medium mb-2">İş emri bulunamadı</p>
                    <p className="text-sm">
                      {searchTerm || statusFilter !== 'all' ? 'Arama kriterlerinizi değiştirmeyi deneyin' : 'İlk iş emrinizi oluşturun'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredWorkOrders.map((order) => (
                      <div
                        key={order.id}
                        className="group bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/25 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                {order.customerName}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} flex items-center space-x-1`}>
                                {getStatusIcon(order.status)}
                                <span>{order.status === 'in-progress' ? 'Devam Ediyor' : 
                                       order.status === 'completed' ? 'Tamamlandı' : 
                                       order.status === 'pending' ? 'Bekliyor' : 'İptal Edildi'}</span>
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                                {order.priority === 'high' ? 'Yüksek' : 
                                 order.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                              <div className="flex items-center space-x-2">
                                <TruckIcon className="h-4 w-4 text-blue-400" />
                                <span>{order.vehicleInfo}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CurrencyDollarIcon className="h-4 w-4 text-green-400" />
                                <span>₺{order.estimatedCost.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <ClockIcon className="h-4 w-4 text-yellow-400" />
                                <span>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-400 mt-3 text-sm">
                              {order.description}
                            </p>
                          </div>
                          
                                                     <div className="flex items-center space-x-2">
                             <button 
                               onClick={() => router.push(`/work-orders/${order.id}`)}
                               className="p-2 text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105"
                             >
                               <ArrowRightIcon className="h-5 w-5" />
                             </button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
