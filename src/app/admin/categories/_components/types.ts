import { CategoryData, SubcategoryData } from '@/app/server/admin/api';

export type ExtraField = {
  name: string;
  required: boolean;
};

export type CategoryDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  categoryName: string;
  setCategoryName: (name: string) => void;
  categoryImageUrl: string;
  setCategoryImageUrl: (url: string) => void;
  extraFields?: ExtraField[];
  setExtraFields?: (fields: ExtraField[]) => void;
  title: string;
  description: string;
  submitButtonText: string;
};

export type SubcategoryDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  subcategoryName: string;
  setSubcategoryName: (name: string) => void;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number) => void;
  subcategoryImageUrl: string;
  setSubcategoryImageUrl: (url: string) => void;
  extraFields: ExtraField[];
  setExtraFields: (fields: ExtraField[]) => void;
  categories: CategoryData[];
  title: string;
  description: string;
  submitButtonText: string;
};

export type DeleteDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  title: string;
  description: string;
};

export type CategoryTableProps = {
  categories: CategoryData[];
  onEdit: (category: CategoryData) => void;
  onDelete: (category: CategoryData) => void;
  isUpdating: boolean;
  isDeleting: boolean;
};

export type SubcategoryTableProps = {
  subcategories: SubcategoryData[];
  onEdit: (subcategory: SubcategoryData) => void;
  onDelete: (subcategory: SubcategoryData) => void;
  isUpdating: boolean;
  isDeleting: boolean;
};

export type ExtraFieldsProps = {
  extraFields: ExtraField[];
  onAddField: () => void;
  onRemoveField: (idx: number) => void;
  onFieldNameChange: (idx: number, value: string) => void;
  onFieldRequiredChange: (idx: number, value: boolean) => void;
};