'use client';

import React from 'react';
import DashboardLayout from '../../components/templates/DashboardLayout';
import RoleBasedDashboard from '../../components/dashboard/RoleBasedDashboard';
import SEO from '../../components/SEO';

const DashboardPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Dashboard - OtoTakibim"
        description="Araç tamir takip sistemi dashboard"
        keywords="dashboard, araç takibi, iş emirleri"
      />
      
      <DashboardLayout>
        <RoleBasedDashboard />
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
