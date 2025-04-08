// app/legal/terms/page.tsx

'use client';

import React from 'react';
import Head from 'next/head';
import Sidebar from '@/views/pages/legal/Sidebar';
import TermsSection from '@/views/pages/legal/TermsSection';

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'eligibility', title: 'Eligibility' },
  { id: 'registration', title: 'Account Registration' },
  { id: 'responsibilities', title: 'User Responsibilities' },
  { id: 'listings', title: 'Listings and Transactions' },
  { id: 'fees', title: 'Fees and Payments' },
  { id: 'intellectual', title: 'Intellectual Property' },
  { id: 'termination', title: 'Termination' },
  { id: 'disclaimers', title: 'Disclaimers' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'governing', title: 'Governing Law' },
  { id: 'changes', title: 'Changes to Terms' },
  { id: 'contact', title: 'Contact Us' },
];

const TermsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Dawa</title>
        <meta name="description" content="Terms and Conditions for Dawa" />
      </Head>
      <div className="flex max-w-6xl mx-auto">
        <Sidebar sections={sections} />
        <main className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-primary mb-8">
            Terms and Conditions
          </h1>

          <TermsSection id="introduction" title="1. Introduction">
            <p>
              Welcome to Dawa (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;).
              These Terms and Conditions (&quot;Terms&quot;) govern your use of
              our website located at [yourwebsite.com] (&quot;Site&quot;) and
              any services we provide through the Site.
            </p>

            <p>
              By accessing or using our Site, you agree to be bound by these
              Terms. If you do not agree with any part of these Terms, you must
              not use our Site.
            </p>
          </TermsSection>

          <TermsSection id="eligibility" title="2. Eligibility">
            <p>
              You must be at least 18 years old to use our services. By using
              the Site, you represent and warrant that you meet this eligibility
              requirement.
            </p>
          </TermsSection>

          <TermsSection id="registration" title="3. Account Registration">
            <p>
              To access certain features of the Site, you may need to register
              for an account. You agree to provide accurate, current, and
              complete information during registration and to update such
              information to keep it accurate.
            </p>
          </TermsSection>

          <TermsSection id="responsibilities" title="4. User Responsibilities">
            <ul className="list-disc list-inside">
              <li>
                <strong>Accurate Information:</strong> Ensure that all
                information provided is accurate and up-to-date.
              </li>
              <li>
                <strong>Account Security:</strong> Maintain the confidentiality
                of your account credentials and notify us immediately of any
                unauthorized use.
              </li>
              <li>
                <strong>Compliance:</strong> Use the Site in compliance with all
                applicable laws and regulations.
              </li>
            </ul>
          </TermsSection>

          <TermsSection id="listings" title="5. Listings and Transactions">
            <ul className="list-disc list-inside">
              <li>
                <strong>User Listings:</strong> Users can list items for sale on
                the Site. You are responsible for ensuring that your listings
                comply with our policies and all applicable laws.
              </li>
              <li>
                <strong>Transactions:</strong> All transactions between buyers
                and sellers are conducted directly between the parties. We are
                not a party to any transaction and do not guarantee the quality,
                safety, or legality of any item listed.
              </li>
            </ul>
          </TermsSection>

          <TermsSection id="fees" title="6. Fees and Payments">
            <ul className="list-disc list-inside">
              <li>
                <strong>Service Fees:</strong> We may charge fees for certain
                services or features. All fees are non-refundable unless
                otherwise stated.
              </li>
              <li>
                <strong>Payment Processing:</strong> Payments are processed
                through third-party payment gateways. We are not responsible for
                any issues related to payment processing.
              </li>
            </ul>
          </TermsSection>

          <TermsSection id="intellectual" title="7. Intellectual Property">
            <p>
              All content on the Site, including text, graphics, logos, and
              images, is the property of Dawa or its licensors and is protected
              by intellectual property laws.
            </p>
          </TermsSection>

          <TermsSection id="termination" title="8. Termination">
            <p>
              We reserve the right to terminate or suspend your account and
              access to the Site at our sole discretion, without prior notice or
              liability, for any reason, including if you breach these Terms.
            </p>
          </TermsSection>

          <TermsSection id="disclaimers" title="9. Disclaimers">
            <p>
              The Site is provided &quot;as is&quot; and &quot;as
              available&quot; without any warranties of any kind. We disclaim
              all warranties, whether express or implied, including but not
              limited to merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
          </TermsSection>

          <TermsSection id="liability" title="10. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Dawa shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages arising out of your use of the Site.
            </p>
          </TermsSection>

          <TermsSection id="indemnification" title="11. Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless Dawa and its
              affiliates from any claims, liabilities, damages, and expenses
              arising from your use of the Site or violation of these Terms.
            </p>
          </TermsSection>

          <TermsSection id="governing" title="12. Governing Law">
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of [Your Country/State], without regard to its conflict of
              law provisions.
            </p>
          </TermsSection>

          <TermsSection id="changes" title="13. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. Any
              changes will be effective immediately upon posting on the Site.
              Your continued use of the Site after such changes constitutes your
              acceptance of the new Terms.
            </p>
          </TermsSection>

          <TermsSection id="contact" title="14. Contact Us">
            <p>
              If you have any questions about these Terms, please contact us at
              [your contact email].
            </p>
          </TermsSection>
        </main>
      </div>
    </>
  );
};

export default TermsPage;
