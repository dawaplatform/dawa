'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import GuestOnlyRoute from '@/@core/hocs/GuestOnlyRoute';

export default function ActivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex items-center px-3 py-2 bg-gray-700 text-primary_1 rounded-lg shadow-sm"
        aria-label="Go back"
      >
        <FaArrowLeft className="mr-2 text-xl" />
        <span className="font-medium">Back</span>
      </button>

      {/* Children */}
      {children}
    </div>
  );
}
