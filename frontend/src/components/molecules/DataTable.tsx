import React from 'react';
import LoadingSpinner from '../atoms/LoadingSpinner';
import Icon from '../atoms/Icon';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
    onSort: (field: string, direction: 'asc' | 'desc') => void;
  };
  className?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'Veri bulunamadı',
  pagination,
  sorting,
  className = ''
}: DataTableProps<T>) => {
  const handleSort = (field: string) => {
    if (!sorting) return;
    
    const newDirection = 
      sorting.field === field && sorting.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    sorting.onSort(field, newDirection);
  };

  const getSortIcon = (field: string) => {
    if (!sorting || sorting.field !== field) {
      return null;
    }
    
    return sorting.direction === 'asc' ? '↑' : '↓';
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { current, total, pageSize, onPageChange } = pagination;
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (current - 1) * pageSize + 1;
    const endItem = Math.min(current * pageSize, total);

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            {startItem}-{endItem} arası, toplam {total} kayıt
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={current === 1}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon={ChevronsLeft} size="sm" />
          </button>
          <button
            onClick={() => onPageChange(current - 1)}
            disabled={current === 1}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon={ChevronLeft} size="sm" />
          </button>
          
          <span className="px-3 py-1 text-sm text-gray-700">
            Sayfa {current} / {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(current + 1)}
            disabled={current === totalPages}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon={ChevronRight} size="sm" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={current === totalPages}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon={ChevronsRight} size="sm" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Veriler yükleniyor..." />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : ''
                  }`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && sorting && (
                      <button
                        onClick={() => handleSort(column.key as string)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {getSortIcon(column.key as string)}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        column.align === 'center' ? 'text-center' : 
                        column.align === 'right' ? 'text-right' : ''
                      }`}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default DataTable;
