'use client';

import React, { useState, useEffect } from 'react';
import { FaUnlock, FaEye, FaEyeSlash, FaUserCircle } from 'react-icons/fa';
import Button from '@/components/shared/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '@/components/shared/InputField';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { authSchema } from '@core/validations/authValidation';
import GoogleIcon from '@public/assets/svgs/google.svg';

interface ILoginInputs {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect already-authenticated users away from /login
  const { status } = useSession();
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home');
    }
  }, [status, router]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<ILoginInputs>({
    mode: 'onChange',
    resolver: yupResolver(authSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
      rememberMe: false,
    },
  });

  // Google sign-in: let NextAuth own the OAuth redirect flow.
  // callbackUrl tells NextAuth where to send the user after Google authenticates.
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/home' });
  };

  const onSubmit: SubmitHandler<ILoginInputs> = async (data) => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        username: data.emailOrUsername,
        password: data.password,
      });
      if (res?.error) {
        // NextAuth wraps the thrown Error message in res.error
        setErrorMessage(res.error);
      } else if (res?.ok) {
        router.push('/home');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <div className="flex-1 md:p-4">
      <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
      <p className="text-gray-500 mb-6 text-center">
        Welcome back! Please login to your account.
      </p>

      {errorMessage && (
        <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email/Username Field */}
        <InputField
          type="text"
          label="Username or Email Address"
          placeholder="Enter your username or email"
          icon={FaUserCircle}
          {...register('emailOrUsername')}
          errors={errors.emailOrUsername?.message}
        />

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
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
              placeholder="Enter your password"
              {...register('password')}
              className="flex-grow outline-none bg-transparent text-gray-700 placeholder-gray-400"
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-primary_1 ml-2 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  id="rememberMe"
                  className="mr-2"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
            <label
              htmlFor="rememberMe"
              className="text-gray-700 cursor-pointer text-sm"
            >
              Remember Me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-primary_1 text-sm font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className={`w-full mt-6 h-12 bg-primary_1 text-white rounded-md font-bold hover:bg-primary_1-dark transition-colors ${
            !isValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Signing In...' : 'SIGN IN'}
        </Button>

        <div className="flex items-center justify-center mt-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-4 text-sm text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign-In Button */}
        <Button
          type="button"
          icon={GoogleIcon}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full mt-4 h-12 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center"
        >
          Sign in with Google
        </Button>

        <p className="mt-8 text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary_1 hover:underline">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
