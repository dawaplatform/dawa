'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, UserX } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export interface DataPrivacyFormProps {
  onDeleteMyData: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  isDeletingMyData: boolean;
  isDeletingAccount: boolean;
}

export const DataPrivacyForm: React.FC<DataPrivacyFormProps> = ({
  onDeleteMyData,
  onDeleteAccount,
  isDeletingMyData,
  isDeletingAccount,
}) => {
  const [deleteDataOpen, setDeleteDataOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const handleDeleteMyData = async () => {
    await onDeleteMyData();
    setDeleteDataOpen(false);
  };

  const handleDeleteAccount = async () => {
    await onDeleteAccount();
    setDeleteAccountOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-muted-foreground" />
              Delete my data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Request deletion or anonymization of your personal data (e.g. for
              privacy or GDPR). You may be signed out after this.
            </p>
            <Button
              variant="outline"
              className="text-amber-600 border-amber-600 hover:bg-amber-50"
              onClick={() => setDeleteDataOpen(true)}
              disabled={isDeletingMyData || isDeletingAccount}
            >
              {isDeletingMyData ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Delete my data'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <UserX className="h-5 w-5" />
              Delete account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This
              cannot be undone. You will be signed out immediately.
            </p>
            <Button
              variant="destructive"
              onClick={() => setDeleteAccountOpen(true)}
              disabled={isDeletingMyData || isDeletingAccount}
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting account...
                </>
              ) : (
                'Delete account'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDataOpen} onOpenChange={setDeleteDataOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete my data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will request deletion or anonymization of your personal data.
              You may be signed out. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteMyData();
              }}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isDeletingMyData ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete my data'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Your account and all associated data will be permanently removed.
              This action cannot be undone. You will be signed out immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAccount();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingAccount ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Yes, delete my account'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
