'use client';

import React from 'react';
import { Input, InputProps } from '@/components/atoms/Input';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends Omit<InputProps, 'error'> {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  description,
  className,
  ...inputProps
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      <Input
        {...inputProps}
        error={error}
        className="w-full"
      />
    </div>
  );
};