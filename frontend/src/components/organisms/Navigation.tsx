'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { cn } from '@/lib/utils';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavigationItem[];
  badge?: string | number;
  active?: boolean;
}

export interface NavigationProps {
  items: NavigationItem[];
  onItemClick?: (item: NavigationItem) => void;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  onItemClick,
  className,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleItemClick = useCallback((item: NavigationItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else {
      onItemClick?.(item);
    }
  }, [onItemClick, toggleExpanded]);

  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item) => (
        <NavigationItemComponent
          key={item.id}
          item={item}
          expandedItems={expandedItems}
          onItemClick={handleItemClick}
          level={0}
        />
      ))}
    </nav>
  );
};

interface NavigationItemComponentProps {
  item: NavigationItem;
  expandedItems: string[];
  onItemClick: (item: NavigationItem) => void;
  level: number;
}

const NavigationItemComponent: React.FC<NavigationItemComponentProps> = ({
  item,
  expandedItems,
  onItemClick,
  level,
}) => {
  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <motion.button
        onClick={() => onItemClick(item)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
          item.active 
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-50',
          level > 0 && 'ml-4'
        )}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <item.icon className={cn(
          'w-5 h-5',
          item.active ? 'text-blue-600' : 'text-gray-500'
        )} />
        
        <span className="flex-1 text-left font-medium">{item.label}</span>
        
        {item.badge && (
          <Badge variant="info" size="sm">
            {item.badge}
          </Badge>
        )}
        
        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1">
              {item.children!.map((child) => (
                <NavigationItemComponent
                  key={child.id}
                  item={child}
                  expandedItems={expandedItems}
                  onItemClick={onItemClick}
                  level={level + 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};