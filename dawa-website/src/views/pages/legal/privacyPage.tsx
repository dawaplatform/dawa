'use client';

import React from 'react';
import Head from 'next/head';
import Sidebar from '@/views/pages/legal/Sidebar';
import TermsSection from '@/views/pages/legal/TermsSection';

const privacySections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-collection', title: '2. Information Collection' },
  { id: 'use-of-information', title: '3. Use of Information' },
  { id: 'information-sharing', title: '4. Information Sharing' },
  { id: 'cookies', title: '5. Cookies' },
  { id: 'data-security', title: '6. Data Security' },
  { id: 'user-rights', title: '7. User Rights' },
  { id: 'changes', title: '8. Changes to Privacy Policy' },
  { id: 'contact', title: '9. Contact Us' },
];

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - Dawa</title>
        <meta name="description" content="Privacy Policy for Dawa" />
      </Head>
      <div className="flex max-w-6xl mx-auto">
        <Sidebar sections={privacySections} />
        <main className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-primary mb-8">
            Privacy Policy
          </h1>

          <TermsSection id="introduction" title="1. Introduction">
            <p>
              Welcome to Dawa (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;).
              These Terms and Conditions (&quot;Terms&quot;) govern your use of
              our website located at [yourwebsite.com] (&quot;Site&quot;) and
              any services we provide through the Site.
            </p>
            <p>
              By accessing or using our Site, you agree to the terms of this
              Privacy Policy. If you do not agree with the terms, please do not
              use our Site.
            </p>
          </TermsSection>

          <TermsSection
            id="information-collection"
            title="2. Information Collection"
          >
            <p>
              We may collect various types of information from you, including
              personal, identifiable, and non-personal information.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="use-of-information" title="3. Use of Information">
            <p>
              We use the collected information for various purposes, including
              to provide and maintain our services, improve your experience, and
              communicate with you.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="information-sharing" title="4. Information Sharing">
            <p>
              We may share your information with third parties under certain
              circumstances, such as to comply with legal obligations or to
              protect our rights.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="cookies" title="5. Cookies">
            <p>
              We use cookies and similar tracking technologies to track activity
              on our Site and hold certain information.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="data-security" title="6. Data Security">
            <p>
              We take reasonable measures to protect the security of your
              information, but no method of transmission over the Internet is
              100% secure.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="user-rights" title="7. User Rights">
            <p>
              Depending on your location, you may have the right to access,
              correct, or delete your personal information.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="changes" title="8. Changes to Privacy Policy">
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>
            {/* Add more detailed content here */}
          </TermsSection>

          <TermsSection id="contact" title="9. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at [your contact email].
            </p>
          </TermsSection>
        </main>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
