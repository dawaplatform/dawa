'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function ActivationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-green-700">
              Activation Successful!
            </CardTitle>
            <CardDescription>
              Your account has been successfully activated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You will be redirected to the login page in 5 seconds.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => router.push('/login')}>Go to Login</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
