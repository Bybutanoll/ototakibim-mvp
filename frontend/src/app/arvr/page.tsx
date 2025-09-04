'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Play, 
  Star, 
  Clock, 
  Search, 
  Filter,
  Plus,
  EyeOff,
  Smartphone,
  Monitor,
  Headphones,
  Glasses,
  Zap,
  Target,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ARVRExperience {
  _id: string;
  userId: string;
  vehicleId: string;
  workOrderId?: string;
  experienceType: 'ar_inspection' | 'vr_service' | 'ar_guidance' | 'vr_training' | 'ar_diagnostic';
  title: string;
  description: string;
  content: {
    sceneData: {
      vehicleModel: string;
      environment: string;
      lighting: string;
      cameraPosition: {
        x: number;
        y: number;
        z: number;
      };
      focusPoints: Array<{
        id: string;
        name: string;
        position: { x: number; y: number; z: number };
        description: string;
        action: string;
      }>;
    };
    interactions: Array<{
      id: string;
      type: 'click' | 'hover' | 'drag' | 'voice' | 'gesture';
      target: string;
      action: string;
      feedback: string;
      nextStep?: string;
    }>;
    instructions: Array<{
      step: number;
      title: string;
      description: string;
      duration: number;
      required: boolean;
    }>;
  };
  settings: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
    language: string;
    deviceSupport: Array<'mobile' | 'tablet' | 'desktop' | 'vr_headset' | 'ar_glasses'>;
  };
  analytics: {
    views: number;
    completions: number;
    averageDuration: number;
    userRatings: Array<{
      userId: string;
      rating: number;
      feedback: string;
      timestamp: string;
    }>;
  };
  status: 'draft' | 'published' | 'archived';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ARVRAnalytics {
  totalExperiences: number;
  totalViews: number;
  totalCompletions: number;
  averageCompletionRate: number;
  experienceTypeStats: {
    [key: string]: {
      count: number;
      views: number;
      completions: number;
    };
  };
}

