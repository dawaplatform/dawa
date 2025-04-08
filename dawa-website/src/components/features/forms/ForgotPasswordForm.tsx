'use client';

import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaEnvelope } from 'react-icons/fa';
import Button from '@/components/shared/Button';
import { forgotPassword } from '@/app/server/auth/api';
import { useRouter } from 'next/navigation';
import InputField from '@/components/shared/InputField';

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
});

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPasswordForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
  });
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setApiError(null);
    try {
      await forgotPassword({ email: data.email });
      sessionStorage.setItem('resetEmail', data.email);
      router.push('/change-password');
    } catch (error: any) {
      setApiError(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <InputField
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            icon={FaEnvelope}
            {...field}
            errors={errors.email?.message}
          />
        )}
      />

      {/* API Error Message */}
      {apiError && (
        <p className="text-red-500 text-sm text-center">{apiError}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`w-full py-3 bg-primary_1 text-white font-semibold h-10 rounded-md shadow hover:bg-primary_1-dark transition-colors ${
          !isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
