# OtoTakibim Developer Guide

Bu rehber, OtoTakibim uygulamasını geliştirmek ve özelleştirmek isteyen geliştiriciler için hazırlanmıştır.

## 🏗️ Proje Yapısı

```
oto-tamir-mvp/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── tests/              # Backend tests
│   └── docs/               # Backend documentation
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── public/             # Static files
│   └── tests/              # Frontend tests
├── shared/                 # Shared utilities
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

## 🚀 Geliştirme Ortamı Kurulumu

### Gereksinimler
- **Node.js**: 18.0+
- **npm**: 8.0+
- **MongoDB**: 6.0+
- **Redis**: 7.0+
- **Git**: 2.30+

### Kurulum Adımları

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/your-username/ototakibim.git
cd ototakibim
```

2. **Backend bağımlılıklarını yükleyin:**
```bash
cd backend
npm install
```

3. **Frontend bağımlılıklarını yükleyin:**
```bash
cd ../frontend
npm install
```

4. **Environment dosyalarını oluşturun:**
```bash
# Backend
cp .env.example .env.development

# Frontend
cp .env.example .env.local
```

5. **Veritabanlarını başlatın:**
```bash
# MongoDB
mongod

# Redis
redis-server
```

6. **Uygulamaları başlatın:**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 🏛️ Mimari

### Backend Mimarisi
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   API Gateway   │    │   Services      │
│   (Frontend)    │◄──►│   (Express)     │◄──►│   (Business)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Middleware    │    │   Database      │
                       │   (Auth, Rate)  │    │   (MongoDB)     │
                       └─────────────────┘    └─────────────────┘
```

### Frontend Mimarisi
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Pages         │    │   Components    │    │   Services      │
│   (Next.js)     │◄──►│   (React)       │◄──►│   (API Calls)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Contexts      │    │   Utils         │
                       │   (State Mgmt)  │    │   (Helpers)     │
                       └─────────────────┘    └─────────────────┘
```

## 🗄️ Veritabanı Tasarımı

### Ana Modeller

