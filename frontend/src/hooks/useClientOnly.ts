"use client";
import { useEffect, useState } from 'react';

/**
 * Client-side rendering kontrolü için hook
 * Hydration sorunlarını önler
 */
export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

/**
 * Client-side'da çalışacak component'lar için güvenli render hook'u
 */
export function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      return effect();
    }
  }, [hasMounted, effect, deps]);
}

/**
 * Browser environment kontrolü
 */
export function useIsBrowser() {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
  }, []);

  return isBrowser;
}
