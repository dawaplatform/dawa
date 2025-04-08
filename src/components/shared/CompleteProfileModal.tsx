'use client';

import { useEffect, useState } from 'react';
import { useUpdateUserProfile } from '@/@core/hooks/useProductData';
import { useProfile } from '@/contexts/profile-context';
import { useAuth } from '@/@core/hooks/use-auth';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Import form tools
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Normalize the phone number by removing spaces, dashes, and parentheses,
// and add the default Uganda country code (+256) if missing.
const normalizePhone = (value: string) => {
  if (!value) return value;
  let normalized = value.replace(/[\s()-]/g, '');
  if (!normalized.startsWith('+')) {
    // If the number starts with 0, remove it and prepend +256.
    if (normalized.startsWith('0')) {
      normalized = '+256' + normalized.slice(1);
    } else {
      // Otherwise, simply prepend +256.
      normalized = '+256' + normalized;
    }
  }
  return normalized;
};

// Define a Yup validation schema for the profile fields.
const profileSchema = yup.object({
  phone: yup
    .string()
    .transform((value) => normalizePhone(value))
    .required('Phone number is required')
    .test(
      'is-valid-phone',
      'Invalid phone number for Uganda',
      function (value) {
        if (!value) return false;
        // Parse the number with a default region of 'UG'
        const phoneNumber = parsePhoneNumberFromString(value, 'UG');
        return phoneNumber ? phoneNumber.isValid() : false;
      },
    ),
  address: yup.string().required('Address is required'),
});

type FormData = yup.InferType<typeof profileSchema>;

export function CompleteProfileModal() {
  const { userProfile, mutate } = useProfile();
  const { user } = useAuth();
  const { updateUserProfile, isLoading, error } = useUpdateUserProfile();

  // Local state to control the dialog open state.
  const [open, setOpen] = useState(false);

  // Set up react-hook-form using our Yup schema.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      phone: userProfile?.contact || '',
      address: userProfile?.address || '',
    },
  });

  // Check if the user is logged in and if their profile is incomplete.
  useEffect(() => {
    if (!user) {
      setOpen(false);
      return;
    }
    if (userProfile) {
      // Open the dialog if either the phone (contact) or address is missing.
      if (!userProfile.contact || !userProfile.address) {
        setOpen(true);
        // Set initial form values from the profile if available.
        setValue('phone', userProfile.contact || '');
        setValue('address', userProfile.address || '');
      } else {
        setOpen(false);
      }
    }
  }, [user, userProfile, setValue]);

  // Prevent closing the dialog externally until the profile is complete.
  const handleOpenChange = (isOpen: boolean) => {
    if (userProfile && (!userProfile.contact || !userProfile.address)) {
      setOpen(true);
    } else {
      setOpen(isOpen);
    }
  };

  // Handle form submission to update the profile.
  const onSubmit = async (data: FormData) => {
    // Prepare the form data for the API.
    const formData = new FormData();
    formData.append('contact', data.phone);
    formData.append('address', data.address);

    try {
      await updateUserProfile(formData);
      // Revalidate the profile data after a successful update.
      mutate();
      // Close the dialog when the update is successful.
      setOpen(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Your profile appears to be incomplete. Please update the missing
            details below to continue using our services.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Enter phone number eg. +256789012345"
              {...register('phone')}
              className={`mt-1 block w-full ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="address">Address / Location</Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter your address"
              {...register('address')}
              className={`mt-1 block w-full ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm">
              {error.message || 'An error occurred'}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !isValid}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
