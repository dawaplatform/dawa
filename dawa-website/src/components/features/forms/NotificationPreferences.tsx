import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const NotificationPreferences: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <NotificationOption
            id="email-notifications"
            title="Email Notifications"
            description="Receive notifications via email"
          />
          <NotificationOption
            id="sms-notifications"
            title="SMS Notifications"
            description="Receive notifications via SMS"
          />
        </form>
      </CardContent>
    </Card>
  );
};

interface NotificationOptionProps {
  id: string;
  title: string;
  description: string;
}

const NotificationOption: React.FC<NotificationOptionProps> = ({
  id,
  title,
  description,
}) => (
  <div className="flex items-center justify-between">
    <div>
      <Label htmlFor={id}>{title}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch disabled={true} id={id} />
  </div>
);
