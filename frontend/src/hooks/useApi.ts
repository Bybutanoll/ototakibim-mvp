// Custom hooks for API integration
import { useState, useEffect, useCallback, useRef } from 'react';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiOptions {
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Generic API hook
export const useApi = <T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  dependencies: any[] = [],
  options: UseApiOptions = {}
) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const {
    immediate = true,
    retryCount = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const retryCountRef = useRef(0);
  const isMountedRef = useRef(true);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    if (!isMountedRef.current) return null;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      
      if (isMountedRef.current) {
        setState({
          data: result,
          loading: false,
          error: null,
        });
        
        onSuccess?.(result);
        retryCountRef.current = 0;
      }
      
      return result;
    } catch (error: any) {
      if (!isMountedRef.current) return null;

      const errorMessage = error.message || 'An error occurred';
      
      // Retry logic
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        setTimeout(() => {
          if (isMountedRef.current) {
            execute(...args);
          }
        }, retryDelay * retryCountRef.current);
        return null;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      onError?.(errorMessage);
      throw error;
    }
  }, [apiFunction, retryCount, retryDelay, onSuccess, onError]);

  const refetch = useCallback((...args: any[]) => {
    retryCountRef.current = 0;
    return execute(...args);
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
    retryCountRef.current = 0;
  }, []);

  useEffect(() => {
    if (immediate && dependencies.length > 0) {
      execute();
    }
  }, dependencies);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    execute,
    refetch,
    reset,
  };
};

// Mutation hook for POST, PUT, DELETE operations
export const useMutation = <T = any, V = any>(
  mutationFunction: (variables: V) => Promise<T>,
  options: UseApiOptions = {}
) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const {
    onSuccess,
    onError,
  } = options;

  const mutate = useCallback(async (variables: V): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await mutationFunction(variables);
      
      setState({
        data: result,
        loading: false,
        error: null,
      });
      
      onSuccess?.(result);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      onError?.(errorMessage);
      throw error;
    }
  }, [mutationFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
};

// Pagination hook
export const usePagination = <T = any>(
  apiFunction: (page: number, limit: number, ...args: any[]) => Promise<{
    data: T[];
    total: number;
    page: number;
    totalPages: number;
  }>,
  limit: number = 10,
  dependencies: any[] = []
) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [allData, setAllData] = useState<T[]>([]);

  const { data, loading, error, execute } = useApi(
    (currentPage: number) => apiFunction(currentPage, limit, ...dependencies),
    [page, limit, ...dependencies],
    { immediate: true }
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
      setTotal(data.total);
      
      if (page === 1) {
        setAllData(data.data);
      } else {
        setAllData(prev => [...prev, ...data.data]);
      }
    }
  }, [data, page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const resetPagination = useCallback(() => {
    setPage(1);
    setAllData([]);
    setTotalPages(0);
    setTotal(0);
  }, []);

  return {
    data: allData,
    currentPage: page,
    totalPages,
    total,
    loading,
    error,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

// Infinite scroll hook
export const useInfiniteScroll = <T = any>(
  apiFunction: (page: number, limit: number, ...args: any[]) => Promise<{
    data: T[];
    total: number;
    page: number;
    totalPages: number;
  }>,
  limit: number = 10,
  dependencies: any[] = []
) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(page, limit, ...dependencies);
      
      if (result.data.length === 0) {
        setHasMore(false);
      } else {
        setAllData(prev => page === 1 ? result.data : [...prev, ...result.data]);
        setPage(prev => prev + 1);
        setHasMore(page < result.totalPages);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, limit, loading, hasMore, ...dependencies]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    data: allData,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
};