#### User Model
```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  tenantId: ObjectId;
  role: 'owner' | 'manager' | 'technician';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Tenant Model
```typescript
interface ITenant {
  _id: ObjectId;
  name: string;
  slug: string;
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
  createdAt: Date;
  updatedAt: Date;
}
```

#### Vehicle Model
```typescript
interface IVehicle {
  _id: ObjectId;
  tenantId: ObjectId;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  vin?: string;
  color?: string;
  fuelType?: string;
  engineSize?: string;
  mileage?: number;
  customerId: ObjectId;
  status: 'active' | 'maintenance' | 'sold';
  createdAt: Date;
  updatedAt: Date;
}
```

#### WorkOrder Model
```typescript
interface IWorkOrder {
  _id: ObjectId;
  tenantId: ObjectId;
  orderNumber: string;
  vehicleId: ObjectId;
  customerId: ObjectId;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  actualCost?: number;
  assignedTo?: ObjectId;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### İndeksler
```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ tenantId: 1 });

// Vehicle indexes
db.vehicles.createIndex({ tenantId: 1, plateNumber: 1 });
db.vehicles.createIndex({ tenantId: 1, customerId: 1 });

// WorkOrder indexes
db.workorders.createIndex({ tenantId: 1, createdAt: -1 });
db.workorders.createIndex({ tenantId: 1, status: 1 });
db.workorders.createIndex({ tenantId: 1, vehicleId: 1 });
```

## 🔧 API Geliştirme

### Yeni Endpoint Ekleme

1. **Route oluşturun:**
```typescript
// src/routes/example.ts
import express from 'express';
import { exampleController } from '../controllers/exampleController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

router.get('/',
  authenticateToken,
  exampleController.getExamples
);

router.post('/',
  authenticateToken,
  validateRequest,
  exampleController.createExample
);

export default router;
```

2. **Controller oluşturun:**
```typescript
// src/controllers/exampleController.ts
import { Request, Response } from 'express';
import { exampleService } from '../services/exampleService';

export class ExampleController {
  async getExamples(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const examples = await exampleService.getExamples(tenantId);
      
      res.json({
        status: 'success',
        data: examples
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  }

  async createExample(req: Request, res: Response) {
    try {
      const tenantId = (req as any).user.tenantId;
      const exampleData = req.body;
      
      const example = await exampleService.createExample(tenantId, exampleData);
      
      res.status(201).json({
        status: 'success',
        message: 'Örnek başarıyla oluşturuldu',
        data: example
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    }
  }
}

export const exampleController = new ExampleController();
```

3. **Service oluşturun:**
```typescript
// src/services/exampleService.ts
import { Example } from '../models/Example';

export class ExampleService {
  async getExamples(tenantId: string) {
    return await Example.find({ tenantId });
  }

  async createExample(tenantId: string, data: any) {
    const example = new Example({
      ...data,
      tenantId
    });
    
    return await example.save();
  }
}

export const exampleService = new ExampleService();
```

4. **Model oluşturun:**
```typescript
// src/models/Example.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IExample extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const exampleSchema = new Schema<IExample>({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const Example = mongoose.model<IExample>('Example', exampleSchema);
```

5. **Route'u app.ts'e ekleyin:**
```typescript
// src/app.ts
import exampleRoutes from './routes/example';

app.use('/api/examples', exampleRoutes);
```

## 🎨 Frontend Geliştirme

### Yeni Component Ekleme

1. **Component oluşturun:**
```typescript
// src/components/example/ExampleCard.tsx
'use client';

import React from 'react';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface ExampleCardProps {
  example: {
    id: string;
    name: string;
    description?: string;
    status: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({
  example,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{example.name}</h3>
        <Badge variant="outline">{example.status}</Badge>
      </div>
      
      {example.description && (
        <p className="text-gray-600 mb-4">{example.description}</p>
      )}
      
      <div className="flex space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(example.id)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Düzenle
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(example.id)}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Sil
          </button>
        )}
      </div>
    </Card>
  );
};
```

2. **Page oluşturun:**
```typescript
// src/app/dashboard/examples/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { ExampleCard } from '@/components/example/ExampleCard';
import { exampleService } from '@/services/exampleService';

export default function ExamplesPage() {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamples();
  }, []);

  const loadExamples = async () => {
    try {
      setLoading(true);
      const data = await exampleService.getExamples();
      setExamples(data);
    } catch (error) {
      console.error('Örnekler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    // Edit logic
  };

  const handleDelete = async (id: string) => {
    try {
      await exampleService.deleteExample(id);
      loadExamples();
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Örnekler</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Yeni Örnek
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Yükleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example) => (
              <ExampleCard
                key={example.id}
                example={example}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
```

3. **Service oluşturun:**
```typescript
// src/services/exampleService.ts
import { apiClient } from './apiClient';

export interface Example {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

class ExampleService {
  private baseUrl = '/api/examples';

  async getExamples(): Promise<Example[]> {
    const response = await apiClient.get(this.baseUrl);
    return response.data;
  }

  async getExample(id: string): Promise<Example> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createExample(data: Partial<Example>): Promise<Example> {
    const response = await apiClient.post(this.baseUrl, data);
    return response.data;
  }

  async updateExample(id: string, data: Partial<Example>): Promise<Example> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteExample(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const exampleService = new ExampleService();
```

## 🧪 Test Geliştirme

### Backend Testleri

1. **Unit Test:**
```typescript
// tests/services/exampleService.test.ts
import { exampleService } from '../../src/services/exampleService';
import { Example } from '../../src/models/Example';

jest.mock('../../src/models/Example');

describe('ExampleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExamples', () => {
    it('should return examples for a tenant', async () => {
      const mockExamples = [
        { _id: '1', name: 'Example 1', tenantId: 'tenant1' },
        { _id: '2', name: 'Example 2', tenantId: 'tenant1' }
      ];

      (Example.find as jest.Mock).mockResolvedValue(mockExamples);

      const result = await exampleService.getExamples('tenant1');

      expect(Example.find).toHaveBeenCalledWith({ tenantId: 'tenant1' });
      expect(result).toEqual(mockExamples);
    });
  });

  describe('createExample', () => {
    it('should create a new example', async () => {
      const mockExample = { _id: '1', name: 'New Example', tenantId: 'tenant1' };
      const mockSave = jest.fn().mockResolvedValue(mockExample);

      (Example as any).mockImplementation(() => ({
        save: mockSave
      }));

      const result = await exampleService.createExample('tenant1', {
        name: 'New Example'
      });

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockExample);
    });
  });
});
```

2. **Integration Test:**
```typescript
// tests/routes/example.test.ts
import request from 'supertest';
import app from '../../src/app';
import { generateToken } from '../utils/auth';

describe('Example Routes', () => {
  let token: string;

  beforeAll(async () => {
    token = await generateToken('test-tenant-id');
  });

  describe('GET /api/examples', () => {
    it('should return examples for authenticated user', async () => {
      const response = await request(app)
        .get('/api/examples')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 for unauthenticated user', async () => {
      await request(app)
        .get('/api/examples')
        .expect(401);
    });
  });

  describe('POST /api/examples', () => {
    it('should create a new example', async () => {
      const exampleData = {
        name: 'Test Example',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/examples')
        .set('Authorization', `Bearer ${token}`)
        .send(exampleData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(exampleData.name);
    });
  });
});
```

### Frontend Testleri

1. **Component Test:**
```typescript
// tests/components/ExampleCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleCard } from '@/components/example/ExampleCard';

const mockExample = {
  id: '1',
  name: 'Test Example',
  description: 'Test Description',
  status: 'active'
};

describe('ExampleCard', () => {
  it('renders example information', () => {
    render(<ExampleCard example={mockExample} />);
    
    expect(screen.getByText('Test Example')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<ExampleCard example={mockExample} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('Düzenle'));
    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    render(<ExampleCard example={mockExample} onDelete={mockOnDelete} />);
    
    fireEvent.click(screen.getByText('Sil'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});
```

2. **Service Test:**
```typescript
// tests/services/exampleService.test.ts
import { exampleService } from '@/services/exampleService';
import { apiClient } from '@/services/apiClient';

jest.mock('@/services/apiClient');

describe('ExampleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExamples', () => {
    it('should fetch examples from API', async () => {
      const mockExamples = [
        { id: '1', name: 'Example 1' },
        { id: '2', name: 'Example 2' }
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({
        data: mockExamples
      });

      const result = await exampleService.getExamples();

      expect(apiClient.get).toHaveBeenCalledWith('/api/examples');
      expect(result).toEqual(mockExamples);
    });
  });

  describe('createExample', () => {
    it('should create example via API', async () => {
      const exampleData = { name: 'New Example' };
      const mockResponse = { id: '1', ...exampleData };

      (apiClient.post as jest.Mock).mockResolvedValue({
        data: mockResponse
      });

      const result = await exampleService.createExample(exampleData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/examples', exampleData);
      expect(result).toEqual(mockResponse);
    });
  });
});
```

## 🔧 Geliştirme Araçları

### Code Quality
```json
// .eslintrc.js
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### Git Hooks
```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run lint
npm run test
npm run build
```

## 📦 Build ve Deployment

### Development Build
```bash
# Backend
cd backend
npm run build
npm run dev

# Frontend
cd frontend
npm run build
npm run dev
```

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Docker Build
```bash
# Backend
docker build -f backend/Dockerfile.production -t ototakibim-backend .

# Frontend
docker build -f frontend/Dockerfile.production -t ototakibim-frontend .
```

## 🐛 Debugging

### Backend Debugging
```typescript
// Debug middleware
const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  next();
};

// Error handling
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});
```

### Frontend Debugging
```typescript
// Debug hook
const useDebug = (value: any, label?: string) => {
  useEffect(() => {
    console.log(label || 'Debug:', value);
  }, [value, label]);
};

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Bir hata oluştu.</h1>;
    }

    return this.props.children;
  }
}
```

## 📚 Kaynaklar

### Dokümantasyon
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [MongoDB Docs](https://docs.mongodb.com)
- [Express.js Docs](https://expressjs.com)

### Araçlar
- [TypeScript](https://www.typescriptlang.org)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Jest](https://jestjs.io)

### Kütüphaneler
- [Mongoose](https://mongoosejs.com)
- [Axios](https://axios-http.com)
- [React Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)

---

**Not**: Bu rehber sürekli güncellenmektedir. En güncel versiyon için GitHub repository'sini kontrol edin.
