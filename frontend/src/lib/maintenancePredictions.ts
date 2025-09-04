// Maintenance Prediction Service
// Basic rule-based predictions for maintenance scheduling

export interface MaintenancePrediction {
  type: 'oil_change' | 'brake_service' | 'tire_rotation' | 'air_filter' | 'timing_belt' | 'battery_check' | 'general_inspection';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  estimatedDuration: number; // in hours
  dueDate: Date;
  dueMileage: number;
  currentMileage: number;
  daysUntilDue: number;
  kmUntilDue: number;
  confidence: number; // 0-100
}

export interface VehicleData {
  currentMileage: number;
  lastMaintenanceDate: Date;
  lastMaintenanceMileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'lpg';
  year: number;
  brand: string;
  model: string;
}

export interface MaintenanceHistory {
  date: Date;
  type: 'service' | 'repair' | 'inspection';
  description: string;
  cost: number;
  mileage: number;
  workshop?: string;
}

// Maintenance intervals based on Turkish market standards
const MAINTENANCE_INTERVALS = {
  oil_change: {
    gasoline: { km: 10000, months: 6 },
    diesel: { km: 10000, months: 6 },
    electric: { km: 20000, months: 12 },
    hybrid: { km: 15000, months: 8 },
    lpg: { km: 8000, months: 4 }
  },
  brake_service: {
    km: 30000,
    months: 24
  },
  tire_rotation: {
    km: 10000,
    months: 6
  },
  air_filter: {
    km: 20000,
    months: 12
  },
  timing_belt: {
    km: 100000,
    months: 60
  },
  battery_check: {
    km: 50000,
    months: 24
  },
  general_inspection: {
    km: 15000,
    months: 12
  }
};

// Cost estimates in Turkish Lira (2024)
const COST_ESTIMATES = {
  oil_change: {
    gasoline: 800,
    diesel: 900,
    electric: 1200,
    hybrid: 1000,
    lpg: 700
  },
  brake_service: 2500,
  tire_rotation: 300,
  air_filter: 400,
  timing_belt: 8000,
  battery_check: 500,
  general_inspection: 1500
};

// Duration estimates in hours
const DURATION_ESTIMATES = {
  oil_change: 1,
  brake_service: 3,
  tire_rotation: 0.5,
  air_filter: 0.5,
  timing_belt: 6,
  battery_check: 0.5,
  general_inspection: 2
};

