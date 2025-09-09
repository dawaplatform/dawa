'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSubscribeToNewsletter } from '@core/hooks/useProductData';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');

  // Use the custom hook for subscribing to the newsletter.
  const { subscribeToNewsletter, isLoading, error } =
    useSubscribeToNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare the payload with a fixed name and the entered email.
      await subscribeToNewsletter({
        name: 'subscribe',
        email,
      });

      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900">
        Subscribe to our newsletter
      </h3>
      <p className="text-sm text-gray-600">
        Stay updated with our latest offers and products
      </p>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-grow"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary_1 hover:bg-primary_1/90 text-white"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
      {error && (
        <p className="text-red-500 text-sm">
          {error.message || 'An error occurred while subscribing.'}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;
