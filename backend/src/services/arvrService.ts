import { ARVRExperience, IARVRExperience } from '../models/ARVRExperience';

export interface ARVRExperienceData {
  userId: string;
  vehicleId: string;
  workOrderId?: string;
  experienceType: 'ar_inspection' | 'vr_service' | 'ar_guidance' | 'vr_training' | 'ar_diagnostic';
  title: string;
  description: string;
  content: {
    sceneData: {
      vehicleModel: string;
      environment?: string;
      lighting?: string;
      cameraPosition?: {
        x: number;
        y: number;
        z: number;
      };
      focusPoints?: Array<{
        id: string;
        name: string;
        position: { x: number; y: number; z: number };
        description: string;
        action: string;
      }>;
    };
    interactions?: Array<{
      id: string;
      type: 'click' | 'hover' | 'drag' | 'voice' | 'gesture';
      target: string;
      action: string;
      feedback: string;
      nextStep?: string;
    }>;
    mediaAssets?: Array<{
      type: 'image' | 'video' | '3d_model' | 'audio' | 'texture';
      url: string;
      filename: string;
      size: number;
      metadata?: {
        width?: number;
        height?: number;
        duration?: number;
        format?: string;
      };
    }>;
    instructions?: Array<{
      step: number;
      title: string;
      description: string;
      duration: number;
      required: boolean;
    }>;
  };
  settings?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    duration?: number;
    language?: string;
    accessibility?: {
      subtitles?: boolean;
      audioDescription?: boolean;
      highContrast?: boolean;
      largeText?: boolean;
    };
    deviceSupport?: Array<'mobile' | 'tablet' | 'desktop' | 'vr_headset' | 'ar_glasses'>;
  };
}

export interface InteractionData {
  experienceId: string;
  userId: string;
  action: string;
  duration: number;
  success: boolean;
  metadata?: any;
}

export interface RatingData {
  experienceId: string;
  userId: string;
  rating: number;
  feedback: string;
}

export class ARVRService {
  private static instance: ARVRService;

  public static getInstance(): ARVRService {
    if (!ARVRService.instance) {
      ARVRService.instance = new ARVRService();
    }
    return ARVRService.instance;
  }

  /**
   * Create a new AR/VR experience
   */
  async createExperience(data: ARVRExperienceData): Promise<IARVRExperience> {
    try {
      const experience = new ARVRExperience({
        userId: data.userId,
        vehicleId: data.vehicleId,
        workOrderId: data.workOrderId,
        experienceType: data.experienceType,
        title: data.title,
        description: data.description,
        content: data.content,
        settings: data.settings
      });

      await experience.save();
      return experience;
    } catch (error) {
      throw new Error(`AR/VR experience creation failed: ${error}`);
    }
  }

  /**
   * Get AR/VR experiences for a user
   */
  async getUserExperiences(userId: string, vehicleId?: string): Promise<IARVRExperience[]> {
    try {
      const filter: any = { userId, isActive: true };
      if (vehicleId) filter.vehicleId = vehicleId;

      const experiences = await ARVRExperience.find(filter)
        .sort({ createdAt: -1 })
        .populate('vehicleId')
        .populate('workOrderId')
        .exec();

      return experiences;
    } catch (error) {
      throw new Error(`Failed to fetch user experiences: ${error}`);
    }
  }

  /**
   * Get a specific AR/VR experience
   */
  async getExperience(experienceId: string): Promise<IARVRExperience | null> {
    try {
      const experience = await ARVRExperience.findById(experienceId)
        .populate('vehicleId')
        .populate('workOrderId')
        .populate('userId')
        .exec();

      if (experience) {
        // Increment view count
        experience.analytics.views += 1;
        await experience.save();
      }

      return experience;
    } catch (error) {
      throw new Error(`Failed to fetch experience: ${error}`);
    }
  }

