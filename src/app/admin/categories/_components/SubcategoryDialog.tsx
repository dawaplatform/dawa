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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { UploadButton } from '../../../../../utils/uploadthing';
import { ExtraFields } from './ExtraFields';
import { SubcategoryDialogProps } from './types';

export const SubcategoryDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  subcategoryName,
  setSubcategoryName,
  selectedCategoryId,
  setSelectedCategoryId,
  subcategoryImageUrl,
  setSubcategoryImageUrl,
  extraFields,
  setExtraFields,
  categories,
  title,
  description,
  submitButtonText,
}: SubcategoryDialogProps) => {
  const handleAddExtraField = () => {
    setExtraFields([...extraFields, { name: '', required: false }]);
  };

  const handleRemoveExtraField = (idx: number) => {
    setExtraFields(extraFields.filter((_, i) => i !== idx));
  };

  const handleExtraFieldNameChange = (idx: number, value: string) => {
    setExtraFields(
      extraFields.map((field, i) =>
        i === idx ? { ...field, name: value } : field
      )
    );
  };

  const handleExtraFieldRequiredChange = (idx: number, value: boolean) => {
    setExtraFields(
      extraFields.map((field, i) =>
        i === idx ? { ...field, required: value } : field
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="subcategoryName">Subcategory Name</Label>
            <Input
              id="subcategoryName"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              placeholder="Enter subcategory name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="categorySelect">Parent Category</Label>
            <Select
              value={selectedCategoryId?.toString()}
              onValueChange={value => setSelectedCategoryId(Number(value))}
            >
              <SelectTrigger id="categorySelect" className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent
                className="overflow-y-auto"
                position="popper"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subcategory Image</Label>
            <UploadButton
              endpoint="subcategoryImage"
              onClientUploadComplete={(res: any) => {
                if (res && res[0]?.url) setSubcategoryImageUrl(res[0].url);
              }}
              onUploadError={(error: any) => {
                toast({ title: "Upload failed", description: error.message, variant: "destructive" });
              }}
              appearance={{
                button: "bg-orange-500 hover:bg-orange-600 text-white p-2",
              }}
            />
            {subcategoryImageUrl && (
              <div className="flex items-center gap-2 mt-2">
                <img src={subcategoryImageUrl} alt="Subcategory" className="w-24 h-24 object-contain rounded" />
                <Button type="button" size="icon" variant="destructive" onClick={() => setSubcategoryImageUrl('')} aria-label="Remove image">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
          <ExtraFields
            extraFields={extraFields}
            onAddField={handleAddExtraField}
            onRemoveField={handleRemoveExtraField}
            onFieldNameChange={handleExtraFieldNameChange}
            onFieldRequiredChange={handleExtraFieldRequiredChange}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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