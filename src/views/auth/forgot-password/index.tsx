import ForgotPasswordForm from '@/components/features/forms/ForgotPasswordForm';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md border border-primary_1 px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Forgot Password
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address below and we’ll send you instructions on how
          to reset your password.
        </p>

        {/* Reusable Forgot Password Form */}
        <ForgotPasswordForm />

        <p className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-primary_1 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
