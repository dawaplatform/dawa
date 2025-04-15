'use client';

import React from 'react';
import ChangePasswordForm from '@/components/features/forms/ChangePasswordForm';

const ChangePasswordPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg md:bg-white md:rounded-xl md:shadow-md md:border md:border-primary_1 md:px-8 md:py-12">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Reset Your Password
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
