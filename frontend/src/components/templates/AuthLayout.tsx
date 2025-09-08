import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '../atoms/LoadingSpinner';

export interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  className = ''
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Yükleniyor..." />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">OT</span>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          OtoTakibim
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          AI Destekli Araç Sağlık Asistanı
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 ${className}`}>
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2024 OtoTakibim. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
