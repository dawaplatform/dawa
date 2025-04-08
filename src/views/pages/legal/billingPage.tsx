'use client';

import React from 'react';
import Head from 'next/head';
import Sidebar from '@/views/pages/legal/Sidebar';
import TermsSection from '@/views/pages/legal/TermsSection';

const billingSections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'pricing', title: '2. Pricing' },
  { id: 'billing-process', title: '3. Billing Process' },
  { id: 'payment-methods', title: '4. Payment Methods' },
  { id: 'refunds', title: '5. Refunds' },
  { id: 'cancellations', title: '6. Cancellations' },
  { id: 'changes', title: '7. Changes to Billing Terms' },
  { id: 'contact', title: '8. Contact Us' },
];

const BillingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Billing - Dawa</title>
        <meta name="description" content="Billing Information for Dawa" />
      </Head>
      <div className="flex max-w-6xl mx-auto">
        <Sidebar sections={billingSections} />
        <main className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-primary mb-8">Billing</h1>

          <TermsSection id="introduction" title="1. Introduction">
            <p>
              This Billing section outlines the terms and conditions related to
              payments, pricing, and billing processes on Dawa.
            </p>
          </TermsSection>

          <TermsSection id="pricing" title="2. Pricing">
            <p>
              Our pricing is transparent and subject to change. All prices are
              listed in [your currency] unless otherwise stated.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="billing-process" title="3. Billing Process">
            <p>
              Billing is handled automatically based on your selected plan or
              purchases. You will receive an invoice via email for each billing
              cycle.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="payment-methods" title="4. Payment Methods">
            <p>
              We accept various payment methods, including credit/debit cards,
              PayPal, and other secure payment gateways.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="refunds" title="5. Refunds">
            <p>
              Refunds are provided under specific circumstances. Please refer to
              our refund policy for detailed information.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="cancellations" title="6. Cancellations">
            <p>
              You may cancel your subscription or services at any time.
              Cancellation requests must be submitted through your account
              settings.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="changes" title="7. Changes to Billing Terms">
            <p>
              We reserve the right to modify billing terms at any time. Any
              changes will be communicated to you in advance.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="contact" title="8. Contact Us">
            <p>
              For any billing-related inquiries, please contact us at [your
              contact email].
            </p>
          </TermsSection>
        </main>
      </div>
    </>
  );
};

export default BillingPage;
