'use client';

import {
  CategoryData,
  SubcategoryData,
  useAddCategory,
  useAddSubcategory,
  useAdminCategories,
  useAdminSubcategories,
  useDeleteCategory,
  useDeleteSubcategory,
  useUpdateCategory,
  useUpdateSubcategory,
} from '@/app/server/admin/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import {
  CategoryDialog,
  CategoryTable,
  DeleteDialog,
  ErrorState,
  ExtraField,
  LoadingState,
  SubcategoryDialog,
  SubcategoryTable,
} from './_components';

// Using ExtraField type from _components

const AdminCategoriesPage = () => {
  // State for categories
  const [activeTab, setActiveTab] = useState('categories');
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});

  // State for editing categories
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryImageUrl, setEditCategoryImageUrl] = useState('');

  // State for extra fields in Add Category dialog and Subcategory dialogs
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);

  // State for subcategories
  const [isAddSubcategoryDialogOpen, setIsAddSubcategoryDialogOpen] = useState(false);
  const [isEditSubcategoryDialogOpen, setIsEditSubcategoryDialogOpen] = useState(false);
  const [isDeleteSubcategoryDialogOpen, setIsDeleteSubcategoryDialogOpen] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryData | null>(
    null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // State for editing subcategories
  const [editSubcategoryId, setEditSubcategoryId] = useState<number | null>(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  const [editSubcategoryCategoryId, setEditSubcategoryCategoryId] = useState<number | null>(null);
  const [editExtraFields, setEditExtraFields] = useState<ExtraField[]>([]);
  const [editSubcategoryImageUrl, setEditSubcategoryImageUrl] = useState('');

  // State for image URLs
  const [categoryImageUrl, setCategoryImageUrl] = useState('');
  const [subcategoryImageUrl, setSubcategoryImageUrl] = useState('');

  // 1. Add state for category search in subcategory dialogs
  const [categorySearch, setCategorySearch] = useState('');

  // SWR hooks for categories
  const {
    categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    mutate: mutateCategories
  } = useAdminCategories();

  const { addCategory, isAdding: isAddingCategory } = useAddCategory();
  const { updateCategory, isUpdating: isUpdatingCategory } = useUpdateCategory();
  const { deleteCategory, isDeleting: isDeletingCategory } = useDeleteCategory();

  // SWR hooks for subcategories
  const {
    subcategories,
    isLoading: isSubcategoriesLoading,
    isError: isSubcategoriesError,
    mutate: mutateSubcategories
  } = useAdminSubcategories();

  const { addSubcategory, isAdding: isAddingSubcategory } = useAddSubcategory();
  const { updateSubcategory, isUpdating: isUpdatingSubcategory } = useUpdateSubcategory();
  const { deleteSubcategory, isDeleting: isDeletingSubcategory } = useDeleteSubcategory();

  // Category handlers
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addCategory({
        category_name: newCategoryName.trim(),
        image_url: categoryImageUrl || undefined,
      });

      toast({
        title: 'Success',
        description: 'Category added successfully.',
      });

      setNewCategoryName('');
      setCategoryImageUrl('');
      setExtraFields([]);
      setIsAddCategoryDialogOpen(false);
      mutateCategories();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory || !editCategoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateCategory({
        category_id: selectedCategory.id,
        category_name: editCategoryName.trim(),
        image_url: editCategoryImageUrl || selectedCategory.image_url || undefined,
      });

      toast({
        title: 'Success',
        description: 'Category updated successfully.',
      });

      setEditCategoryName('');
      setEditCategoryImageUrl('');
      setEditCategoryId(null);
      setIsEditCategoryDialogOpen(false);
      mutateCategories();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory({
        category_id: selectedCategory.id,
      });

      toast({
        title: 'Success',
        description: 'Category deleted successfully.',
      });

      setIsDeleteCategoryDialogOpen(false);
      mutateCategories();
      mutateSubcategories(); // Also refresh subcategories as they might be affected
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEditCategoryDialog = (category: CategoryData) => {
    setSelectedCategory(category);
    setEditCategoryId(category.id);
    setEditCategoryName(category.category_name);
    setEditCategoryImageUrl(category.image_url || '');
    setIsEditCategoryDialogOpen(true);
  };

  const openDeleteCategoryDialog = (category: CategoryData) => {
    setSelectedCategory(category);
    setIsDeleteCategoryDialogOpen(true);
  };

  // Subcategory handlers
  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !selectedCategoryId) {
      toast({
        title: 'Error',
        description: 'Subcategory name and category are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Validate extra fields: no empty names
      for (const field of extraFields) {
        if (!field.name.trim()) {
          toast({
            title: 'Error',
            description: 'All extra field names are required.',
            variant: 'destructive',
          });
          return;
        }
      }
      await addSubcategory({
        subcategory_name: newSubcategoryName.trim(),
        category_id: selectedCategoryId,
        metadata: extraFields,
        image_url: subcategoryImageUrl || undefined,
      });

      toast({
        title: 'Success',
        description: 'Subcategory added successfully.',
      });

      setNewSubcategoryName('');
      setSubcategoryImageUrl('');
      setExtraFields([]);
      setIsAddSubcategoryDialogOpen(false);
      mutateSubcategories();
      mutateCategories(); // Also refresh categories to update subcategory counts
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add subcategory. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!selectedSubcategory || !editSubcategoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Subcategory name is required.',
        variant: 'destructive',
      });
      return;
    }

    for (const field of editExtraFields) {
      if (!field.name.trim()) {
        toast({
          title: 'Error',
          description: 'All extra field names are required.',
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      await updateSubcategory({
        subcategory_id: selectedSubcategory.id,
        subcategory_name: editSubcategoryName.trim(),
        category_id: editSubcategoryCategoryId || undefined,
        metadata: editExtraFields,
        image_url: editSubcategoryImageUrl || selectedSubcategory.image_url || undefined,
      });

      toast({
        title: 'Success',
        description: 'Subcategory updated successfully.',
      });

      setEditSubcategoryName('');
      setEditSubcategoryImageUrl('');
      setEditExtraFields([]);
      setEditSubcategoryId(null);
      setEditSubcategoryCategoryId(null);
      setIsEditSubcategoryDialogOpen(false);
      mutateSubcategories();
      mutateCategories();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update subcategory. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSubcategory = async () => {
    if (!selectedSubcategory) return;

    try {
      await deleteSubcategory({
        subcategory_id: selectedSubcategory.id,
      });

      toast({
        title: 'Success',
        description: 'Subcategory deleted successfully.',
      });

      setIsDeleteSubcategoryDialogOpen(false);
      mutateSubcategories();
      mutateCategories();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subcategory. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openAddSubcategoryDialog = () => {
    setSelectedCategoryId(categories[0]?.id || null);
    setExtraFields([]);
    setSubcategoryImageUrl('');
    setIsAddSubcategoryDialogOpen(true);
  };

  const openEditSubcategoryDialog = (subcategory: SubcategoryData) => {
    setSelectedSubcategory(subcategory);
    setEditSubcategoryId(subcategory.id);
    setEditSubcategoryName(subcategory.subcategory_name);
    setEditSubcategoryCategoryId(subcategory.category.id);
    // If subcategory.metadata exists, use it, else empty array
    setEditExtraFields(Array.isArray(subcategory.metadata) ? subcategory.metadata : []);
    setEditSubcategoryImageUrl(subcategory.image_url || '');
    setIsEditSubcategoryDialogOpen(true);
  };

  const openDeleteSubcategoryDialog = (subcategory: SubcategoryData) => {
    setSelectedSubcategory(subcategory);
    setIsDeleteSubcategoryDialogOpen(true);
  };

  if (isCategoriesLoading || isSubcategoriesLoading) {
    return <LoadingState />;
  }

  if (isCategoriesError || isSubcategoriesError) {
    return <ErrorState />;
  }

  const handleAddExtraField = () => {
    setExtraFields((prev) => [...prev, { name: '', required: false }]);
  };

  const handleRemoveExtraField = (idx: number) => {
    setExtraFields((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleExtraFieldNameChange = (idx: number, value: string) => {
    setExtraFields((prev) =>
      prev.map((field, i) =>
        i === idx ? { ...field, name: value } : field
      )
    );
  };

  const handleExtraFieldRequiredChange = (idx: number, value: boolean) => {
    setExtraFields((prev) =>
      prev.map((field, i) =>
        i === idx ? { ...field, required: value } : field
      )
    );
  };

  return (
    <div className='pb-12'>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Category Management</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Categories</h2>
            <Button onClick={() => setIsAddCategoryDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <CategoryTable
            categories={categories}
            onEdit={openEditCategoryDialog}
            onDelete={openDeleteCategoryDialog}
            isUpdating={isUpdatingCategory}
            isDeleting={isDeletingCategory}
          />
        </TabsContent>

        <TabsContent value="subcategories">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Subcategories</h2>
            <Button
              onClick={openAddSubcategoryDialog}
              disabled={categories.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subcategory
            </Button>
          </div>

          <SubcategoryTable
            subcategories={subcategories}
            onEdit={openEditSubcategoryDialog}
            onDelete={openDeleteSubcategoryDialog}
            isUpdating={isUpdatingSubcategory}
            isDeleting={isDeletingSubcategory}
          />
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <CategoryDialog
        isOpen={isAddCategoryDialogOpen}
        onOpenChange={(open) => {
          setIsAddCategoryDialogOpen(open);
          if (!open) {
            setExtraFields([]);
            setCategoryImageUrl('');
          }
        }}
        onSubmit={handleAddCategory}
        isLoading={isAddingCategory}
        categoryName={newCategoryName}
        setCategoryName={setNewCategoryName}
        categoryImageUrl={categoryImageUrl}
        setCategoryImageUrl={setCategoryImageUrl}
        title="Add Category"
        description="Create a new category for your items."
        submitButtonText="Add Category"
      />

      {/* Edit Category Dialog */}
      <CategoryDialog
        isOpen={isEditCategoryDialogOpen}
        onOpenChange={(open) => {
          setIsEditCategoryDialogOpen(open);
          if (!open) {
            setSelectedCategory(null);
            setEditCategoryId(null);
            setEditCategoryName('');
            setEditCategoryImageUrl('');
          }
        }}
        onSubmit={handleUpdateCategory}
        isLoading={isUpdatingCategory}
        categoryName={editCategoryName}
        setCategoryName={setEditCategoryName}
        categoryImageUrl={editCategoryImageUrl}
        setCategoryImageUrl={setEditCategoryImageUrl}
        title="Edit Category"
        description="Update your category details."
        submitButtonText="Update Category"
      />

      {/* Delete Category Dialog */}
      <DeleteDialog
        isOpen={isDeleteCategoryDialogOpen}
        onOpenChange={setIsDeleteCategoryDialogOpen}
        onDelete={handleDeleteCategory}
        isDeleting={isDeletingCategory}
        title="Delete Category"
        description={`Are you sure you want to delete the category "${selectedCategory?.category_name}"? This will also delete all associated subcategories and may affect items.`}
      />

      {/* Add Subcategory Dialog */}
      <SubcategoryDialog
        isOpen={isAddSubcategoryDialogOpen}
        onOpenChange={(open) => {
          setIsAddSubcategoryDialogOpen(open);
          if (!open) {
            setNewSubcategoryName('');
            setSelectedCategoryId(null);
            setExtraFields([]);
            setSubcategoryImageUrl('');
          }
        }}
        onSubmit={handleAddSubcategory}
        isLoading={isAddingSubcategory}
        subcategoryName={newSubcategoryName}
        setSubcategoryName={setNewSubcategoryName}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        categories={categories}
        extraFields={extraFields}
        setExtraFields={setExtraFields}
        subcategoryImageUrl={subcategoryImageUrl}
        setSubcategoryImageUrl={setSubcategoryImageUrl}
        title="Add Subcategory"
        description="Create a new subcategory for your items."
        submitButtonText="Add Subcategory"
      />

      {/* Edit Subcategory Dialog */}
      <SubcategoryDialog
        isOpen={isEditSubcategoryDialogOpen}
        onOpenChange={(open) => {
          setIsEditSubcategoryDialogOpen(open);
          if (!open) {
            setSelectedSubcategory(null);
            setEditSubcategoryId(null);
            setEditSubcategoryName('');
            setEditSubcategoryCategoryId(null);
            setEditExtraFields([]);
            setEditSubcategoryImageUrl('');
          }
        }}
        onSubmit={handleUpdateSubcategory}
        isLoading={isUpdatingSubcategory}
        subcategoryName={editSubcategoryName}
        setSubcategoryName={setEditSubcategoryName}
        selectedCategoryId={editSubcategoryCategoryId}
        setSelectedCategoryId={setEditSubcategoryCategoryId}
        categories={categories}
        extraFields={editExtraFields}
        setExtraFields={setEditExtraFields}
        subcategoryImageUrl={editSubcategoryImageUrl}
        setSubcategoryImageUrl={setEditSubcategoryImageUrl}
        title="Edit Subcategory"
        description="Update your subcategory details."
        submitButtonText="Update Subcategory"
      />

      {/* Delete Subcategory Dialog */}
      <DeleteDialog
        isOpen={isDeleteSubcategoryDialogOpen}
        onOpenChange={setIsDeleteSubcategoryDialogOpen}
        onDelete={handleDeleteSubcategory}
        isDeleting={isDeletingSubcategory}
        title="Delete Subcategory"
        description={`Are you sure you want to delete the subcategory "${selectedSubcategory?.subcategory_name}"? This may affect items assigned to this subcategory.`}
      />
    </div>
  );
};

export default AdminCategoriesPage;