export function generateMaintenancePredictions(
  vehicle: VehicleData,
  maintenanceHistory: MaintenanceHistory[]
): MaintenancePrediction[] {
  const predictions: MaintenancePrediction[] = [];
  const now = new Date();
  
  // Sort maintenance history by date (most recent first)
  const sortedHistory = maintenanceHistory.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Find last maintenance of each type
  const lastMaintenance = {
    oil_change: sortedHistory.find(h => 
      h.description.toLowerCase().includes('yağ') || 
      h.description.toLowerCase().includes('oil') ||
      h.type === 'service'
    ),
    brake_service: sortedHistory.find(h => 
      h.description.toLowerCase().includes('fren') || 
      h.description.toLowerCase().includes('brake')
    ),
    tire_rotation: sortedHistory.find(h => 
      h.description.toLowerCase().includes('lastik') || 
      h.description.toLowerCase().includes('tire')
    ),
    air_filter: sortedHistory.find(h => 
      h.description.toLowerCase().includes('hava filtresi') || 
      h.description.toLowerCase().includes('air filter')
    ),
    timing_belt: sortedHistory.find(h => 
      h.description.toLowerCase().includes('distribütör') || 
      h.description.toLowerCase().includes('timing belt')
    ),
    battery_check: sortedHistory.find(h => 
      h.description.toLowerCase().includes('akü') || 
      h.description.toLowerCase().includes('battery')
    ),
    general_inspection: sortedHistory.find(h => 
      h.description.toLowerCase().includes('genel kontrol') || 
      h.description.toLowerCase().includes('inspection')
    )
  };

  // Generate predictions for each maintenance type
  Object.entries(MAINTENANCE_INTERVALS).forEach(([type, intervals]) => {
    const lastService = lastMaintenance[type as keyof typeof lastMaintenance];
    const fuelType = vehicle.fuelType;
    
    // Calculate due date and mileage
    let dueDate: Date;
    let dueMileage: number;
    
    if (lastService) {
      // Calculate based on last service
      const lastServiceDate = new Date(lastService.date);
      const lastServiceMileage = lastService.mileage;
      
      // Use fuel-specific intervals for oil change
      const interval = type === 'oil_change' ? intervals[fuelType] : intervals;
      
      dueDate = new Date(lastServiceDate);
      dueDate.setMonth(dueDate.getMonth() + interval.months);
      
      dueMileage = lastServiceMileage + interval.km;
    } else {
      // No previous service, estimate based on vehicle age
      const vehicleAge = now.getFullYear() - vehicle.year;
      const estimatedYearlyMileage = vehicleAge > 0 ? vehicle.currentMileage / vehicleAge : 15000;
      
      const interval = type === 'oil_change' ? intervals[fuelType] : intervals;
      
      dueDate = new Date(now);
      dueDate.setMonth(dueDate.getMonth() + interval.months);
      
      dueMileage = vehicle.currentMileage + interval.km;
    }
    
    // Calculate days and km until due
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const kmUntilDue = dueMileage - vehicle.currentMileage;
    
    // Determine priority
    let priority: 'low' | 'medium' | 'high' | 'urgent';
    if (daysUntilDue <= 7 || kmUntilDue <= 1000) {
      priority = 'urgent';
    } else if (daysUntilDue <= 30 || kmUntilDue <= 5000) {
      priority = 'high';
    } else if (daysUntilDue <= 90 || kmUntilDue <= 10000) {
      priority = 'medium';
    } else {
      priority = 'low';
    }
    
    // Calculate confidence based on data quality
    let confidence = 70; // Base confidence
    if (lastService) confidence += 20;
    if (maintenanceHistory.length > 3) confidence += 10;
    confidence = Math.min(confidence, 95);
    
    // Get cost estimate
    let estimatedCost: number;
    if (type === 'oil_change') {
      estimatedCost = COST_ESTIMATES[type][fuelType];
    } else {
      estimatedCost = COST_ESTIMATES[type as keyof typeof COST_ESTIMATES];
    }
    
    // Adjust cost based on vehicle age and brand
    if (vehicle.year < 2015) estimatedCost *= 0.8; // Older cars might be cheaper
    if (['BMW', 'Mercedes', 'Audi'].includes(vehicle.brand)) estimatedCost *= 1.3; // Premium brands
    
    const prediction: MaintenancePrediction = {
      type: type as any,
      title: getMaintenanceTitle(type),
      description: getMaintenanceDescription(type, vehicle),
      priority,
      estimatedCost: Math.round(estimatedCost),
      estimatedDuration: DURATION_ESTIMATES[type as keyof typeof DURATION_ESTIMATES],
      dueDate,
      dueMileage,
      currentMileage: vehicle.currentMileage,
      daysUntilDue,
      kmUntilDue,
      confidence
    };
    
    predictions.push(prediction);
  });
  
  // Sort by priority and due date
  return predictions.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.daysUntilDue - b.daysUntilDue;
  });
}

function getMaintenanceTitle(type: string): string {
  const titles = {
    oil_change: 'Yağ Değişimi',
    brake_service: 'Fren Servisi',
    tire_rotation: 'Lastik Rotasyonu',
    air_filter: 'Hava Filtresi Değişimi',
    timing_belt: 'Distribütör Kayışı',
    battery_check: 'Akü Kontrolü',
    general_inspection: 'Genel Kontrol'
  };
  return titles[type as keyof typeof titles] || type;
}

function getMaintenanceDescription(type: string, vehicle: VehicleData): string {
  const descriptions = {
    oil_change: `${vehicle.brand} ${vehicle.model} için motor yağı değişimi gerekiyor. Düzenli yağ değişimi motor ömrünü uzatır.`,
    brake_service: 'Fren sistemi kontrolü ve gerekirse fren balata değişimi yapılmalı. Güvenlik için kritik önem taşır.',
    tire_rotation: 'Lastik rotasyonu yaparak lastik aşınmasını eşit dağıtın. Bu işlem lastik ömrünü uzatır.',
    air_filter: 'Hava filtresi değişimi motor performansını artırır ve yakıt tüketimini azaltır.',
    timing_belt: 'Distribütör kayışı değişimi kritik önem taşır. Kopması durumunda motor hasarı oluşabilir.',
    battery_check: 'Akü durumu kontrol edilmeli. Kış aylarında akü sorunları daha sık yaşanır.',
    general_inspection: 'Genel araç kontrolü yapılarak potansiyel sorunlar erken tespit edilir.'
  };
  return descriptions[type as keyof typeof descriptions] || 'Bakım gerekiyor.';
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'urgent': return 'Acil';
    case 'high': return 'Yüksek';
    case 'medium': return 'Orta';
    case 'low': return 'Düşük';
    default: return priority;
  }
}
