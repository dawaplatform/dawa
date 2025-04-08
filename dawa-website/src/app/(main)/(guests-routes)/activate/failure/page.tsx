'use client';

import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function ActivationFailurePage() {
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
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-red-700">
              Activation Failed
            </CardTitle>
            <CardDescription>
              We couldn&#39;t activate your account. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              If the problem persists, please contact our support team.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              onClick={() => (window.location.href = '/activate')}
              variant="outline"
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
