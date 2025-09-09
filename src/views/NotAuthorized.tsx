'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NoAccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <AlertCircle className="w-24 h-24 mx-auto text-primary_1" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Access Denied
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Sorry, you don&#39;t have permission to access this page. Please
          contact your administrator if you believe this is an error.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-block bg-primtext-primary_1 text-white font-semibold px-6 py-3 rounded-lg transition-transform transform hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primtext-primary_1 focus:ring-opacity-50"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
