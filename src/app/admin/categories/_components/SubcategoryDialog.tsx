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
import { ChevronDown, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
    return selectedCategory ? selectedCategory.category_name : 'Select a category';
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setIsCategoryDropdownOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-hide">
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
          <div className="relative" ref={dropdownRef}>
            <Label htmlFor="categorySelect">Parent Category</Label>
            <Button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full justify-between h-10 mt-1 border rounded-md focus:border-primary_1 focus:outline-none"
              variant="outline"
            >
              {getSelectedCategoryName()}
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${
                  isCategoryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>

            {isCategoryDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="max-h-60 overflow-auto scrollbar-hide">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full p-2 text-left hover:bg-gray-100 text-sm"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      {category.category_name}
                    </button>
                  ))}
                </div>
              </div>
            )}
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