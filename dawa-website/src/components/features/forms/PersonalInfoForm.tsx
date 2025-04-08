import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Camera } from 'lucide-react';
import type React from 'react';
import type { ProfileFormData } from '@/views/pages/account/views/settings/SettingsPage';

interface FileData {
  name: string;
  preview: string | null;
  file: File | null;
}

interface PersonalInfoFormProps {
  formData: ProfileFormData;
  files: {
    user_profile_picture: FileData | null;
    scanned_national_id_or_passport_document: FileData | null;
  };
  fileInputRefs: {
    profile: React.RefObject<HTMLInputElement>;
    scanned: React.RefObject<HTMLInputElement>;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => void;
  removeFile: (field: string) => void;
  isProfileLoading: boolean;
}

/**
 * PersonalInfoForm
 * - Displays the avatar upload.
 * - Shows personal info fields.
 * - (Scanned Document upload section commented out for now)
 */
export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  files,
  fileInputRefs,
  handleInputChange,
  handleFileChange,
  removeFile,
  isProfileLoading,
}) => {
  // Helper: format bytes into a human-readable string.
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Generate initials for the avatar fallback.
  const getInitials = () => {
    const name = `${formData.firstName}`.toUpperCase();
    return name.match(/\b\w/g)?.join('') || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* =============== Avatar Upload =============== */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={
                    files.user_profile_picture?.preview ||
                    formData.user_profile_picture ||
                    undefined
                  }
                  alt={`${formData.firstName} ${formData.lastName}`}
                />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                type="button"
                onClick={() => fileInputRefs.profile.current?.click()}
                className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRefs.profile}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'user_profile_picture')}
              />
            </div>
          </div>

          {/* =============== Personal Info Fields =============== */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="First Name"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isProfileLoading}
            />
            <FormField
              label="Last Name"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isProfileLoading}
            />
            <FormField
              label="Email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              disabled={isProfileLoading}
            />
            <FormField
              label="Phone Number"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              type="tel"
              disabled={isProfileLoading}
            />
            <FormField
              label="Address"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isProfileLoading}
            />
            <FormField
              label="National ID or Passport Number"
              id="national_id_or_passport_number"
              value={formData.national_id_or_passport_number}
              onChange={handleInputChange}
              disabled={isProfileLoading}
            />
          </div>

          {/*
          // =============== Document Upload (Simple Input) ===============
          <div className="space-y-2">
            <Label>Scanned Document</Label>
            <div className="border rounded-lg p-4 space-y-4">
              {files.scanned_national_id_or_passport_document ? (
                <div className="relative">
                  {files.scanned_national_id_or_passport_document.file &&
                  files.scanned_national_id_or_passport_document.file.type.startsWith(
                    'image/',
                  ) ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={
                          files.scanned_national_id_or_passport_document
                            .preview || ''
                        }
                        alt="Uploaded document preview"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="rounded-md"
                      />
                    </div>
                  ) : null}
                  <div className="mt-2 flex flex-col">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">
                        {files.scanned_national_id_or_passport_document.name}
                      </span>
                    </div>
                    {files.scanned_national_id_or_passport_document.file && (
                      <span className="text-xs text-muted-foreground">
                        {formatBytes(
                          files.scanned_national_id_or_passport_document.file.size,
                        )}
                      </span>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-0 right-0"
                    onClick={() =>
                      removeFile('scanned_national_id_or_passport_document')
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRefs.scanned.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              )}
              <input
                ref={fileInputRefs.scanned}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    'scanned_national_id_or_passport_document',
                  )
                }
              />
            </div>
          </div>
          */}
        </form>
      </CardContent>
    </Card>
  );
};

/* =============== FormField Component =============== */
interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  disabled = false,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn('h-10', disabled && 'cursor-not-allowed')}
    />
  </div>
);
