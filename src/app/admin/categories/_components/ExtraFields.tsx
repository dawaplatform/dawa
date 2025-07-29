'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { ExtraFieldsProps } from './types';

export const ExtraFields = ({
  extraFields,
  onAddField,
  onRemoveField,
  onFieldNameChange,
  onFieldRequiredChange,
}: ExtraFieldsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Extra Fields</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onAddField}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Field
        </Button>
      </div>
      {extraFields.length === 0 && (
        <div className="text-sm text-slate-400">No extra fields. Click "Add Field" to add.</div>
      )}
      <div className="space-y-3">
        {extraFields.map((field, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              value={field.name}
              onChange={e => onFieldNameChange(idx, e.target.value)}
              placeholder="Field name (e.g. Mileage)"
              className="flex-1"
            />
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={field.required}
                onChange={e => onFieldRequiredChange(idx, e.target.checked)}
                className="accent-primary-600"
              />
              Required
            </label>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => onRemoveField(idx)}
              aria-label="Remove field"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};