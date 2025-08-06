'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { UploadButton } from '../../../../../utils/uploadthing';
import { CategoryDialogProps } from './types';

export const CategoryDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  categoryName,
  setCategoryName,
  categoryImageUrl,
  setCategoryImageUrl,
  title,
  description,
  submitButtonText,
}: CategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setCategoryImageUrl('');
      }
    }}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-hide">
          <div>
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Category Image</Label>
            <UploadButton
              endpoint="categoryImage"
              onClientUploadComplete={res => {
                if (res && res[0]?.url) setCategoryImageUrl(res[0].url);
              }}
              onUploadError={error => {
                toast({ title: "Upload failed", description: error.message, variant: "destructive" });
              }}
              appearance={{
                button: "bg-orange-500 hover:bg-orange-600 text-white p-2",
              }}
            />
            {categoryImageUrl && (
              <div className="flex items-center gap-2 mt-2">
                <img src={categoryImageUrl} alt="Category" className="w-24 h-24 object-contain rounded" />
                <Button type="button" size="icon" variant="destructive" onClick={() => setCategoryImageUrl('')} aria-label="Remove image">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setCategoryImageUrl('');
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};