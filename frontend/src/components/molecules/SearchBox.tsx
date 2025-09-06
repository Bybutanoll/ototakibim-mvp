'use client';

import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

export interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Ara...',
  onSearch,
  onClear,
  debounceMs = 300,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);

    setDebounceTimer(timer);
  }, [onSearch, debounceMs, debounceTimer]);

  const handleClear = useCallback(() => {
    setQuery('');
    onClear?.();
    onSearch?.('');
  }, [onClear, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Input
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        leftIcon={<Search className="h-4 w-4" />}
        rightIcon={
          query && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClear}
              className="!p-0 !min-w-0 h-4 w-4"
            >
              <X className="h-3 w-3" />
            </Button>
          )
        }
      />
    </div>
  );
};