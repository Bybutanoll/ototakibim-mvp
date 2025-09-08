import { apiClient } from './apiClient';

export interface Tenant {
  _id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  description?: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  location: {
    country: string;
    city: string;
    address?: string;
  };
  contact: {
    email: string;
    phone?: string;
    website?: string;
  };
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'cancelled' | 'suspended' | 'trial';
    expiresAt: Date;
    limits: {
      workOrders: number;
      users: number;
      storage: number;
      apiCalls: number;
    };
    features: string[];
  };
  usage: {
    workOrders: number;
    users: number;
    storage: number;
    apiCalls: number;
    lastReset: Date;
  };
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  _id: string;
  tenantId: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    favicon?: string;
    customDomain?: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    workOrderUpdates: boolean;
    appointmentReminders: boolean;
    maintenanceAlerts: boolean;
  };
  business: {
    workingHours: {
      monday: { start: string; end: string; isOpen: boolean };
      tuesday: { start: string; end: string; isOpen: boolean };
      wednesday: { start: string; end: string; isOpen: boolean };
      thursday: { start: string; end: string; isOpen: boolean };
      friday: { start: string; end: string; isOpen: boolean };
      saturday: { start: string; end: string; isOpen: boolean };
      sunday: { start: string; end: string; isOpen: boolean };
    };
    timezone: string;
    currency: string;
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
  integrations: {
    sms: {
      provider: 'netgsm' | 'iletimerkezi' | 'verimor';
      apiKey?: string;
      sender?: string;
    };
    email: {
      provider: 'smtp' | 'sendgrid' | 'mailgun';
      smtpHost?: string;
      smtpPort?: number;
      smtpUser?: string;
      smtpPass?: string;
    };
    payment: {
      provider: 'stripe' | 'paypal' | 'iyzico';
      apiKey?: string;
      webhookSecret?: string;
    };
  };
  features: {
    aiDiagnostics: boolean;
    predictiveMaintenance: boolean;
    inventoryManagement: boolean;
    customerPortal: boolean;
    mobileApp: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantData {
  name: string;
  slug: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  location: {
    country: string;
    city: string;
    address?: string;
  };
  contact: {
    email: string;
    phone?: string;
    website?: string;
  };
}

export interface UpdateTenantData {
  name?: string;
  description?: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  location?: {
    country?: string;
    city?: string;
    address?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

class TenantService {
  private baseUrl = '/api/tenants';

  async getTenant(tenantId: string): Promise<Tenant> {
    const response = await apiClient.get(`${this.baseUrl}/${tenantId}`);
    return response.data;
  }

  async getTenantBySlug(slug: string): Promise<Tenant> {
    const response = await apiClient.get(`${this.baseUrl}/slug/${slug}`);
    return response.data;
  }

  async getTenantSettings(tenantId: string): Promise<TenantSettings> {
    const response = await apiClient.get(`${this.baseUrl}/${tenantId}/settings`);
    return response.data;
  }

  async updateTenant(tenantId: string, data: UpdateTenantData): Promise<Tenant> {
    const response = await apiClient.put(`${this.baseUrl}/${tenantId}`, data);
    return response.data;
  }

  async updateTenantSettings(tenantId: string, settings: Partial<TenantSettings>): Promise<TenantSettings> {
    const response = await apiClient.put(`${this.baseUrl}/${tenantId}/settings`, settings);
    return response.data;
  }

  async createTenant(data: CreateTenantData): Promise<Tenant> {
    const response = await apiClient.post(this.baseUrl, data);
    return response.data;
  }

  async deleteTenant(tenantId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${tenantId}`);
  }

  async getTenantUsage(tenantId: string): Promise<{
    workOrders: number;
    users: number;
    storage: number;
    apiCalls: number;
    limits: {
      workOrders: number;
      users: number;
      storage: number;
      apiCalls: number;
    };
    resetDate: Date;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/${tenantId}/usage`);
    return response.data;
  }

  async resetTenantUsage(tenantId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${tenantId}/usage/reset`);
  }

  async getTenantAnalytics(tenantId: string, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    workOrders: {
      total: number;
      completed: number;
      pending: number;
      cancelled: number;
    };
    revenue: {
      total: number;
      average: number;
      growth: number;
    };
    customers: {
      total: number;
      new: number;
      active: number;
    };
    vehicles: {
      total: number;
      active: number;
      maintenance: number;
    };
  }> {
    const response = await apiClient.get(`${this.baseUrl}/${tenantId}/analytics?period=${period}`);
    return response.data;
  }

  async uploadTenantLogo(tenantId: string, file: File): Promise<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post(`${this.baseUrl}/${tenantId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async deleteTenantLogo(tenantId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${tenantId}/logo`);
  }

  async getTenantDomains(tenantId: string): Promise<{
    customDomains: string[];
    defaultDomain: string;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/${tenantId}/domains`);
    return response.data;
  }

  async addCustomDomain(tenantId: string, domain: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${tenantId}/domains`, { domain });
  }

  async removeCustomDomain(tenantId: string, domain: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${tenantId}/domains/${domain}`);
  }

  async verifyCustomDomain(tenantId: string, domain: string): Promise<{
    verified: boolean;
    dnsRecords: Array<{
      type: string;
      name: string;
      value: string;
      status: 'pending' | 'verified' | 'failed';
    }>;
  }> {
    const response = await apiClient.post(`${this.baseUrl}/${tenantId}/domains/${domain}/verify`);
    return response.data;
  }
}

export const tenantService = new TenantService();
