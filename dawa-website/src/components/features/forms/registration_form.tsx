'use client';

import React, { useState, useEffect } from 'react';
import {
  FaUnlock,
  FaUserCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaPhone,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Button from '@/components/shared/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import GoogleIcon from '@public/assets/svgs/google.svg';
import InputField from '@/components/shared/InputField';
import Link from 'next/link';
import { registerUser } from '@/app/server/auth/api';
import { schema } from '@/@core/validations/authValidation';
import { signIn } from 'next-auth/react';
import { useAuth } from '@core/hooks/use-auth';

interface IFormInputs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  terms: boolean;
}

/**
 * Normalizes the phone number:
 * - Removes spaces, dashes, and parentheses.
 * - If the number does not start with a '+', prepends '+256'.
 * - If the number starts with '0', replaces it with '+256'.
 */
const normalizePhone = (value: string): string => {
  if (!value) return value;
  let normalized = value.replace(/[\s()-]/g, '');
  if (!normalized.startsWith('+')) {
    if (normalized.startsWith('0')) {
      normalized = '+256' + normalized.slice(1);
    } else {
      normalized = '+256' + normalized;
    }
  }
  return normalized;
};

const RegistrationForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if user is already logged in.
  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      terms: false,
    },
  });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signIn('google', { redirect: false });
    if (result?.error) {
      setLoading(false);
      return;
    } else if (result?.ok) {
      router.push('/');
    }
    setLoading(false);
  };

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    setLoading(true);
    setApiError(null);
    const formattedData = {
      email: data.email.trim(),
      password: data.password,
      password2: data.password,
      firstname: data.firstName.trim(),
      lastname: data.lastName.trim(),
      user_role: 'Client',
      // The phone number is normalized via setValueAs.
      contact: data.phone.trim(),
    };

    try {
      // Assume registerUser returns a parsed JSON object.
      const result = await registerUser(formattedData);
      if (result.status === 201 || result.status === 200) {
        sessionStorage.setItem('registeredEmail', formattedData.email);
        router.push('/activate');
      } else {
        throw new Error(
          result.message || 'Registration failed. Please try again.',
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full md:w-[60%] md:px-10 md:py-12 bg-white md:shadow-lg md:rounded-lg">
      <h2 className="text-2xl font-semibold mb-2 text-center text-black">
        Create an Account
      </h2>
      <p className="text-gray-500 mb-6 text-center">
        Please fill in your details to create your account.
      </p>
      {apiError && (
        <p className="text-red-500 text-sm text-center">{apiError}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <InputField
              label="First Name"
              icon={FaUserCircle}
              type="text"
              placeholder="First name"
              {...register('firstName')}
              className="w-full"
              errors={errors.firstName?.message}
            />
          </div>
          <div className="w-full">
            <InputField
              label="Last Name"
              icon={FaUserCircle}
              type="text"
              placeholder="Last name"
              {...register('lastName')}
              className="w-full"
              errors={errors.lastName?.message}
            />
          </div>
        </div>

        {/* Phone Number */}
        <InputField
          label="Phone Number"
          icon={FaPhone}
          type="text"
          placeholder="Enter phone number (e.g. +256777888999)"
          {...register('phone', {
            setValueAs: (value) => normalizePhone(value),
          })}
          errors={errors.phone?.message}
        />

        {/* Email Address */}
        <InputField
          label="Email Address"
          icon={FaEnvelope}
          type="email"
          placeholder="Enter email"
          {...register('email')}
          errors={errors.email?.message}
        />

        {/* Password Field with Toggle */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Password
          </label>
          <div
            className={`flex items-center border rounded-lg p-3 focus-within:border-primary_1 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <FaUnlock className="text-gray-400 mr-2 hidden md:block" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              {...register('password')}
              className="flex-grow outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="ml-2 p-1 rounded focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Never disclose your password to anyone.
          </p>
        </div>

        {/* Terms and Policies */}
        <div className="flex items-center mt-6">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
                className="h-4 w-4 cursor-pointer"
              />
            )}
          />
          <label
            htmlFor="terms"
            className="ml-3 text-sm text-gray-700 cursor-pointer"
          >
            I agree to the{' '}
            <Link
              href="/legal/terms"
              className="text-primary_1 hover:underline"
            >
              Terms and Policies
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500 mt-1">{errors.terms.message}</p>
        )}

        {/* Register Button */}
        <Button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full mt-6 h-12 bg-primary_1 text-white rounded-md font-bold hover:bg-primary_1/90 transition-colors ${
            !isValid || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Registering...' : 'REGISTER'}
        </Button>

        {/* Divider */}
        <div className="flex items-center justify-center mt-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-4 text-sm text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Register with Google */}
        <Button
          type="button"
          icon={GoogleIcon}
          onClick={handleGoogleSignIn}
          className="w-full mt-4 h-12 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
        >
          Register with Google
        </Button>

        {/* Login Link */}
        <p className="mt-8 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-primary_1 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
