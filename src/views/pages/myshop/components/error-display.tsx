import type React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorDisplayProps {
  message?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message = 'There was an error loading the shop data',
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    </div>
  );
};
