'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import MainConfigs from '@/@core/configs/mainConfigs';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary_1">404</h1>
          <h2 className="mt-4 text-3xl font-semibold text-gray-700">
            Page Not Found
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href={MainConfigs.homePageUrl}
            className="inline-flex items-center px-4 py-2 mt-8 font-semibold text-white transition duration-300 ease-in-out bg-primary_1 rounded-lg hover:bg-primary_1/80 focus:outline-none focus:ring-2 focus:ring-primary_1 focus:ring-opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
