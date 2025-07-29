'use client';

import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <span className="ml-2">Loading...</span>
    </div>
  );
};