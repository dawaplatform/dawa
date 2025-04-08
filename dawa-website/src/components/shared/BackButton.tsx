import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="mr-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
    >
      <ChevronLeft className="h-6 w-6 text-primary_1" />
    </button>
  );
};

export default BackButton;