export default function ARVRPage() {
  const [experiences, setExperiences] = useState<ARVRExperience[]>([]);
  const [analytics, setAnalytics] = useState<ARVRAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState<ARVRExperience | null>(null);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchARVRData();
  }, []);

  const fetchARVRData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics
      const analyticsResponse = await fetch('/api/arvr/analytics');
      const analyticsData = await analyticsResponse.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }

      // Fetch demo experiences
      const demoResponse = await fetch('/api/arvr/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user-id',
          vehicleId: 'demo-vehicle-id'
        })
      });
      
      if (demoResponse.ok) {
        const demoData = await demoResponse.json();
        if (demoData.success) {
          setExperiences(demoData.data);
        }
      }
    } catch (error) {
      console.error('AR/VR data fetch error:', error);
      toast.error('AR/VR verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const startExperience = async (experienceId: string) => {
    try {
      setSelectedExperience(experiences.find(exp => exp._id === experienceId) || null);
      setShowExperienceModal(true);
      setCurrentStep(0);
      setIsPlaying(true);

      // Track interaction
      await fetch('/api/arvr/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experienceId,
          userId: 'demo-user-id',
          action: 'start_experience',
          duration: 0,
          success: true
        })
      });
    } catch (error) {
      toast.error('Deneyim başlatılırken hata oluştu');
    }
  };

  const completeExperience = async (experienceId: string) => {
    try {
      await fetch(`/api/arvr/experiences/${experienceId}/complete`, {
        method: 'POST'
      });
      
      toast.success('Deneyim tamamlandı!');
      setIsPlaying(false);
      setShowExperienceModal(false);
      fetchARVRData(); // Refresh data
    } catch (error) {
      toast.error('Deneyim tamamlanırken hata oluştu');
    }
  };

  const addRating = async (experienceId: string, rating: number, feedback: string) => {
    try {
      await fetch('/api/arvr/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experienceId,
          userId: 'demo-user-id',
          rating,
          feedback
        })
      });
      
      toast.success('Değerlendirme eklendi!');
      fetchARVRData(); // Refresh data
    } catch (error) {
      toast.error('Değerlendirme eklenirken hata oluştu');
    }
  };

  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         experience.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || experience.experienceType === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || experience.settings.difficulty === filterDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getExperienceTypeColor = (type: string) => {
    switch (type) {
      case 'ar_inspection': return 'bg-blue-100 text-blue-800';
      case 'vr_service': return 'bg-purple-100 text-purple-800';
      case 'ar_guidance': return 'bg-green-100 text-green-800';
      case 'vr_training': return 'bg-orange-100 text-orange-800';
      case 'ar_diagnostic': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceTypeIcon = (type: string) => {
    switch (type) {
      case 'ar_inspection': return <Eye className="h-5 w-5" />;
      case 'vr_service': return <Play className="h-5 w-5" />;
      case 'ar_guidance': return <Target className="h-5 w-5" />;
      case 'vr_training': return <Award className="h-5 w-5" />;
      case 'ar_diagnostic': return <Zap className="h-5 w-5" />;
      default: return <Eye className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Monitor className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'vr_headset': return <Headphones className="h-4 w-4" />;
      case 'ar_glasses': return <Glasses className="h-4 w-4" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  const getAverageRating = (ratings: any[]) => {
    if (!ratings || ratings.length === 0) return 0;
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return totalRating / ratings.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Glasses className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AR/VR Deneyimleri
                </h1>
                <p className="text-gray-600 text-sm">Sanal servis deneyimi platformu</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchARVRData}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
            >
              Yenile
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Deneyim</p>
                <p className="text-3xl font-bold text-gray-900">{analytics?.totalExperiences || 0}</p>
              </div>
              <Glasses className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Toplam Görüntüleme</p>
                <p className="text-3xl font-bold text-blue-600">{analytics?.totalViews || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tamamlanan</p>
                <p className="text-3xl font-bold text-green-600">{analytics?.totalCompletions || 0}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tamamlama Oranı</p>
                <p className="text-3xl font-bold text-orange-600">{(analytics?.averageCompletionRate || 0).toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/50 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Deneyim ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="all">Tüm Türler</option>
              <option value="ar_inspection">AR İnceleme</option>
              <option value="vr_service">VR Servis</option>
              <option value="ar_guidance">AR Rehber</option>
              <option value="vr_training">VR Eğitim</option>
              <option value="ar_diagnostic">AR Tanı</option>
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            >
              <option value="all">Tüm Seviyeler</option>
              <option value="beginner">Başlangıç</option>
              <option value="intermediate">Orta</option>
              <option value="advanced">İleri</option>
            </select>
          </div>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience, index) => (
            <motion.div
              key={experience._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                      {getExperienceTypeIcon(experience.experienceType)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceTypeColor(experience.experienceType)}`}>
                      {experience.experienceType.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(experience.settings.difficulty)}`}>
                    {experience.settings.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{experience.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{experience.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{experience.settings.duration} dk</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{experience.analytics.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>{getAverageRating(experience.analytics.userRatings).toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  {experience.settings.deviceSupport.map((device, deviceIndex) => (
                    <div key={deviceIndex} className="p-1 bg-gray-100 rounded" title={device}>
                      {getDeviceIcon(device)}
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startExperience(experience._id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Deneyimi Başlat
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Experience Modal */}
      {showExperienceModal && selectedExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedExperience.title}</h2>
                  <p className="text-gray-600 text-sm">{selectedExperience.description}</p>
                </div>
                <button
                  onClick={() => setShowExperienceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {isPlaying ? (
                <div className="space-y-6">
                  {/* Current Step */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Adım {currentStep + 1}: {selectedExperience.content.instructions[currentStep]?.title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {selectedExperience.content.instructions[currentStep]?.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Süre: {selectedExperience.content.instructions[currentStep]?.duration} saniye</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / selectedExperience.content.instructions.length) * 100}%` }}
                    ></div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </motion.button>

                    {currentStep < selectedExperience.content.instructions.length - 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
                      >
                        Sonraki
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => completeExperience(selectedExperience._id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg"
                      >
                        Tamamla
                      </motion.button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Deneyim Hazır!</h3>
                  <p className="text-gray-600 mb-6">Sanal gerçeklik deneyimini başlatmak için hazır mısınız?</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Başlat
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
