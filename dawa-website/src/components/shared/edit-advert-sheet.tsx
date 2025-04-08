'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  useUpdateProduct,
  useDeleteItemImage,
} from '@core/hooks/useProductData';
import { toast } from 'sonner';
import { X, Loader2, ImageIcon, Upload } from 'lucide-react';
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
import { selectCategories } from '@/redux-store/slices/categories/categories';
import CategorySelect from '@/components/shared/CategorySelect';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ImageSkeleton } from './ImageSkeleton';
import { LocationDialog } from '@/components/features/dialogs/location-dialog';
import { locations } from '@/data/locations';
import { AnimatePresence, motion } from 'framer-motion';

interface EditAdvertSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onUpdate: () => void;
}

interface FormDataState {
  item_id: number;
  item_name: string;
  item_price: number;
  item_subcategory: number | null;
  item_description: string;
  item_location: string;
  item_negotiable: boolean;
  item_status: string;
}

/**
 * Look up the subcategory id using the item data and available categories.
 * If the item provides a subcategory id (item.subcategory_id), that is used.
 * Otherwise, if the item provides a subcategory name (item.subcategory), we try to
 * find a matching subcategory (case-insensitive) in the categories data.
 */
function getSubcategoryId(item: any, categories: any[]): number | null {
  if (item.subcategory_id) {
    return Number(item.subcategory_id);
  }
  if (item.subcategory && Array.isArray(categories)) {
    for (const cat of categories) {
      if (cat.subcategories && Array.isArray(cat.subcategories)) {
        const match = cat.subcategories.find(
          (sub: any) =>
            sub.subcategory_name.toLowerCase() ===
            item.subcategory.toLowerCase(),
        );
        if (match) return Number(match.id);
      }
    }
  }
  return null;
}

