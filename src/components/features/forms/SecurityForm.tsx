import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface PasswordData {
  confirm_password: string;
  new_password: string;
  old_password: string;
}

interface SecurityFormProps {
  passwordData: PasswordData;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordUpdate: () => Promise<void>;
  isChangingPassword: boolean;
}

export const SecurityForm: React.FC<SecurityFormProps> = ({
  passwordData,
  handlePasswordChange,
  handlePasswordUpdate,
  isChangingPassword,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordUpdate();
          }}
        >
          <FormField
            label="Current Password"
            id="old_password"
            type="password"
            value={passwordData.old_password}
            onChange={handlePasswordChange}
          />
          <FormField
            label="New Password"
            id="new_password"
            type="password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
          />
          <FormField
            label="Confirm New Password"
            id="confirm_password"
            type="password"
            value={passwordData.confirm_password}
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            disabled={isChangingPassword}
            className="w-full"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="h-10"
    />
  </div>
);
