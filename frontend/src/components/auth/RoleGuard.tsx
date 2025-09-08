import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, Lock } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  showError?: boolean;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback,
  showError = true
}) => {
  const { user } = useAuth();

  if (!user) {
    return showError ? (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Giriş Gerekli
          </h3>
          <p className="text-gray-600">
            Bu içeriği görüntülemek için giriş yapmanız gerekiyor.
          </p>
        </div>
      </div>
    ) : null;
  }

  const userRole = user.tenantRole || user.globalRole;
  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showError) {
      return null;
    }

    return (
      <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Yetki Yetersiz
          </h3>
          <p className="text-red-700 mb-4">
            Bu içeriği görüntülemek için <strong>{allowedRoles.join(' veya ')}</strong> yetkisine sahip olmanız gerekiyor.
          </p>
          <div className="text-sm text-red-600">
            <p>Mevcut rolünüz: <strong>{userRole}</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
