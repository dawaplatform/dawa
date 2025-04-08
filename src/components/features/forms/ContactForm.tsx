'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../../shared/Button';
import { toast } from 'sonner';
import { useContactUs } from '@core/hooks/useProductData';

// Define the shape of form data, including phone_number as expected by your API.
export interface IFormInput {
  name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
}

// Define the validation schema using Yup.
const schema = yup
  .object({
    name: yup
      .string()
      .required('Name is required')
      .max(50, 'Name cannot exceed 50 characters'),
    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email address'),
    phone_number: yup.string().required('Phone number is required'),
    subject: yup
      .string()
      .required('Subject is required')
      .max(100, 'Subject cannot exceed 100 characters'),
    message: yup
      .string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters'),
  })
  .required();

const ContactForm: React.FC = () => {
  // Use the custom hook to handle contact submission.
  // The hook returns a "contactUs" function (the trigger), a loading state, and any error.
  const { contactUs, isLoading, error } = useContactUs();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  // Handle form submission using the SWR mutation from our custom hook.
  // The custom hook expects a plain object that matches IFormInput.
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await contactUs(data);
      toast.success('Your message has been sent successfully!');
      reset();
    } catch (err) {
      console.error('Error submitting the form:', err);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Get in Touch
      </h2>

      {/* Name Field */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          placeholder="Your Name"
          className={`w-full px-4 py-2 border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-primary_1`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          placeholder="your.email@example.com"
          className={`w-full px-4 py-2 border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-primary_1`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number Field */}
      <div className="mb-4">
        <label htmlFor="phone_number" className="block text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="phone_number"
          {...register('phone_number')}
          placeholder="+1234567890"
          className={`w-full px-4 py-2 border ${
            errors.phone_number ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-primary_1`}
        />
        {errors.phone_number && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone_number.message}
          </p>
        )}
      </div>

      {/* Subject Field */}
      <div className="mb-4">
        <label htmlFor="subject" className="block text-gray-700 mb-2">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
          placeholder="Subject"
          className={`w-full px-4 py-2 border ${
            errors.subject ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-primary_1`}
        />
        {errors.subject && (
          <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="mb-4">
        <label htmlFor="message" className="block text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={5}
          placeholder="Your message..."
          className={`w-full px-4 py-2 border ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-primary_1`}
        ></textarea>
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Optional: Display an error from the hook if one exists */}
      {error && (
        <p className="text-red-500 text-sm mb-4">
          {error.message || 'An error occurred while sending your message.'}
        </p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary_1 h-12 text-white py-2 px-4 rounded-md hover:bg-primary_1 transition duration-300 disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;
