'use client';

import type React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useAuth } from '@core/hooks/use-auth';
import FooterLinkSection from './FooterLinkSection';
import Logo from '@public/assets/svgs/DAWA_VARIATION_04.svg';
import NewsletterForm from '@/components/features/forms/NewsletterForm';

const Footer: React.FC = () => {
  const { user } = useAuth();

  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact-us', label: 'Contact Us' },
    ...(user
      ? []
      : [
          { href: '/login', label: 'Login' },
          { href: '/register', label: 'Sign Up' },
        ]),
  ];

  const customerLinks = [
    { href: '/legal/terms', label: 'Terms of Service' },
    { href: '/legal/privacy', label: 'Privacy Policy' },
    // { href: '/legal/billing', label: 'Billing Policy' },
    { href: '/faqs', label: 'FAQs' },
  ];

  return (
    <footer className="bg-gray-50 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/">
              <Logo className="w-auto h-20 -m-6" />
            </Link>
            <p className="text-sm">
              Your trusted partner for all your e-commerce needs. We provide
              high-quality products and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" icon={<FaFacebook />} label="Facebook" />
              <SocialIcon href="#" icon={<FaInstagram />} label="Instagram" />
              <SocialIcon href="#" icon={<FaTwitter />} label="Twitter" />
              <SocialIcon href="#" icon={<FaLinkedin />} label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links */}
          <FooterLinkSection title="Quick Links" links={quickLinks} />

          {/* Customer Area */}
          <FooterLinkSection title="Customer Area" links={customerLinks} />

          {/* Newsletter Subscription */}
          <div className="lg:col-span-2">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div></div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DAWA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon, label }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-primary_1 transition-colors duration-200"
  >
    {icon}
  </a>
);

export default Footer;
