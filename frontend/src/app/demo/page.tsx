import Link from 'next/link';
import { WrenchIcon, UserGroupIcon, DocumentTextIcon, ChartBarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <WrenchIcon className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                Oto Tamir Takip
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Demo Giriş
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Sistem <span className="text-blue-600">Demo</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Oto Tamir Takip sisteminin tüm özelliklerini keşfedin. 
              Demo hesabı ile sistemi test edin.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Demo Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h3 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                Demo Hesap Bilgileri
              </h3>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Hemen Test Edin
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Aşağıdaki bilgilerle sisteme giriş yapabilirsiniz.
              </p>
            </div>

            <div className="mt-10">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="text-center">
                  <h4 className="text-lg font-medium text-blue-900 mb-4">
                    Demo Giriş Bilgileri
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">Email:</span> demo@ototamir.com
                    </p>
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">Şifre:</span> 123456
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Demo Giriş Yap
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h3 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                Özellikler
              </h3>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Neler Sunuyoruz
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <DocumentTextIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    İş Emri Yönetimi
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Müşteri taleplerini hızlıca iş emrine dönüştürün, durumlarını takip edin.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Müşteri Yönetimi
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Müşteri bilgilerini, araç geçmişlerini tek yerden yönetin.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <ChartBarIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Raporlama & Analiz
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Günlük, haftalık ve aylık raporlarla performansınızı analiz edin.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <WrenchIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Fatura & Ödeme
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Otomatik fatura oluşturun, ödeme takibi yapın.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Hemen Başlayın</span>
              <span className="block">Demo hesabı ile test edin</span>
            </h3>
            <p className="mt-4 text-lg leading-6 text-blue-200">
              Oto tamir işletmenizi dijitalleştirmek için hiçbir zaman geç değil. 
              Hemen demo hesabı ile sistemi test edin.
            </p>
            <Link
              href="/login"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
            >
              Demo Giriş Yap
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <WrenchIcon className="h-8 w-8 text-blue-400 mx-auto" />
            <p className="mt-4 text-base text-gray-400">
              © 2024 Oto Tamir Takip Sistemi. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
