"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

// Dynamic imports burada yapılacak (client-side)
const OfflineIndicator = dynamic(() => import('./OfflineIndicator'), {
  ssr: false,
  loading: () => null
});

// MobileLayout'u basit import ile değiştir
import MobileLayout from './MobileLayout';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <OfflineIndicator />
      </Suspense>
      <MobileLayout>
        {children}
      </MobileLayout>
    </ErrorBoundary>
  );
}
