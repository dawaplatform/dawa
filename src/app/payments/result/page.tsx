'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const MESSAGES: Record<string, { title: string; body: string }> = {
  COMPLETED: { title: 'Payment successful', body: 'Your boost is now active.' },
  PENDING: { title: 'Payment processing', body: 'We are confirming your payment. This can take a moment.' },
  FAILED: { title: 'Payment failed', body: 'Your payment was not completed. Please try again.' },
  INVALID: { title: 'Payment could not be verified', body: 'Please contact support with your reference.' },
  REVERSED: { title: 'Payment reversed', body: 'This payment was reversed.' },
};

function Result() {
  const params = useSearchParams();
  const status = params.get('status') || 'PENDING';
  const reference = params.get('reference');
  const msg = MESSAGES[status] || MESSAGES.PENDING;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">{msg.title}</h1>
      <p className="text-muted-foreground">{msg.body}</p>
      {reference && (
        <p className="text-sm">
          Reference: <code>{reference}</code>
        </p>
      )}
      <Link href="/" className="text-primary underline text-sm">
        Back to Dawa
      </Link>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense>
      <Result />
    </Suspense>
  );
}
