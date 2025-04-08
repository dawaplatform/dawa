'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PencilIcon } from 'lucide-react';

import InputField from '@/components/shared/InputField';
import CategorySelect from '@/components/shared/CategorySelect';
import ImageUpload from './components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddNewProduct } from '@core/hooks/useProductData';
import { locations } from '@/data/locations';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { selectCategories } from '@redux-store/slices/categories/categories';
import { useSelector } from '@/redux-store/hooks';
import { mutate } from 'swr';
import { toast } from 'sonner';

/** -------------------------------
 *  Define Types & Validation
 *  -------------------------------
 */
type FormValues = {
  item_subcategory_id: string; // Step 1
  location: string; // Step 1
  images: File[]; // Step 1

  item_name: string; // Step 2
  item_price: number; // Step 2
  item_description: string; // Step 2
  negotiation: boolean; // Step 2
};

const schema = yup
  .object({
    // Step 1 Fields
    item_subcategory_id: yup
      .string()
      .required('Category selection is required'),
    location: yup.string().required('Location is required'),
    images: yup
      .array()
      .of(yup.mixed<File>().required())
      .min(1, 'Please upload at least one image')
      .max(5, 'You can upload up to 5 images')
      .required(),

    // Step 2 Fields
    item_name: yup.string().required('Item name is required'),
    item_price: yup
      .number()
      .typeError('Price must be a number')
      .required('Price is required'),
    item_description: yup.string().required('Description is required'),
    negotiation: yup
      .boolean()
      .required('Please indicate if negotiation is open'),
  })
  .required();

export default function PostAdPage() {
  const categories = useSelector(selectCategories);
  const { addProduct, isAdding, error } = useAddNewProduct();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /** --------------------------------
   *   Step Control
   *  --------------------------------
   */
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  /** --------------------------------
   *   React Hook Form Setup
   *  --------------------------------
   */
  const {
    register,
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      item_subcategory_id: '',
      location: '',
      images: [],
      item_name: '',
      item_price: 0,
      item_description: '',
      negotiation: false,
    },
  });

  /** --------------------------------
   *   Submit Handler (Final, Step 2)
   *  --------------------------------
   */
  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('item_subcategory_id', data.item_subcategory_id);
      formData.append('item_location', data.location);
      formData.append('item_name', data.item_name);
      formData.append('item_price', String(data.item_price));
      formData.append('item_description', data.item_description);
      formData.append(
        'item_negotiable',
        String(data.negotiation === true ? 'True' : 'False'),
      );
      data.images.forEach((image) => formData.append('images', image));

      const res = await addProduct(formData as any);

      if (res.status === 201) {
        reset();
        // Show success message and reset form
        toast.success('Your ad has been posted successfully!');
        setSuccessMessage('Your ad has been posted successfully!');
        setTimeout(() => setSuccessMessage(null), 5000);
        setCurrentStep(1);

        // Refetch trending products after successful ad post
        mutate('products');
      } else {
        setSuccessMessage('Failed to post ad. Please try again later.');
        toast.error('Failed to post ad. Please try again later.');
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  /** --------------------------------
   *   Step 1 Validation & Next
   *  --------------------------------
   */
  const handleNextStep = async () => {
    // Only validate Step 1 fields
    const valid = await trigger(['item_subcategory_id', 'location', 'images']);
    if (valid) {
      setCurrentStep(2);
    }
  };

  /** --------------------------------
   *   Step 2 Back to Step 1
   *  --------------------------------
   */
  const handleBackStep = () => {
    setCurrentStep(1);
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="border-b bg-gray-100/50">
            <CardTitle className="text-2xl font-bold text-center">
              Post Your Free Ad
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/**
               * STEP 1 FIELDS
               */}
              {currentStep === 1 && (
                <>
                  {/* Category Field */}
                  <Controller
                    name="item_subcategory_id"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="block font-semibold text-gray-700">
                          Category
                        </label>
                        <CategorySelect
                          categories={(categories as any) || []}
                          onChange={field.onChange}
                          value={field.value}
                          errors={errors.item_subcategory_id?.message}
                        />
                      </div>
                    )}
                  />

                  {/* Location Field */}
                  <div className="space-y-2">
                    <label className="block font-semibold text-gray-700">
                      Location
                    </label>
                    <select
                      {...register('location')}
                      className="w-full h-14 border rounded-lg focus:border-primary_1 focus:outline-none"
                    >
                      <option value="" disabled>
                        Select a location
                      </option>
                      {locations.map((loc, index) => (
                        <option key={index} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    {errors.location && (
                      <p className="text-sm text-red-500">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  {/* Image Upload Field */}
                  <Controller
                    name="images"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        onUpload={(files: File[]) => {
                          field.onChange(files);
                        }}
                        images={field.value}
                        maxImages={5}
                      />
                    )}
                  />
                  {errors.images && (
                    <p className="text-sm text-red-500">
                      {(errors.images.message as string) ||
                        'Please upload images'}
                    </p>
                  )}

                  {/* Step 1 -> Next Button */}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="h-12 bg-primary_1 text-white rounded-md font-bold"
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}

              {/**
               * STEP 2 FIELDS
               */}
              {currentStep === 2 && (
                <>
                  <InputField
                    label="Item Name"
                    icon={PencilIcon}
                    placeholder="Enter item name"
                    errors={errors.item_name?.message}
                    {...register('item_name')}
                  />

                  <InputField
                    label="Price (UGX)"
                    type="number"
                    placeholder="Enter price"
                    errors={errors.item_price?.message}
                    {...register('item_price')}
                  />

                  <div className="space-y-2">
                    <label className="block font-semibold text-gray-700">
                      Description
                    </label>
                    <Textarea
                      {...register('item_description')}
                      className="min-h-[120px] resize-none"
                      placeholder="Describe your item in detail..."
                    />
                    {errors.item_description && (
                      <p className="text-sm text-red-500">
                        {errors.item_description.message}
                      </p>
                    )}
                  </div>

                  <Controller
                    name="negotiation"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <div className="flex flex-col gap-4">
                          <Label className="block text-sm font-semibold text-gray-700">
                            Are you open to negotiation?
                          </Label>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <Checkbox
                                checked={field.value === true}
                                onCheckedChange={(checked) => {
                                  field.onChange(!!checked);
                                }}
                                className="border-orange-500 text-orange-500"
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2">
                              <Checkbox
                                checked={field.value === false}
                                onCheckedChange={(checked) => {
                                  // If user clicks again, keep false
                                  field.onChange(false);
                                }}
                                className="border-orange-500 text-orange-500"
                              />
                              No
                            </label>
                          </div>
                        </div>
                        {errors.negotiation && (
                          <p className="text-sm text-red-500">
                            {errors.negotiation.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  {error && (
                    <p className="text-red-500 text-center">
                      Error: {error.message}
                    </p>
                  )}
                  {successMessage && (
                    <p className="text-green-500 text-center">
                      {successMessage}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {/* Step 2 -> Back Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackStep}
                      className="h-12 rounded-md font-bold"
                    >
                      Back
                    </Button>

                    {/* Submit (Post Ad) Button */}
                    <Button
                      type="submit"
                      disabled={isAdding}
                      className="h-12 bg-primary_1 text-white py-3 rounded-md font-bold hover:bg-primary_1-dark transition-colors"
                    >
                      {isAdding ? 'Posting...' : 'Post Ad'}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
