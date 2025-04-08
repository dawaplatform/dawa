'use client';

import React from 'react';
import ChangePasswordForm from '@/components/features/forms/ChangePasswordForm';

const ChangePasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md border border-primary_1 px-8 py-12">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Reset Your Password
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
