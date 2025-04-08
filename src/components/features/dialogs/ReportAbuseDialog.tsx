'use client';

import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useIsMobile from '@/@core/hooks/useIsMobile';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useReportAbuse } from '@core/hooks/useProductData';

// Define the valid reason types
const VALID_REASONS = [
  'Fake',
  'Damaged',
  'Fraudulent',
  'Illegal',
  'Other',
] as const;
type ReasonType = (typeof VALID_REASONS)[number];

interface ReportAbuseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
}

// Define form values interface
interface ReportAbuseFormValues {
  reason: ReasonType;
  otherReason: string;
  description: string;
}

// Define the schema
const schema: yup.ObjectSchema<ReportAbuseFormValues> = yup.object({
  reason: yup
    .string()
    .required('Reason is required')
    .oneOf(VALID_REASONS, 'Invalid reason') as yup.Schema<ReasonType>,
  otherReason: yup.string().when('reason', {
    is: (val: string) => val === 'Other',
    then: (schema) => schema.required('Please specify the reason'),
    otherwise: (schema) => schema.optional(),
  }),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
}) as yup.ObjectSchema<ReportAbuseFormValues>;

const ReportAbuseDialog: React.FC<ReportAbuseDialogProps> = ({
  open,
  onOpenChange,
  itemId,
}) => {
  const isMobile = useIsMobile();
  const { reportAbuse, isLoading, error } = useReportAbuse();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReportAbuseFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      reason: 'Fake',
      otherReason: '',
      description: '',
    },
  });

  const reasonWatch = watch('reason');

  const onSubmit: SubmitHandler<ReportAbuseFormValues> = async (data) => {
    try {
      await reportAbuse({
        item_id: itemId,
        reason: data.reason === 'Other' ? data.otherReason : data.reason,
        description: data.description,
      });

      // Show success toast
      toast.success('Report submitted successfully!');

      // Reset form and close dialog/sheet
      reset();
      onOpenChange(false);
    } catch (err: any) {
      console.error('Error submitting report:', err);
      toast.error('Failed to submit the report. Please try again.');
    }
  };

  // Close logic: reset form if closing
  const handleDialogClose = (openValue: boolean) => {
    if (!openValue) {
      reset();
    }
    onOpenChange(openValue);
  };

  // Shared form content
  const FormContent = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Report</Label>
        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value: ReasonType) => field.onChange(value)}
              value={field.value}
            >
              <SelectTrigger id="reason" className="w-full">
                <span>{field.value}</span>
              </SelectTrigger>
              <SelectContent>
                {VALID_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.reason && (
          <p className="text-red-500 text-sm">{errors.reason.message}</p>
        )}
      </div>

      {reasonWatch === 'Other' && (
        <div className="space-y-2">
          <Label htmlFor="otherReason">Please specify the reason</Label>
          <Textarea
            id="otherReason"
            {...register('otherReason')}
            rows={2}
            className="resize-none"
          />
          {errors.otherReason && (
            <p className="text-red-500 text-sm">{errors.otherReason.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Detailed Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          rows={4}
          placeholder="Please provide specific details about the issue..."
          className="resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-red-700">Error: {error.message}</p>
        </div>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDialogClose(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary_1 hover:bg-primary_1/90"
        >
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </DialogFooter>
    </form>
  );

  // MOBILE VIEW: Use bottom Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleDialogClose}>
        <SheetContent
          side="bottom"
          className="flex flex-col rounded-t-3xl max-h-[90vh] overflow-y-auto pb-safe"
        >
          <SheetHeader>
            <SheetTitle>Report Abuse</SheetTitle>
            <SheetDescription>
              Please provide details about the issue you encountered with this
              product.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1">
            <FormContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // DESKTOP VIEW: Use Dialog
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report Abuse</DialogTitle>
          <DialogDescription>
            Please provide details about the issue you encountered with this
            product.
          </DialogDescription>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default ReportAbuseDialog;
