"use client";
import { useClientOnly } from '@/hooks/useClientOnly';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client-side'da çalışacak component'lar için wrapper
 * Hydration sorunlarını önler
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const hasMounted = useClientOnly();

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
