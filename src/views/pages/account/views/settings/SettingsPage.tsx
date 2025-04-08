'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/contexts/profile-context';
import { cn } from '@/lib/utils';
import {
  useChangeUserPassword,
  useUpdateUserProfile,
} from '@core/hooks/useProductData';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { NotificationPreferences } from '../../../../../components/features/forms/NotificationPreferences';
import { PersonalInfoForm } from '../../../../../components/features/forms/PersonalInfoForm';
import { SecurityForm } from '../../../../../components/features/forms/SecurityForm';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  national_id_or_passport_number: string;
  user_profile_picture: string | null;
}

const initialFormData: ProfileFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  national_id_or_passport_number: '',
  user_profile_picture: null,
};

export default function SettingsPage() {
  const { userProfile, isLoading: isProfileLoading, mutate } = useProfile();
  const { updateUserProfile, isLoading: isUpdating } = useUpdateUserProfile();
  const { changeUserPassword, isLoading: isChangingPassword } =
    useChangeUserPassword();
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [originalData, setOriginalData] =
    useState<ProfileFormData>(initialFormData);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [files, setFiles] = useState<{
    user_profile_picture: {
      name: string;
      preview: string | null;
      file: File | null;
    } | null;
    scanned_national_id_or_passport_document: {
      name: string;
      preview: string | null;
      file: File | null;
    } | null;
  }>({
    user_profile_picture: null,
    scanned_national_id_or_passport_document: null,
  });
  const fileInputRefs = {
    profile: useRef<HTMLInputElement>(null),
    scanned: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (userProfile) {
      const mappedData: ProfileFormData = {
        firstName: userProfile.user?.first_name || '',
        lastName: userProfile.user?.last_name || '',
        email: userProfile.user?.email || '',
        phone: userProfile.contact || '',
        address: userProfile.address || '',
        national_id_or_passport_number:
          userProfile.national_id_or_passport_number || '',
        user_profile_picture: userProfile.profile_picture || null,
      };
      setFormData(mappedData);
      setOriginalData(mappedData);
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prevPasswordData) => ({
      ...prevPasswordData,
      [id]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setFiles((prevFiles) => ({
          ...prevFiles,
          [field]: {
            name: file.name,
            preview,
            file,
          },
        }));
        if (field === 'user_profile_picture') {
          setFormData((prevFormData) => ({
            ...prevFormData,
            user_profile_picture: preview,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (field: string) => {
    setFiles((prevFiles) => ({ ...prevFiles, [field]: null }));
  };

  const handleProfileUpdate = async () => {
    if (isUpdating) return;

    // Update all editable fields: firstName, lastName, email, phone, address, and national_id_or_passport_number.
    const keysToUpdate = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'national_id_or_passport_number',
    ];
    const fieldMapping: { [key: string]: string } = {
      firstName: 'firstname',
      lastName: 'lastname',
      email: 'email',
      phone: 'contact',
      address: 'address',
      national_id_or_passport_number: 'national_id_or_passport_number',
    };

    const changedData: { [key: string]: string | File } = {};

    keysToUpdate.forEach((key) => {
      const currentValue = formData[key as keyof typeof formData];
      const originalValue = originalData[key as keyof typeof originalData];
      if (
        currentValue !== null &&
        currentValue !== '' &&
        currentValue !== originalValue
      ) {
        changedData[fieldMapping[key]] = currentValue;
      }
    });

    // Include file uploads if present.
    if (files.user_profile_picture?.file) {
      changedData.user_profile_picture = files.user_profile_picture.file;
    }
    if (files.scanned_national_id_or_passport_document?.file) {
      changedData.national_id_or_passport_document =
        files.scanned_national_id_or_passport_document.file;
    }

    if (Object.keys(changedData).length === 0) {
      toast('No changes to update.');
      return;
    }

    const payload = new window.FormData();
    Object.keys(changedData).forEach((key) => {
      const value = changedData[key];
      if (value instanceof File) {
        payload.append(key, value, value.name);
      } else {
        payload.append(key, value);
      }
    });

    try {
      await updateUserProfile(payload);
      mutate();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async () => {
    if (isChangingPassword) return;
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match!');
      return;
    }
    try {
      await changeUserPassword(passwordData);
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Account Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account preferences and information
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleProfileUpdate}
          disabled={isUpdating}
          className={cn(
            'w-full sm:w-auto',
            isUpdating
              ? 'text-muted-foreground border-muted-foreground'
              : 'text-green-500 border-green-500',
          )}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="flex flex-wrap justify-start h-auto gap-2 mb-8">
          <div className="bg-slate-300/50 w-auto p-1 rounded-sm">
            <TabsTrigger
              value="personal"
              className="flex-grow sm:flex-grow-0 h-10"
            >
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex-grow sm:flex-grow-0 h-10"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex-grow sm:flex-grow-0 h-10"
            >
              Notifications
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoForm
            formData={formData}
            files={files}
            fileInputRefs={fileInputRefs}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            isProfileLoading={isProfileLoading}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityForm
            passwordData={passwordData}
            handlePasswordChange={handlePasswordChange}
            handlePasswordUpdate={handlePasswordUpdate}
            isChangingPassword={isChangingPassword}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
