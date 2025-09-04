'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

interface AdvancedChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartData;
  title: string;
  subtitle?: string;
  height?: number;
  showLegend?: boolean;
  showToolbar?: boolean;
  onExport?: (format: string) => void;
  onFilter?: (filters: any) => void;
}

export default function AdvancedChart({
  type,
  data,
  title,
  subtitle,
  height = 300,
  showLegend = true,
  showToolbar = true,
  onExport,
  onFilter
}: AdvancedChartProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [filteredData, setFilteredData] = useState<ChartData>(data);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
    // Apply filters to data
    const filtered = {
      ...data,
      datasets: data.datasets.map(dataset => ({
        ...dataset,
        data: dataset.data.filter((_, index) => {
          // Simple filter logic - can be enhanced
          return true;
        })
      }))
    };
    setFilteredData(filtered);
    onFilter?.(newFilters);
  };

  const handleExport = (format: string) => {
    onExport?.(format);
  };

  const renderChart = () => {
    // Mock chart rendering - in real implementation, use Chart.js or similar
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-4">
            {type === 'bar' && <BarChart3 className="w-16 h-16 text-blue-500 mx-auto" />}
            {type === 'line' && <LineChart className="w-16 h-16 text-green-500 mx-auto" />}
            {type === 'pie' && <PieChart className="w-16 h-16 text-purple-500 mx-auto" />}
            {type === 'doughnut' && <PieChart className="w-16 h-16 text-orange-500 mx-auto" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
          
          {/* Mock data visualization */}
          <div className="space-y-2">
            {filteredData.labels.map((label, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(filteredData.datasets[0]?.data[index] || 0) / Math.max(...filteredData.datasets[0]?.data || [1]) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {filteredData.datasets[0]?.data[index] || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Chart Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          
          {showToolbar && (
            <div className="flex items-center space-x-2">
              {onFilter && (
                <button
                  onClick={() => handleFilter({})}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Filtrele"
                >
                  <Filter className="w-4 h-4" />
                </button>
              )}
              
              {onExport && (
                <div className="relative group">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleExport('png')}
                      className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      PNG
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      CSV
                    </button>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={isFullscreen ? "Küçült" : "Büyüt"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-4" style={{ height: `${height}px` }}>
        {renderChart()}
      </div>

      {/* Chart Legend */}
      {showLegend && filteredData.datasets.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            {filteredData.datasets.map((dataset, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dataset.backgroundColor as string || '#3B82F6' }}
                ></div>
                <span className="text-sm text-gray-600">{dataset.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Chart Data Generator Utility
export const generateChartData = (type: string, data: any[]): ChartData => {
  switch (type) {
    case 'revenue':
      return {
        labels: data.map(item => item.month),
        datasets: [{
          label: 'Gelir',
          data: data.map(item => item.revenue),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2
        }]
      };
    
    case 'expenses':
      return {
        labels: data.map(item => item.category),
        datasets: [{
          label: 'Gider',
          data: data.map(item => item.amount),
          backgroundColor: [
            'rgba(239, 68, 68, 0.5)',
            'rgba(245, 158, 11, 0.5)',
            'rgba(34, 197, 94, 0.5)',
            'rgba(168, 85, 247, 0.5)',
            'rgba(236, 72, 153, 0.5)'
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(236, 72, 153, 1)'
          ],
          borderWidth: 2
        }]
      };
    
    case 'customers':
      return {
        labels: data.map(item => item.segment),
        datasets: [{
          label: 'Müşteri Sayısı',
          data: data.map(item => item.count),
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2
        }]
      };
    
    default:
      return {
        labels: [],
        datasets: []
      };
  }
};