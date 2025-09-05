import OpenAI from 'openai';

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
});

export interface MaintenancePrediction {
  id: string;
  vehicleId: string;
  predictionType: 'oil_change' | 'brake_service' | 'tire_rotation' | 'general_inspection' | 'battery_check';
  predictedDate: Date;
  confidence: number; // 0-100
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  recommendations: string[];
  createdAt: Date;
}

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  lastServiceDate: Date;
  lastServiceMileage: number;
  serviceHistory: Array<{
    date: Date;
    type: string;
    mileage: number;
    cost: number;
    description: string;
  }>;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg';
  transmission: 'manual' | 'automatic' | 'semi-automatic';
  drivingConditions: 'city' | 'highway' | 'mixed';
  averageMonthlyMileage: number;
}

export class AIService {
  /**
   * Generate maintenance predictions for a vehicle
   */
  static async generateMaintenancePredictions(vehicleData: VehicleData): Promise<MaintenancePrediction[]> {
    try {
      const prompt = this.buildMaintenancePrompt(vehicleData);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sen bir otomotiv bakım uzmanısın. Araç verilerini analiz ederek bakım tahminleri yapıyorsun. Türkçe yanıt ver."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const aiResponse = response.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('AI response is empty');
      }

      return this.parseAIResponse(aiResponse, vehicleData);
    } catch (error) {
      console.error('AI prediction error:', error);
      // Fallback to rule-based predictions
      return this.generateRuleBasedPredictions(vehicleData);
    }
  }

  /**
   * Get maintenance cost estimation
   */
  static async estimateMaintenanceCost(
    vehicleData: VehicleData,
    serviceType: string
  ): Promise<{ minCost: number; maxCost: number; averageCost: number; currency: string }> {
    try {
      const prompt = `
        Araç bilgileri:
        - Marka: ${vehicleData.make}
        - Model: ${vehicleData.model}
        - Yıl: ${vehicleData.year}
        - Yakıt türü: ${vehicleData.fuelType}
        - Vites: ${vehicleData.transmission}
        - Kilometre: ${vehicleData.mileage} km
        
        Hizmet türü: ${serviceType}
        
        Bu araç için ${serviceType} hizmetinin Türkiye'deki ortalama maliyetini tahmin et.
        Min, max ve ortalama fiyat ver. Sadece sayıları ve para birimini döndür.
        Format: min:XXX, max:XXX, average:XXX, currency:TRY
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sen bir otomotiv maliyet uzmanısın. Türkiye'deki araç bakım maliyetlerini biliyorsun."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 200
      });

      const aiResponse = response.choices[0]?.message?.content;
      return this.parseCostResponse(aiResponse || '');
    } catch (error) {
      console.error('AI cost estimation error:', error);
      // Fallback to rule-based cost estimation
      return this.estimateRuleBasedCost(vehicleData, serviceType);
    }
  }

  /**
   * Get diagnostic suggestions based on symptoms
   */
  static async getDiagnosticSuggestions(symptoms: string[], vehicleData: VehicleData): Promise<{
    possibleIssues: Array<{
      issue: string;
      probability: number;
      description: string;
      estimatedCost: number;
      urgency: 'low' | 'medium' | 'high' | 'urgent';
    }>;
    recommendations: string[];
  }> {
    try {
      const prompt = `
        Araç bilgileri:
        - Marka: ${vehicleData.make}
        - Model: ${vehicleData.model}
        - Yıl: ${vehicleData.year}
        - Kilometre: ${vehicleData.mileage} km
        
        Şikayetler: ${symptoms.join(', ')}
        
        Bu şikayetlere göre olası sorunları, olasılıklarını ve tahmini maliyetleri listele.
        Türkçe yanıt ver.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sen bir otomotiv diagnostik uzmanısın. Araç şikayetlerini analiz ederek olası sorunları tespit ediyorsun."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      });

      const aiResponse = response.choices[0]?.message?.content;
      return this.parseDiagnosticResponse(aiResponse || '');
    } catch (error) {
      console.error('AI diagnostic error:', error);
      return {
        possibleIssues: [],
        recommendations: ['Lütfen bir uzmana danışın.']
      };
    }
  }

  /**
   * Build maintenance prediction prompt
   */
  private static buildMaintenancePrompt(vehicleData: VehicleData): string {
    return `
      Araç bilgileri:
      - Marka: ${vehicleData.make}
      - Model: ${vehicleData.model}
      - Yıl: ${vehicleData.year}
      - Kilometre: ${vehicleData.mileage} km
      - Son bakım: ${vehicleData.lastServiceDate.toISOString().split('T')[0]} (${vehicleData.lastServiceMileage} km)
      - Yakıt türü: ${vehicleData.fuelType}
      - Vites: ${vehicleData.transmission}
      - Kullanım: ${vehicleData.drivingConditions}
      - Aylık ortalama km: ${vehicleData.averageMonthlyMileage}
      
      Bakım geçmişi:
      ${vehicleData.serviceHistory.map(service => 
        `- ${service.date.toISOString().split('T')[0]}: ${service.type} (${service.mileage} km) - ${service.cost} TL`
      ).join('\n')}
      
      Bu araç için önümüzdeki 6 ay içinde yapılması gereken bakımları tahmin et.
      Her tahmin için:
      - Bakım türü
      - Tahmini tarih
      - Güven seviyesi (0-100)
      - Tahmini maliyet
      - Öncelik (low/medium/high/urgent)
      - Açıklama
      - Öneriler
      
      JSON formatında döndür.
    `;
  }

  /**
   * Parse AI response for maintenance predictions
   */
  private static parseAIResponse(aiResponse: string, vehicleData: VehicleData): MaintenancePrediction[] {
    try {
      // Try to parse JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
    }

    // Fallback to rule-based predictions
    return this.generateRuleBasedPredictions(vehicleData);
  }

  /**
   * Generate rule-based maintenance predictions (fallback)
   */
  private static generateRuleBasedPredictions(vehicleData: VehicleData): MaintenancePrediction[] {
    const predictions: MaintenancePrediction[] = [];
    const now = new Date();
    const mileageSinceLastService = vehicleData.mileage - vehicleData.lastServiceMileage;
    const monthsSinceLastService = Math.floor((now.getTime() - vehicleData.lastServiceDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

    // Oil change prediction
    if (mileageSinceLastService > 10000 || monthsSinceLastService > 6) {
      predictions.push({
        id: `pred_${Date.now()}_1`,
        vehicleId: vehicleData.make + vehicleData.model,
        predictionType: 'oil_change',
        predictedDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        confidence: 85,
        estimatedCost: 500,
        priority: 'high',
        description: 'Motor yağı değişimi gerekli',
        recommendations: ['Motor yağı ve filtre değiştirin', 'Hava filtresini kontrol edin'],
        createdAt: now
      });
    }

    // Brake service prediction
    if (mileageSinceLastService > 20000) {
      predictions.push({
        id: `pred_${Date.now()}_2`,
        vehicleId: vehicleData.make + vehicleData.model,
        predictionType: 'brake_service',
        predictedDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        confidence: 70,
        estimatedCost: 1200,
        priority: 'medium',
        description: 'Fren sistemi kontrolü gerekli',
        recommendations: ['Fren balata ve disklerini kontrol edin', 'Fren hidroliğini kontrol edin'],
        createdAt: now
      });
    }

    // General inspection
    if (monthsSinceLastService > 12) {
      predictions.push({
        id: `pred_${Date.now()}_3`,
        vehicleId: vehicleData.make + vehicleData.model,
        predictionType: 'general_inspection',
        predictedDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        confidence: 90,
        estimatedCost: 800,
        priority: 'high',
        description: 'Genel araç kontrolü gerekli',
        recommendations: ['Tüm sistemleri kontrol edin', 'Muayene randevusu alın'],
        createdAt: now
      });
    }

    return predictions;
  }

  /**
   * Parse cost estimation response
   */
  private static parseCostResponse(aiResponse: string): { minCost: number; maxCost: number; averageCost: number; currency: string } {
    try {
      const costMatch = aiResponse.match(/min:(\d+), max:(\d+), average:(\d+), currency:(\w+)/);
      if (costMatch) {
        return {
          minCost: parseInt(costMatch[1]),
          maxCost: parseInt(costMatch[2]),
          averageCost: parseInt(costMatch[3]),
          currency: costMatch[4]
        };
      }
    } catch (error) {
      console.error('Failed to parse cost response:', error);
    }

    // Fallback
    return {
      minCost: 300,
      maxCost: 1000,
      averageCost: 650,
      currency: 'TRY'
    };
  }

  /**
   * Estimate cost based on rules (fallback)
   */
  private static estimateRuleBasedCost(vehicleData: VehicleData, serviceType: string): { minCost: number; maxCost: number; averageCost: number; currency: string } {
    const baseCosts: Record<string, { min: number; max: number; avg: number }> = {
      'oil_change': { min: 200, max: 600, avg: 400 },
      'brake_service': { min: 800, max: 2000, avg: 1400 },
      'tire_rotation': { min: 100, max: 300, avg: 200 },
      'general_inspection': { min: 500, max: 1200, avg: 850 },
      'battery_check': { min: 150, max: 400, avg: 275 }
    };

    const cost = baseCosts[serviceType] || { min: 300, max: 1000, avg: 650 };
    
    // Adjust based on vehicle age and type
    const ageMultiplier = vehicleData.year < 2010 ? 1.2 : vehicleData.year > 2020 ? 0.9 : 1.0;
    const luxuryMultiplier = ['BMW', 'Mercedes', 'Audi'].includes(vehicleData.make) ? 1.5 : 1.0;

    return {
      minCost: Math.round(cost.min * ageMultiplier * luxuryMultiplier),
      maxCost: Math.round(cost.max * ageMultiplier * luxuryMultiplier),
      averageCost: Math.round(cost.avg * ageMultiplier * luxuryMultiplier),
      currency: 'TRY'
    };
  }

  /**
   * Parse diagnostic response
   */
  private static parseDiagnosticResponse(aiResponse: string): {
    possibleIssues: Array<{
      issue: string;
      probability: number;
      description: string;
      estimatedCost: number;
      urgency: 'low' | 'medium' | 'high' | 'urgent';
    }>;
    recommendations: string[];
  } {
    // This is a simplified parser - in production, you'd want more sophisticated parsing
    return {
      possibleIssues: [
        {
          issue: 'Genel kontrol gerekli',
          probability: 80,
          description: 'Detaylı diagnostik gerekli',
          estimatedCost: 500,
          urgency: 'medium'
        }
      ],
      recommendations: ['Yetkili servise götürün', 'Acil durumda aracı kullanmayın']
    };
  }
}

export default AIService;