  /**
   * Update AR/VR experience
   */
  async updateExperience(experienceId: string, updateData: Partial<ARVRExperienceData>): Promise<IARVRExperience | null> {
    try {
      const experience = await ARVRExperience.findByIdAndUpdate(
        experienceId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return experience;
    } catch (error) {
      throw new Error(`Failed to update experience: ${error}`);
    }
  }

  /**
   * Track user interaction
   */
  async trackInteraction(data: InteractionData): Promise<void> {
    try {
      const experience = await ARVRExperience.findById(data.experienceId);
      if (!experience) {
        throw new Error('Experience not found');
      }

      experience.analytics.interactions.push({
        action: data.action,
        timestamp: new Date(),
        duration: data.duration,
        success: data.success
      });

      await experience.save();
    } catch (error) {
      throw new Error(`Failed to track interaction: ${error}`);
    }
  }

  /**
   * Add user rating
   */
  async addRating(data: RatingData): Promise<void> {
    try {
      const experience = await ARVRExperience.findById(data.experienceId);
      if (!experience) {
        throw new Error('Experience not found');
      }

      // Check if user already rated
      const existingRating = experience.analytics.userRatings.find(
        rating => rating.userId.toString() === data.userId
      );

      if (existingRating) {
        // Update existing rating
        existingRating.rating = data.rating;
        existingRating.feedback = data.feedback;
        existingRating.timestamp = new Date();
      } else {
        // Add new rating
        experience.analytics.userRatings.push({
          userId: data.userId as any,
          rating: data.rating,
          feedback: data.feedback,
          timestamp: new Date()
        });
      }

      await experience.save();
    } catch (error) {
      throw new Error(`Failed to add rating: ${error}`);
    }
  }

  /**
   * Mark experience as completed
   */
  async markCompleted(experienceId: string): Promise<void> {
    try {
      const experience = await ARVRExperience.findById(experienceId);
      if (!experience) {
        throw new Error('Experience not found');
      }

      experience.analytics.completions += 1;
      await experience.save();
    } catch (error) {
      throw new Error(`Failed to mark as completed: ${error}`);
    }
  }

  /**
   * Get AR/VR analytics
   */
  async getAnalytics(userId?: string): Promise<any> {
    try {
      const filter: any = { isActive: true };
      if (userId) filter.userId = userId;

      const experiences = await ARVRExperience.find(filter);
      
      const totalExperiences = experiences.length;
      const totalViews = experiences.reduce((sum, exp) => sum + exp.analytics.views, 0);
      const totalCompletions = experiences.reduce((sum, exp) => sum + exp.analytics.completions, 0);
      const averageCompletionRate = totalViews > 0 ? (totalCompletions / totalViews) * 100 : 0;

      const experienceTypeStats = experiences.reduce((stats, exp) => {
        const type = exp.experienceType;
        if (!stats[type]) {
          stats[type] = { count: 0, views: 0, completions: 0 };
        }
        stats[type].count += 1;
        stats[type].views += exp.analytics.views;
        stats[type].completions += exp.analytics.completions;
        return stats;
      }, {} as any);

      return {
        totalExperiences,
        totalViews,
        totalCompletions,
        averageCompletionRate,
        experienceTypeStats
      };
    } catch (error) {
      throw new Error(`Failed to get analytics: ${error}`);
    }
  }

  /**
   * Generate demo AR/VR experiences
   */
  async generateDemoExperiences(userId: string, vehicleId: string): Promise<IARVRExperience[]> {
    try {
      const demoExperiences = [
        {
          experienceType: 'ar_inspection' as const,
          title: 'AR Motor Kontrolü',
          description: 'Artırılmış gerçeklik ile motor bölümünü detaylı inceleyin',
          content: {
            sceneData: {
              vehicleModel: 'BMW 320i 2020',
              environment: 'garage',
              lighting: 'natural',
              cameraPosition: { x: 0, y: 1.5, z: 2 },
              focusPoints: [
                {
                  id: 'engine_oil',
                  name: 'Motor Yağı Kontrolü',
                  position: { x: 0, y: 0.8, z: 0 },
                  description: 'Motor yağı seviyesini kontrol edin',
                  action: 'Yağ çubuğunu çıkarın ve seviyeyi kontrol edin'
                },
                {
                  id: 'air_filter',
                  name: 'Hava Filtresi',
                  position: { x: 0.5, y: 1.2, z: 0 },
                  description: 'Hava filtresini kontrol edin',
                  action: 'Filtre kutusunu açın ve filtreyi inceleyin'
                }
              ]
            },
            interactions: [
              {
                id: 'check_oil',
                type: 'click' as const,
                target: 'engine_oil',
                action: 'Yağ çubuğunu çıkar',
                feedback: 'Yağ seviyesi normal görünüyor'
              }
            ],
            instructions: [
              {
                step: 1,
                title: 'Motor Kapağını Açın',
                description: 'Motor kapağını güvenli bir şekilde açın',
                duration: 30,
                required: true
              },
              {
                step: 2,
                title: 'Yağ Seviyesini Kontrol Edin',
                description: 'Yağ çubuğunu çıkarın ve seviyeyi kontrol edin',
                duration: 60,
                required: true
              }
            ]
          },
          settings: {
            difficulty: 'beginner' as const,
            duration: 5,
            language: 'tr',
            deviceSupport: ['mobile' as const, 'tablet' as const]
          }
        },
        {
          experienceType: 'vr_service' as const,
          title: 'VR Yağ Değişimi Simülasyonu',
          description: 'Sanal gerçeklik ile yağ değişimi işlemini öğrenin',
          content: {
            sceneData: {
              vehicleModel: 'BMW 320i 2020',
              environment: 'service_bay',
              lighting: 'artificial',
              cameraPosition: { x: 0, y: 1.7, z: 1 },
              focusPoints: [
                {
                  id: 'oil_drain',
                  name: 'Yağ Tahliye Tapası',
                  position: { x: 0, y: 0.3, z: 0 },
                  description: 'Motor altındaki yağ tahliye tapası',
                  action: 'Tapayı gevşetin ve yağı boşaltın'
                }
              ]
            },
            interactions: [
              {
                id: 'remove_drain_plug',
                type: 'drag' as const,
                target: 'oil_drain',
                action: 'Tapayı çıkar',
                feedback: 'Yağ tahliye ediliyor...'
              }
            ],
            instructions: [
              {
                step: 1,
                title: 'Aracı Kaldırın',
                description: 'Aracı hidrolik kaldırıcı ile yükseltin',
                duration: 45,
                required: true
              },
              {
                step: 2,
                title: 'Yağı Boşaltın',
                description: 'Tahliye tapasını çıkarın ve yağı boşaltın',
                duration: 120,
                required: true
              }
            ]
          },
          settings: {
            difficulty: 'intermediate' as const,
            duration: 15,
            language: 'tr',
            deviceSupport: ['vr_headset' as const, 'desktop' as const]
          }
        },
        {
          experienceType: 'ar_guidance' as const,
          title: 'AR Fren Sistemi Rehberi',
          description: 'Artırılmış gerçeklik ile fren sistemini tanıyın',
          content: {
            sceneData: {
              vehicleModel: 'BMW 320i 2020',
              environment: 'garage',
              lighting: 'natural',
              cameraPosition: { x: 0, y: 1.2, z: 1.5 },
              focusPoints: [
                {
                  id: 'brake_pads',
                  name: 'Fren Balataları',
                  position: { x: 0.8, y: 0.4, z: 0 },
                  description: 'Ön fren balataları',
                  action: 'Balata kalınlığını ölçün'
                }
              ]
            },
            interactions: [
              {
                id: 'measure_pads',
                type: 'click' as const,
                target: 'brake_pads',
                action: 'Kalınlık ölçer kullan',
                feedback: 'Balata kalınlığı: 8mm (Normal)'
              }
            ],
            instructions: [
              {
                step: 1,
                title: 'Tekerleği Çıkarın',
                description: 'Ön tekerleği çıkarın',
                duration: 60,
                required: true
              },
              {
                step: 2,
                title: 'Balataları İnceleyin',
                description: 'Fren balatalarını kontrol edin',
                duration: 90,
                required: true
              }
            ]
          },
          settings: {
            difficulty: 'beginner' as const,
            duration: 8,
            language: 'tr',
            deviceSupport: ['mobile' as const, 'tablet' as const, 'ar_glasses' as const]
          }
        }
      ];

      const createdExperiences: IARVRExperience[] = [];

      for (const demoExp of demoExperiences) {
        const experience = await this.createExperience({
          userId,
          vehicleId,
          ...demoExp
        });
        createdExperiences.push(experience);
      }

      return createdExperiences;
    } catch (error) {
      throw new Error(`Demo experience generation failed: ${error}`);
    }
  }

  /**
   * Search AR/VR experiences
   */
  async searchExperiences(query: {
    userId?: string;
    vehicleId?: string;
    experienceType?: string;
    difficulty?: string;
    status?: string;
  }): Promise<IARVRExperience[]> {
    try {
      const filter: any = { isActive: true };

      if (query.userId) filter.userId = query.userId;
      if (query.vehicleId) filter.vehicleId = query.vehicleId;
      if (query.experienceType) filter.experienceType = query.experienceType;
      if (query.difficulty) filter['settings.difficulty'] = query.difficulty;
      if (query.status) filter.status = query.status;

      const experiences = await ARVRExperience.find(filter)
        .sort({ createdAt: -1 })
        .populate('vehicleId')
        .populate('workOrderId')
        .exec();

      return experiences;
    } catch (error) {
      throw new Error(`Search failed: ${error}`);
    }
  }
}
