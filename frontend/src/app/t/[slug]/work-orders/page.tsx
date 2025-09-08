import React from 'react';
import { Card } from '../../../../components/atoms';
import { DataTable } from '../../../../components/molecules';
import SEO from '../../../../components/SEO';

export default function TenantWorkOrdersPage() {
  const mockWorkOrders = [
    {
      _id: '1',
      vehicle: 'Toyota Corolla',
      customer: 'Ahmet Yılmaz',
      status: 'completed',
      date: '2024-01-20',
      total: 2500
    },
    {
      _id: '2',
      vehicle: 'BMW 320i',
      customer: 'Ayşe Demir',
      status: 'pending',
      date: '2024-01-19',
      total: 1800
    },
    {
      _id: '3',
      vehicle: 'Mercedes C200',
      customer: 'Mehmet Kaya',
      status: 'in_progress',
      date: '2024-01-18',
      total: 3200
    }
  ];

  const columns = [
    {
      key: 'vehicle',
      title: 'Araç',
      render: (value: any) => value
    },
    {
      key: 'customer',
      title: 'Müşteri',
      render: (value: any) => value
    },
    {
      key: 'status',
      title: 'Durum',
      render: (value: any) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'completed' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value === 'completed' ? 'Tamamlandı' :
           value === 'pending' ? 'Beklemede' :
           value === 'in_progress' ? 'Devam Ediyor' : value}
        </span>
      )
    },
    {
      key: 'date',
      title: 'Tarih',
      render: (value: any) => new Date(value).toLocaleDateString('tr-TR')
    },
    {
      key: 'total',
      title: 'Toplam',
      render: (value: any) => `₺${value.toLocaleString()}`
    }
  ];

  return (
    <>
      <SEO
        title="İş Emirleri - OtoTakibim"
        description="Araç tamir iş emirleri yönetimi"
        keywords="iş emirleri, araç tamiri, bakım"
      />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">İş Emirleri</h1>
            <p className="text-gray-600">Araç tamir iş emirlerinizi yönetin</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Yeni İş Emri
          </button>
        </div>

        <Card>
          <DataTable
            data={mockWorkOrders}
            columns={columns}
            emptyMessage="İş emri bulunamadı"
          />
        </Card>
      </div>
    </>
  );
}
