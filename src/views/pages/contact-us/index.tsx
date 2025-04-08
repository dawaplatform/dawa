'use client';

import React from 'react';
import ContactForm from '@/components/features/forms/ContactForm';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from 'react-icons/fa';
import mainConfig from '@/@core/configs/mainConfigs';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen px-4">
      {/* Container */}
      <div className={`${mainConfig.maxWidthClass}`}>
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600">
            We&apos;re here to help! Reach out to us with any questions or
            feedback you may have.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm />

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Our Contact Information
            </h2>
            <ul className="space-y-4">
              {/* Address */}
              <li className="flex items-start">
                <span className="text-primary_1 flex-shrink-0 mt-1">📍</span>
                <span className="ml-4 text-gray-700">
                  123 Dawa Avenue, Kampala, Uganda
                </span>
              </li>

              {/* Phone */}
              <li className="flex items-start">
                <span className="text-primary_1 flex-shrink-0 mt-1">📞</span>
                <span className="ml-4 text-gray-700">+256 702108552</span>
              </li>

              {/* Email */}
              <li className="flex items-start">
                <span className="text-primary_1 flex-shrink-0 mt-1">✉️</span>
                <span className="ml-4 text-gray-700">
                  dawaonlinestore@gmail.com
                </span>
              </li>
            </ul>

            {/* Map Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Our Location
              </h3>
              <div className="w-full h-64">
                <iframe
                  title="Company Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3188.9434416511363!2d32.58252081504146!3d0.3475961795484383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc2d4e4f8d0d%3A0x7a5f9f1b6b3e9e1b!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sug!4v1616629876543!5m2!1sen!2sug"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="mt-16 bg-gray-700 text-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            {/* About Dawa */}
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold">We are Dawa</h3>
              <p className="mt-2 text-gray-400">
                Dawa is your trusted online store in Uganda, providing a wide
                range of products to meet your everyday needs.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary_1 transition duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary_1 transition duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary_1 transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary_1 transition duration-300"
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary_1 transition duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ContactPage;
