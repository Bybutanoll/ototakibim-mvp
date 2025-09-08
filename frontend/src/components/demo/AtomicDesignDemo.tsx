import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Badge, 
  Icon, 
  Avatar, 
  LoadingSpinner, 
  Card 
} from '../atoms';
import { 
  StatsCard, 
  UserCard, 
  DataTable 
} from '../molecules';
import { 
  Header, 
  Sidebar 
} from '../organisms';
import { 
  DashboardLayout, 
  AuthLayout 
} from '../templates';
import { 
  Users, 
  Wrench, 
  Car, 
  TrendingUp,
  Plus,
  Search
} from 'lucide-react';

const AtomicDesignDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'atoms' | 'molecules' | 'organisms' | 'templates'>('atoms');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mockUsers = [
    {
      _id: '1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      tenantRole: 'owner' as const,
      isActive: true,
      lastLogin: '2024-01-20T14:30:00Z'
    },
    {
      _id: '2',
      firstName: 'Ayşe',
      lastName: 'Demir',
      email: 'ayse@example.com',
      phone: '+90 555 234 5678',
      tenantRole: 'manager' as const,
      isActive: true,
      lastLogin: '2024-01-20T13:15:00Z'
    }
  ];

  const tableColumns = [
    {
      key: 'name',
      title: 'Ad Soyad',
      render: (value: any, item: any) => `${item.firstName} ${item.lastName}`
    },
    {
      key: 'email',
      title: 'Email',
      render: (value: any) => value
    },
    {
      key: 'role',
      title: 'Rol',
      render: (value: any) => (
        <Badge 
          text={value === 'owner' ? 'İşletme Sahibi' : 'Yönetici'} 
          color="secondary" 
        />
      )
    }
  ];

  const renderAtoms = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Atoms - Temel UI Elementleri</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h4 className="font-medium mb-4">Buttons</h4>
          <div className="space-y-2">
            <Button variant="primary" size="sm">Primary Small</Button>
            <Button variant="secondary" size="md">Secondary Medium</Button>
            <Button variant="outline" size="lg">Outline Large</Button>
          </div>
        </Card>

        <Card>
          <h4 className="font-medium mb-4">Inputs</h4>
          <div className="space-y-2">
            <Input placeholder="Normal input" />
            <Input placeholder="Disabled input" disabled />
            <Input placeholder="Error input" error="Bu alan gereklidir" />
          </div>
        </Card>

        <Card>
          <h4 className="font-medium mb-4">Badges</h4>
          <div className="space-y-2">
            <Badge text="Success" color="success" />
            <Badge text="Warning" color="warning" />
            <Badge text="Error" color="error" />
            <Badge text="Info" color="primary" />
          </div>
        </Card>

        <Card>
          <h4 className="font-medium mb-4">Icons & Avatars</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon icon={Users} size="sm" color="primary" />
              <Icon icon={Wrench} size="md" color="success" />
              <Icon icon={Car} size="lg" color="warning" />
            </div>
            <div className="flex items-center space-x-2">
              <Avatar name="Ahmet Yılmaz" size="sm" />
              <Avatar name="Ayşe Demir" size="md" status="online" />
              <Avatar name="Mehmet Kaya" size="lg" status="offline" />
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="font-medium mb-4">Loading States</h4>
          <div className="space-y-2">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" text="Yükleniyor..." />
            <LoadingSpinner size="lg" color="success" />
          </div>
        </Card>

        <Card>
          <h4 className="font-medium mb-4">Cards</h4>
          <div className="space-y-2">
            <Card padding="sm">Small padding card</Card>
            <Card padding="md" shadow="md">Medium padding with shadow</Card>
            <Card padding="lg" hover>Large padding with hover</Card>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMolecules = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Molecules - Atom Kombinasyonları</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-4">Stats Cards</h4>
          <div className="space-y-4">
            <StatsCard
              title="Toplam İş Emri"
              value="24"
              icon={Wrench}
              color="blue"
              change={{ value: '+12%', type: 'positive' }}
            />
            <StatsCard
              title="Aktif Araç"
              value="156"
              icon={Car}
              color="green"
              change={{ value: '+8%', type: 'positive' }}
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">User Cards</h4>
          <div className="space-y-4">
            {mockUsers.map(user => (
              <UserCard
                key={user._id}
                user={user}
                onEdit={(id) => console.log('Edit user:', id)}
                onDelete={(id) => console.log('Delete user:', id)}
                onToggleStatus={(id, status) => console.log('Toggle status:', id, status)}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-medium mb-4">Data Table</h4>
          <DataTable
            data={mockUsers}
            columns={tableColumns}
            emptyMessage="Kullanıcı bulunamadı"
          />
        </div>
      </div>
    </div>
  );

  const renderOrganisms = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Organisms - Molekül Kombinasyonları</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-4">Header Component</h4>
          <div className="border rounded-lg overflow-hidden">
            <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} showMenuButton />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Sidebar Component</h4>
          <div className="border rounded-lg overflow-hidden h-96">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Templates - Sayfa Layout'ları</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-4">Dashboard Layout</h4>
          <div className="border rounded-lg overflow-hidden h-96">
            <DashboardLayout>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Dashboard Content</h2>
                <p>Bu bir dashboard layout örneğidir.</p>
              </div>
            </DashboardLayout>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Auth Layout</h4>
          <div className="border rounded-lg overflow-hidden h-96">
            <AuthLayout>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center">Giriş Yap</h2>
                <Input placeholder="Email" type="email" />
                <Input placeholder="Şifre" type="password" />
                <Button variant="primary" className="w-full">Giriş Yap</Button>
              </div>
            </AuthLayout>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Atomic Design Pattern Demo
        </h1>
        <p className="text-gray-600">
          Component hierarchy'sinin nasıl çalıştığını gösteren interaktif demo
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'atoms', label: 'Atoms' },
            { key: 'molecules', label: 'Molecules' },
            { key: 'organisms', label: 'Organisms' },
            { key: 'templates', label: 'Templates' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'atoms' && renderAtoms()}
        {activeTab === 'molecules' && renderMolecules()}
        {activeTab === 'organisms' && renderOrganisms()}
        {activeTab === 'templates' && renderTemplates()}
      </div>

      {/* Benefits */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Atomic Design Pattern'ın Faydaları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">🎯 Consistency</h4>
            <p className="text-blue-700 text-sm">
              Tüm component'ler aynı design system'i kullanır
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">♻️ Reusability</h4>
            <p className="text-blue-700 text-sm">
              Component'ler farklı yerlerde tekrar kullanılabilir
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">🔧 Maintainability</h4>
            <p className="text-blue-700 text-sm">
              Değişiklikler tek yerden yapılır, her yerde etkili olur
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">⚡ Performance</h4>
            <p className="text-blue-700 text-sm">
              Tree-shaking ile sadece kullanılan component'ler bundle'a dahil edilir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtomicDesignDemo;
