import React from 'react';
import { TenantProvider } from '../../../contexts/TenantContext';
import TenantLayout from '../../../components/tenant/TenantLayout';

export default function TenantLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantProvider>
      <TenantLayout>
        {children}
      </TenantLayout>
    </TenantProvider>
  );
}
