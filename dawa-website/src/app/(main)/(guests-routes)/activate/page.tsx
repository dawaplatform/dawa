'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { activateAccount, resendActivationEmail } from '@/app/server/auth/api';
import { Clock } from 'lucide-react';

export default function ActivationForm() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Retrieve the registered email from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('registeredEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email is found, redirect to registration
      toast.error('No email found. Please register first.');
      router.push('/register');
    }
  }, [router]);

  // Handle the resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle input changes in the verification code fields
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d?$/.test(value)) return; // Allow only digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value !== '') {
      handleSubmit(newCode.join(''));
    }
  };

  // Handle keyboard navigation (e.g., Backspace)
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle form submission for activation
  const handleSubmit = async (fullCode: string) => {
    if (!email) {
      toast.error('Email not found. Please try registering again.');
      return;
    }

    setLoading(true);
    try {
      const response = await activateAccount({
        email,
        otp_code: fullCode,
      });

      if (response.status === 200) {
        toast.success(response.message || 'Account activated successfully.');
        sessionStorage.removeItem('registeredEmail');
        router.push('/activate/success');
      } else {
        toast.error(response.message || 'Activation failed. Please try again.');
        sessionStorage.removeItem('registeredEmail');
        router.push('/activate/failure');
      }
    } catch (error: any) {
      console.error('Activation error:', error);
      toast.error(
        error.response?.data?.message || 'Activation failed. Please try again.',
      );
      sessionStorage.removeItem('registeredEmail');
      router.push('/activate/failure');
    } finally {
      setLoading(false);
    }
  };

  // Handle resending the activation code
  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email not found. Please try registering again.');
      return;
    }

    setLoading(true);
    try {
      const response = await resendActivationEmail({ email });

      if (response.status === 200) {
        toast.success(
          response.message ||
            'Activation code resent. Please check your email.',
        );
        setResendTimer(30); // Set a 30-second cooldown
      } else {
        toast.error(
          response.message ||
            'Failed to resend activation code. Please try again.',
        );
      }
    } catch (error: any) {
      console.error('Resend activation error:', error);
      toast.error('Failed to resend activation code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="shadow-lg border-primary_2 dark:border-primary_1">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-primary_1 dark:text-orange-300">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center text-primary_1 dark:text-orange-400">
              Enter the 6-digit code sent to ({email}).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-2 mb-6">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el: any) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-2xl font-semibold bg-orange-50 border-orange-300 focus:border-primary_1 focus:ring-primary_1 dark:bg-orange-900 dark:border-primary_1 dark:text-orange-100 dark:focus:border-primary_1 dark:focus:ring-primary_1`}
                  disabled={loading}
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleResendCode}
              variant="outline"
              disabled={loading || resendTimer > 0}
              className="w-full bg-orange-100 text-primary_1 border-orange-300 hover:bg-orange-200 hover:text-primary_1 dark:bg-primary_1 dark:text-orange-100 dark:border-primary_1 dark:hover:bg-primary_1 dark:hover:text-orange-50 transition-colors"
            >
              {resendTimer > 0 ? (
                <span className="flex items-center justify-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Resend in {resendTimer}s
                </span>
              ) : (
                'Resend activation code'
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
