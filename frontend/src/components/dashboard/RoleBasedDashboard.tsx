import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { 
  Users, 
  Wrench, 
  Car, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const RoleBasedDashboard: React.FC = () => {
  const { hasPermission, getRoleDisplayName, userRole } = usePermissions();
  const { subscription } = useSubscription();

  // Get dashboard cards based on user role and permissions
  const getDashboardCards = (): DashboardCard[] => {
    const cards: DashboardCard[] = [];

    // Common cards for all roles
    if (hasPermission('workOrders', 'read')) {
      cards.push({
        title: 'Toplam İş Emri',
        value: '24',
        icon: Wrench,
        color: 'blue',
        change: '+12%',
        changeType: 'positive'
      });
    }

    if (hasPermission('vehicles', 'read')) {
      cards.push({
        title: 'Kayıtlı Araç',
        value: '156',
        icon: Car,
        color: 'green',
        change: '+8%',
        changeType: 'positive'
      });
    }

    if (hasPermission('customers', 'read')) {
      cards.push({
        title: 'Aktif Müşteri',
        value: '89',
        icon: Users,
        color: 'purple',
        change: '+15%',
        changeType: 'positive'
      });
    }

    // Role-specific cards
    if (hasPermission('workOrders', 'read')) {
      cards.push({
        title: 'Bekleyen İş Emri',
        value: '7',
        icon: Clock,
        color: 'yellow',
        change: '-3',
        changeType: 'negative'
      });
    }

    if (hasPermission('workOrders', 'read')) {
      cards.push({
        title: 'Tamamlanan İş Emri',
        value: '17',
        icon: CheckCircle,
        color: 'green',
        change: '+5',
        changeType: 'positive'
      });
    }

    // Manager and Owner specific cards
    if (hasPermission('reports', 'read')) {
      cards.push({
        title: 'Aylık Gelir',
        value: '₺45,230',
        icon: DollarSign,
        color: 'emerald',
        change: '+18%',
        changeType: 'positive'
      });
    }

    if (hasPermission('users', 'read')) {
      cards.push({
        title: 'Aktif Kullanıcı',
        value: '12',
        icon: Users,
        color: 'indigo',
        change: '+2',
        changeType: 'positive'
      });
    }

    // Owner specific cards
    if (hasPermission('subscription', 'read')) {
      cards.push({
        title: 'Abonelik Durumu',
        value: subscription?.status === 'active' ? 'Aktif' : 'Deneme',
        icon: CheckCircle,
        color: subscription?.status === 'active' ? 'green' : 'blue',
        change: subscription?.plan || 'Starter'
      });
    }

    return cards;
  };

  const getQuickActions = () => {
    const actions = [];

    if (hasPermission('workOrders', 'create')) {
      actions.push({
        title: 'Yeni İş Emri',
        description: 'Yeni bir iş emri oluştur',
        href: '/dashboard/work-orders/new',
        icon: Wrench,
        color: 'blue'
      });
    }

    if (hasPermission('vehicles', 'create')) {
      actions.push({
        title: 'Araç Ekle',
        description: 'Yeni araç kaydı oluştur',
        href: '/dashboard/vehicles/new',
        icon: Car,
        color: 'green'
      });
    }

    if (hasPermission('customers', 'create')) {
      actions.push({
        title: 'Müşteri Ekle',
        description: 'Yeni müşteri kaydı oluştur',
        href: '/dashboard/customers/new',
        icon: Users,
        color: 'purple'
      });
    }

    if (hasPermission('appointments', 'create')) {
      actions.push({
        title: 'Randevu Oluştur',
        description: 'Yeni randevu planla',
        href: '/dashboard/appointments/new',
        icon: Calendar,
        color: 'orange'
      });
    }

    return actions;
  };

  const getRecentActivity = () => {
    const activities = [
      {
        id: 1,
        type: 'workOrder',
        title: 'Yeni iş emri oluşturuldu',
        description: '34 ABC 123 plakalı araç için iş emri',
        time: '2 saat önce',
        icon: Wrench,
        color: 'blue'
      },
      {
        id: 2,
        type: 'vehicle',
        title: 'Araç kaydı güncellendi',
        description: '12 DEF 456 plakalı araç bilgileri güncellendi',
        time: '4 saat önce',
        icon: Car,
        color: 'green'
      },
      {
        id: 3,
        type: 'customer',
        title: 'Yeni müşteri eklendi',
        description: 'Ahmet Yılmaz müşteri olarak eklendi',
        time: '6 saat önce',
        icon: Users,
        color: 'purple'
      }
    ];

    return activities;
  };

  const cards = getDashboardCards();
  const quickActions = getQuickActions();
  const recentActivity = getRecentActivity();

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      emerald: 'bg-emerald-500 text-white',
      indigo: 'bg-indigo-500 text-white',
      orange: 'bg-orange-500 text-white',
      red: 'bg-red-500 text-white'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getChangeColor = (type?: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Hoş geldiniz, {getRoleDisplayName()}!
        </h1>
        <p className="text-blue-100">
          Bugün {new Date().toLocaleDateString('tr-TR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  {card.change && (
                    <p className={`text-sm ${getChangeColor(card.changeType)}`}>
                      {card.change}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a
                  key={index}
                  href={action.href}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getColorClasses(action.color)} mr-3`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start">
                  <div className={`p-2 rounded-lg ${getColorClasses(activity.color)} mr-3`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Usage Information */}
      {subscription && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kullanım Durumu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {subscription.usage.workOrders}
              </p>
              <p className="text-sm text-gray-600">İş Emri</p>
              <p className="text-xs text-gray-500">
                Limit: {subscription.limits.workOrders === -1 ? 'Sınırsız' : subscription.limits.workOrders}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {subscription.usage.users}
              </p>
              <p className="text-sm text-gray-600">Kullanıcı</p>
              <p className="text-xs text-gray-500">
                Limit: {subscription.limits.users === -1 ? 'Sınırsız' : subscription.limits.users}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {subscription.usage.storage} MB
              </p>
              <p className="text-sm text-gray-600">Depolama</p>
              <p className="text-xs text-gray-500">
                Limit: {subscription.limits.storage === -1 ? 'Sınırsız' : `${subscription.limits.storage} MB`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleBasedDashboard;
