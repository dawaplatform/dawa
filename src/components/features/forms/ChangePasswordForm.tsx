'use client';

import React, { useState, useEffect } from 'react';
import InputField from '@/components/shared/InputField';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaLock, FaKey } from 'react-icons/fa';
import Button from '@/components/shared/Button';
import { resetPassword } from '@/app/server/auth/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Define form schema using yup
const changePasswordSchema = yup.object().shape({
  otp: yup
    .number()
    .typeError('OTP must be a number')
    .required('OTP is required'),
  new_password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Define form input types
interface ChangePasswordFormInputs {
  otp: number;
  new_password: string;
  confirm_password: string;
}

const ChangePasswordForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChangePasswordFormInputs>({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const router = useRouter();

  // Retrieve the email from sessionStorage
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email is found in session, redirect to forgot password
      router.push('/forgot-password');
    }
  }, [router]);

  const onSubmit: SubmitHandler<ChangePasswordFormInputs> = async (data) => {
    if (!email) {
      toast.error(
        'Email is missing. Please try resetting your password again.',
      );
      return;
    }
    try {
      await resetPassword({
        email,
        otp: data.otp,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      sessionStorage.removeItem('resetEmail');
      toast.success('Password reset successfully!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* OTP Field */}
      <Controller
        name="otp"
        control={control}
        defaultValue={0} // Set default value as 0 to fix the type error
        render={({ field }) => (
          <InputField
            type="number"
            label="OTP"
            placeholder="Enter the OTP sent to your email"
            icon={FaKey}
            {...field}
            errors={errors.otp?.message}
          />
        )}
      />

      {/* New Password Field */}
      <Controller
        name="new_password"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <InputField
            type="password"
            label="New Password"
            placeholder="Enter your new password"
            icon={FaLock}
            {...field}
            errors={errors.new_password?.message}
          />
        )}
      />

      {/* Confirm Password Field */}
      <Controller
        name="confirm_password"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <InputField
            type="password"
            label="Confirm Password"
            placeholder="Confirm your new password"
            icon={FaLock}
            {...field}
            errors={errors.confirm_password?.message}
          />
        )}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`w-full py-3 bg-primary_1 text-white font-semibold h-10 rounded-md shadow hover:bg-primary_1-dark transition-colors ${
          !isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
