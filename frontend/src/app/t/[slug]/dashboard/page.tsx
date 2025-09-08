import React from 'react';
import TenantDashboard from '../../../../components/tenant/TenantDashboard';
import SEO from '../../../../components/SEO';

export default function TenantDashboardPage() {
  return (
    <>
      <SEO
        title="Dashboard - OtoTakibim"
        description="Araç tamir takip sistemi dashboard"
        keywords="dashboard, araç takibi, iş emirleri"
      />
      <TenantDashboard />
    </>
  );
}
