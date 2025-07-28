'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { PencilIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FieldErrors, Resolver, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useAuth } from '@/@core/hooks/use-auth';
import CategorySelect from '@/components/shared/CategorySelect';
import InputField from '@/components/shared/InputField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { locations } from '@/data/locations';
import { useSelector } from '@/redux-store/hooks';
import { useAddNewProduct } from '@core/hooks/useProductData';
import { selectCategories } from '@redux-store/slices/categories/categories';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { mutate } from 'swr';
import ImageUpload from './components/ImageUpload';

/** -------------------------------
 *  Define Types & Validation
 *  -------------------------------
 */
export type MetadataField = {
  name: string;
  required: boolean;
};

export type DynamicMeta = {
  [key: `meta_${string}`]: string;
};

export interface FormValues extends DynamicMeta {
  item_subcategory_id: string; // Step 1
  location: string; // Step 1
  images: File[]; // Step 1

  item_name: string; // Step 2
  item_price: number; // Step 2
  item_description: string; // Step 2
  negotiation: boolean; // Step 2
}

type Category = {
  id: string | number;
  subcategories?: Subcategory[];
};

type Subcategory = {
  id: string | number;
  metadata?: MetadataField[];
};

function getSubcategoryMetadata(
  categories: Category[],
  subcategoryId: string
): MetadataField[] {
  for (const category of categories) {
    if (category.subcategories) {
      for (const sub of category.subcategories) {
        if (String(sub.id) === String(subcategoryId)) {
          if (Array.isArray(sub.metadata)) {
            return sub.metadata;
          }
        }
      }
    }
  }
  return [];
}

function buildSchema(metadataFields: MetadataField[]) {
  // Step 1 fields
  const shape: Record<string, yup.AnySchema> = {
    item_subcategory_id: yup.string().required('Category selection is required'),
    location: yup.string().required('Location is required'),
    images: yup
      .array()
      .of(yup.mixed<File>().required())
      .min(1, 'Please upload at least one image')
      .max(5, 'You can upload up to 5 images')
      .required(),
    // Step 2 fields
    item_name: yup.string().required('Item name is required'),
    item_price: yup
      .number()
      .typeError('Price must be a number')
      .required('Price is required'),
    item_description: yup.string().required('Description is required'),
    negotiation: yup
      .boolean()
      .required('Please indicate if negotiation is open'),
  };

  // Add dynamic metadata fields
  for (const meta of metadataFields) {
    const key = `meta_${meta.name}`;
    if (meta.required) {
      shape[key] = yup.string().required(`${meta.name} is required`);
    } else {
      shape[key] = yup.string().notRequired();
    }
  }

  return yup.object().shape(shape).required();
}

export default function PostAdPage() {
  const categories = useSelector(selectCategories) as Category[];
  const { addProduct, isAdding, error } = useAddNewProduct();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  /** --------------------------------
   *   Step Control
   *  --------------------------------
   */
  

  /** --------------------------------
   *   Metadata State
   *  --------------------------------
   */
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);

  /** --------------------------------
   *   React Hook Form Setup
   *  --------------------------------
   */
  // We need to update the schema dynamically based on metadataFields
  const schema = useMemo(() => buildSchema(metadataFields), [metadataFields]);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<FormValues>,
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

  // Watch subcategory selection to update metadata fields
  const selectedSubcategoryId = watch('item_subcategory_id');

  useEffect(() => {
    if (selectedSubcategoryId && categories && typeof categories === 'object') {
      const meta = getSubcategoryMetadata(categories, selectedSubcategoryId);
      setMetadataFields(meta || []);
      // Optionally, clear previous meta fields if subcategory changes
      if (meta && meta.length > 0) {
        for (const m of meta) {
          setValue(`meta_${m.name}` as keyof FormValues, '');
        }
      }
    } else {
      setMetadataFields([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubcategoryId, categories, setValue]);

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

      const metadataObj: Record<string, string> = {};
      for (const meta of metadataFields) {
        const key = `meta_${meta.name}` as keyof FormValues;
        if (typeof data[key] !== 'undefined') {
          metadataObj[meta.name] = data[key] as string;
        }
      }
      formData.append('metadata', JSON.stringify(metadataObj));

      const res = await addProduct(formData as any);

      toast.success('Your product has been posted successfully and is pending approval!');
      router.push('/');

      if (res && res.status === 201) {
        if (user?.email && user?.name) {
          fetch('/api/send-email/pending-approval', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_name: user.name,
              user_email: user.email,
              item_name: data.item_name,
            }),
          })
        }
        mutate('products');
      } else {
        toast.error('Failed to post ad. Please try again later.');
      }
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  

  // Helper for dynamic meta field errors
  function getMetaError(
    errors: FieldErrors<FormValues>,
    metaName: string
  ): string | undefined {
    const key = `meta_${metaName}` as keyof FormValues;
    const err = errors[key];
    if (err && typeof err === 'object' && 'message' in err) {
      return (err as { message?: string }).message;
    }
    return undefined;
  }

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
                        categories={categories as any} // Type assertion to bypass type mismatch
                        onChange={field.onChange}
                        value={field.value}
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
                    {locations.map((loc: { name: string }, index: number) => (
                      <option key={index} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="text-sm text-red-500">
                      {errors.location.message as string}
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
                    {typeof errors.images.message === 'string'
                      ? errors.images.message
                      : 'Please upload images'}
                  </p>
                )}

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
                      {errors.item_description.message as string}
                    </p>
                  )}
                </div>

                {/* Dynamic Metadata Fields */}
                {metadataFields && metadataFields.length > 0 && (
                  <div className="space-y-4">
                    {metadataFields.map((meta) => (
                      <div key={meta.name} className="space-y-2">
                        <label className="block font-semibold text-gray-700">
                          {meta.name}
                          {meta.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                          type="text"
                          {...register(`meta_${meta.name}` as const)}
                          className="w-full h-12 border rounded-lg px-3 focus:border-primary_1 focus:outline-none"
                          placeholder={`Enter ${meta.name}`}
                        />
                        {getMetaError(errors, meta.name) && (
                          <p className="text-sm text-red-500">
                            {getMetaError(errors, meta.name)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

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
                              onCheckedChange={() => {
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
                          {errors.negotiation.message as string}
                        </p>
                      )}
                    </div>
                  )}
                />

                {error && (
                  <p className="text-red-500 text-center">
                    Error: {error.message as string}
                  </p>
                )}
                {successMessage && (
                  <p className="text-green-500 text-center">
                    {successMessage}
                  </p>
                )}

                {/* Submit (Post Ad) Button */}
                <Button
                  type="submit"
                  disabled={isAdding}
                  className="h-12 w-full bg-primary_1 text-white py-3 rounded-md font-bold hover:bg-primary_1-dark transition-colors"
                >
                  {isAdding ? 'Posting...' : 'Post Ad'}
                </Button>
              </>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