export function EditAdvertSheet({
  isOpen,
  onClose,
  item,
  onUpdate,
}: EditAdvertSheetProps) {
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct();
  const { deleteItemImage } = useDeleteItemImage();
  const categories = useSelector(selectCategories);

  // Initialize form state using getSubcategoryId to set item_subcategory.
  const [formData, setFormData] = useState<FormDataState>({
    item_id: item.id,
    item_name: item.name,
    item_price: item.price,
    item_subcategory: getSubcategoryId(item, categories),
    item_description: item.description,
    item_location: item.location,
    item_negotiable: item.item_negotiable,
    item_status: item.status || 'Available',
  });
  const [images, setImages] = useState(item.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imagesLoading, setImagesLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  // Whenever the incoming "item" or "categories" change, update the form state.
  useEffect(() => {
    setFormData({
      item_id: item.id,
      item_name: item.name,
      item_price: item.price,
      item_subcategory: getSubcategoryId(item, categories),
      item_description: item.description,
      item_location: item.location,
      item_negotiable: item.item_negotiable,
      item_status: item.status || 'Available',
    });
    setImages(item.images || []);
    setNewImages([]);
    setErrors({});
  }, [item, categories]);

  // Store the initial form data to compare later for changes.
  const initialFormDataRef = useRef<FormDataState>(formData);
  useEffect(() => {
    initialFormDataRef.current = {
      item_id: item.id,
      item_name: item.name,
      item_price: item.price,
      item_subcategory: getSubcategoryId(item, categories),
      item_description: item.description,
      item_location: item.location,
      item_negotiable: item.item_negotiable,
      item_status: item.status || 'Available',
    };
  }, [item, categories]);

  // Simulate image loading delay (e.g. for a skeleton)
  useEffect(() => {
    const timer = setTimeout(() => {
      setImagesLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'item_price' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (subcategoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      item_subcategory: Number(subcategoryId),
    }));
    if (errors.item_subcategory) {
      setErrors((prev) => ({ ...prev, item_subcategory: '' }));
    }
  };

  const handleLocationSelect = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      item_location: location,
    }));
    if (errors.item_location) {
      setErrors((prev) => ({ ...prev, item_location: '' }));
    }
  };

  const handleDeleteImage = (imageId: number) => {
    setImageToDelete(imageId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteImage = async () => {
    if (imageToDelete) {
      try {
        await deleteItemImage({ image_id: imageToDelete });
        setImages((prevImages: any) =>
          prevImages.filter((img: any) => img.image_id !== imageToDelete),
        );
        toast.success('Image deleted successfully');
        onUpdate();
      } catch (error: any) {
        toast.error('Failed to delete image');
      } finally {
        setImageToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages((prev) => [
        ...prev,
        ...Array.from(e.target.files as FileList),
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.item_subcategory) {
      setErrors((prev) => ({
        ...prev,
        item_subcategory: 'Please select a valid category',
      }));
      toast.error('Please select a valid category');
      return;
    }

    try {
      const initial = initialFormDataRef.current;
      const changedFields: Partial<FormDataState> = {};
      changedFields.item_id = formData.item_id;
      if (formData.item_name !== initial.item_name) {
        changedFields.item_name = formData.item_name;
      }
      if (formData.item_price !== initial.item_price) {
        changedFields.item_price = formData.item_price;
      }
      if (formData.item_subcategory !== initial.item_subcategory) {
        changedFields.item_subcategory = formData.item_subcategory;
      }
      if (formData.item_description !== initial.item_description) {
        changedFields.item_description = formData.item_description;
      }
      if (formData.item_location !== initial.item_location) {
        changedFields.item_location = formData.item_location;
      }
      if (formData.item_negotiable !== initial.item_negotiable) {
        changedFields.item_negotiable = formData.item_negotiable;
      }
      if (formData.item_status !== initial.item_status) {
        changedFields.item_status = formData.item_status;
      }

      const form = new FormData();
      Object.entries(changedFields).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          form.append(key, value ? 'True' : 'False');
        } else {
          form.append(key, value?.toString() || '');
        }
      });
      newImages.forEach((file) => {
        form.append('images', file);
      });

      await updateProduct(form);
      toast.success('Advert updated successfully');
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error('Failed to update advert');
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 bg-background"
        >
          <ScrollArea className="h-full px-6">
            <SheetHeader className="sticky w-full top-0 z-10 bg-background pt-6 pb-4">
              <SheetTitle>Edit Advert</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-4 top-4"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
              <SheetDescription className="mt-1 text-sm text-gray-600">
                Make changes to your advert here. Click save when you&apos;re
                done.
              </SheetDescription>
              <Separator className="mt-4" />
            </SheetHeader>

            <form className="space-y-6 pb-6" onSubmit={handleSubmit}>
              <ImageSection
                images={images}
                newImages={newImages}
                formData={formData}
                handleDeleteImage={handleDeleteImage}
                handleImageUpload={handleImageUpload}
                setNewImages={setNewImages}
                isLoading={imagesLoading}
              />

              <div className="space-y-4">
                <CategorySelect
                  categories={(categories as any) || []}
                  value={
                    formData.item_subcategory !== null
                      ? formData.item_subcategory.toString()
                      : ''
                  }
                  onChange={handleCategoryChange}
                  errors={errors.item_subcategory}
                />

                <FormField
                  id="item_name"
                  label="Title"
                  value={formData.item_name}
                  onChange={handleInputChange}
                  error={errors.item_name}
                  required
                />

                <FormField
                  id="item_price"
                  label="Price (UGX)"
                  type="number"
                  value={formData.item_price}
                  onChange={handleInputChange}
                  error={errors.item_price}
                  required
                />

                <SelectField
                  id="item_status"
                  label="Status"
                  value={formData.item_status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      item_status: e.target.value,
                    }))
                  }
                  options={[
                    { value: 'Available', label: 'Available' },
                    { value: 'Sold', label: 'Sold' },
                  ]}
                  required
                />

                <div>
                  <Label htmlFor="item_location" className="mb-1">
                    Location
                  </Label>
                  <LocationDialog
                    locations={locations}
                    selectedLocation={formData.item_location}
                    onLocationSelect={handleLocationSelect}
                  />
                  {errors.item_location && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.item_location}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="item_description">Description</Label>
                  <Textarea
                    id="item_description"
                    name="item_description"
                    value={formData.item_description}
                    onChange={handleInputChange}
                    className="mt-1.5 min-h-[100px]"
                    required
                  />
                  {errors.item_description && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.item_description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="item_negotiable">Negotiable</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow buyers to negotiate the price
                    </p>
                  </div>
                  <Switch
                    id="item_negotiable"
                    name="item_negotiable"
                    checked={formData.item_negotiable}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        item_negotiable: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
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
            </form>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteImage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface ImageSectionProps {
  images: any[];
  newImages: File[];
  formData: FormDataState;
  handleDeleteImage: (id: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setNewImages: React.Dispatch<React.SetStateAction<File[]>>;
  isLoading: boolean;
}

function ImageSection({
  images,
  newImages,
  formData,
  handleDeleteImage,
  handleImageUpload,
  setNewImages,
  isLoading,
}: ImageSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Label>Images</Label>
        <ImageSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label>Images</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <AnimatePresence>
          {images.map((image: any) => (
            <motion.div
              key={image.image_id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative group aspect-square"
            >
              <Image
                src={image.image_url || '/placeholder.svg'}
                alt={formData.item_name}
                fill
                className="object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                type="button"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteImage(image.image_id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
          {newImages.map((file, index) => (
            <motion.div
              key={`new-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative group aspect-square"
            >
              <Image
                src={URL.createObjectURL(file) || '/placeholder.svg'}
                alt={`New upload ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() =>
                  setNewImages(newImages.filter((_, i) => i !== index))
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        {images.length === 0 && newImages.length === 0 && (
          <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
            <ImageIcon className="h-8 w-8 mb-2" />
            <p className="text-sm">No images available</p>
          </div>
        )}
        <label
          htmlFor="new-images"
          className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
        >
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Upload
              <br />
              New Image
            </p>
          </div>
          <input
            id="new-images"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </label>
      </div>
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  required?: boolean;
}

function FormField({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  required = false,
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1.5"
        required={required}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  options: { value: string; label: string }[];
  required?: boolean;
}

function SelectField({
  id,
  label,
  value,
  onChange,
  error,
  options,
  required = false,
}: SelectFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="mt-1.5 block w-full rounded-md border border-gray-300 p-2"
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
