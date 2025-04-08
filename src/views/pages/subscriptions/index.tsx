'use client';
import Link from 'next/link';
import React, { useState } from 'react';

const SubscriptionPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  // Define currency settings
  const currency = {
    symbol: 'UGX',
    // Assuming 1 USD = 3,700 UGX for demonstration purposes
    exchangeRate: 3700,
  };

  // Helper function to format price
  const formatPrice = (usdPrice: any) => {
    if (usdPrice === 'Contact Us') return usdPrice;
    const ugxPrice = usdPrice === 0 ? 0 : usdPrice * currency.exchangeRate;
    return `${ugxPrice.toLocaleString()} ${currency.symbol}`;
  };

  const plans = [
    {
      title: 'Free',
      price: 0,
      description: 'Ideal for personal use',
      features: [
        'Access basic features',
        'Console Customization',
        'Artificial Intelligence and ML',
        'Share with up to 5 guests',
      ],
      color: 'bg-green-500',
    },
    {
      title: 'Most Popular',
      price: isYearly ? 180 : 19,
      description: 'Best value for growing businesses',
      features: [
        'All Free plan features',
        'Priority Support',
        'Advanced Analytics',
        'Unlimited Projects',
      ],
      color: 'bg-blue-500',
    },
    {
      title: 'Custom',
      price: isYearly ? 'Contact Us' : 50,
      description: 'Tailored solutions for enterprises',
      features: [
        'All Most Popular features',
        'Dedicated Support Team',
        'Custom Integrations',
        'Unlimited Users',
      ],
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4">
      {/* Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Pricing Plans
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that fits your needs and start building your future
            today.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <button className="px-6 py-3 bg-primary_1 text-white rounded-lg hover:bg-primary_1 transition duration-300">
              Get Started for Free
            </button>
            <button className="px-6 py-3 bg-transparent border border-primary_1 text-primary_1 rounded-lg hover:bg-primary_1 hover:text-white transition duration-300">
              Contact Sales
            </button>
          </div>
          <div className="flex justify-center items-center gap-3 mt-6">
            <span className="text-green-600 font-medium">Save up to 30%</span>
            <div className="flex bg-gray-200 p-1 rounded-full">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                  !isYearly
                    ? 'bg-primary_1 text-white'
                    : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                  isYearly
                    ? 'bg-primary_1 text-white'
                    : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 shadow-lg transition-transform transform hover:scale-105 ${
                index === 1 ? 'border-2 border-primary_1' : ''
              }`}
            >
              <h3 className="text-2xl font-semibold text-gray-900 text-center">
                {plan.title}
              </h3>
              <p className="text-center text-4xl font-extrabold text-primary_1 mt-4">
                {formatPrice(plan.price)}
              </p>
              <p className="text-center text-gray-600 text-sm mt-2">
                {plan.description}
              </p>
              <div className="mt-6 bg-white p-6 rounded-lg shadow-inner">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Features
                </h4>
                <ul className="space-y-3 text-gray-700">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary_1 flex-shrink-0 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.707 10.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L8.414 13.586 4.707 9.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L8.414 11.586 5.707 8.879a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full px-4 py-2 bg-primary_1 text-white rounded-lg hover:bg-primary_1 transition duration-300">
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information or FAQs */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900">
            Have Questions?
          </h3>
          <p className="mt-4 text-gray-600">
            Check out our{' '}
            <Link href="/faqs" className="text-primary_1 underline">
              FAQ
            </Link>{' '}
            or{' '}
            <Link href="/contact-us" className="text-primary_1 underline">
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
