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
import { Badge } from '@/components/ui/badge';
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
  SelectTrigger
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { UploadButton } from '../../../../utils/uploadthing';

type ExtraField = {
  name: string;
  required: boolean;
};

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
    if (!selectedCategory || !newCategoryName.trim()) {
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
        category_name: newCategoryName.trim(),
        image_url: categoryImageUrl || selectedCategory.image_url || undefined,
      });

      toast({
        title: 'Success',
        description: 'Category updated successfully.',
      });

      setNewCategoryName('');
      setCategoryImageUrl('');
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
    setNewCategoryName(category.category_name);
    setCategoryImageUrl(category.image_url || '');
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
    if (!selectedSubcategory || !newSubcategoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Subcategory name is required.',
        variant: 'destructive',
      });
      return;
    }

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

    try {
      await updateSubcategory({
        subcategory_id: selectedSubcategory.id,
        subcategory_name: newSubcategoryName.trim(),
        category_id: selectedCategoryId || undefined,
        metadata: extraFields,
        image_url: subcategoryImageUrl || selectedSubcategory.image_url || undefined,
      });

      toast({
        title: 'Success',
        description: 'Subcategory updated successfully.',
      });

      setNewSubcategoryName('');
      setSubcategoryImageUrl('');
      setExtraFields([]);
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
    setNewSubcategoryName(subcategory.subcategory_name);
    setSelectedCategoryId(subcategory.category.id);
    // If subcategory.metadata exists, use it, else empty array
    setExtraFields(Array.isArray(subcategory.metadata) ? subcategory.metadata : []);
    setSubcategoryImageUrl(subcategory.image_url || '');
    setIsEditSubcategoryDialogOpen(true);
  };

  const openDeleteSubcategoryDialog = (subcategory: SubcategoryData) => {
    setSelectedSubcategory(subcategory);
    setIsDeleteSubcategoryDialogOpen(true);
  };

  if (isCategoriesLoading || isSubcategoriesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (isCategoriesError || isSubcategoriesError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error loading data. Please try again later.</p>
      </div>
    );
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
    <div>
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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No categories found. Add your first category to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.category_name}</TableCell>
                      <TableCell>
                        {category.image_url && (
                          <img src={category.image_url} alt="" className="w-10 h-10 object-contain rounded" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.subcategory_count || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.item_count || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(category.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditCategoryDialog(category)}
                            disabled={isUpdatingCategory}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteCategoryDialog(category)}
                            disabled={isDeletingCategory}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No subcategories found. Add your first subcategory to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  subcategories.map((subcategory) => (
                    <TableRow key={subcategory.id}>
                      <TableCell className="font-medium">{subcategory.subcategory_name}</TableCell>
                      <TableCell>
                        {subcategory.image_url && (
                          <img src={subcategory.image_url} alt="" className="w-10 h-10 object-contain rounded" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge>{subcategory.category.category_name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subcategory.item_count || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(subcategory.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditSubcategoryDialog(subcategory)}
                            disabled={isUpdatingSubcategory}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteSubcategoryDialog(subcategory)}
                            disabled={isDeletingSubcategory}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={(open) => {
        setIsAddCategoryDialogOpen(open);
        if (!open) {
          setExtraFields([]);
          setCategoryImageUrl('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for your items.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
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
                setIsAddCategoryDialogOpen(false);
                setExtraFields([]);
                setCategoryImageUrl('');
              }}
              disabled={isAddingCategory}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={isAddingCategory}>
              {isAddingCategory && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="editCategoryName">Category Name</Label>
            <Input
              id="editCategoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCategoryDialogOpen(false)}
              disabled={isUpdatingCategory}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory} disabled={isUpdatingCategory}>
              {isUpdatingCategory && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.category_name}"?
              This will also delete all associated subcategories and may affect items.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteCategoryDialogOpen(false)}
              disabled={isDeletingCategory}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isDeletingCategory}
            >
              {isDeletingCategory && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={isAddSubcategoryDialogOpen} onOpenChange={setIsAddSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>
              Create a new subcategory for your items.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="subcategoryName">Subcategory Name</Label>
              <Input
                id="subcategoryName"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
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
                <SelectTrigger id="categorySelect" className="mt-1" />
                <SelectContent
                  className="hide-scrollbar"
                  style={{
                    maxHeight: 240,
                    overflowY: 'auto',
                    touchAction: 'pan-y',
                    WebkitOverflowScrolling: 'touch',
                  }}
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
                onClientUploadComplete={res => {
                  if (res && res[0]?.url) setSubcategoryImageUrl(res[0].url);
                }}
                onUploadError={error => {
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Extra Fields</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddExtraField}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>
              {extraFields.length === 0 && (
                <div className="text-sm text-slate-400">No extra fields. Click "Add Field" to add.</div>
              )}
              <div className="space-y-3">
                {extraFields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={field.name}
                      onChange={e => handleExtraFieldNameChange(idx, e.target.value)}
                      placeholder="Field name (e.g. Mileage)"
                      className="flex-1"
                    />
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => handleExtraFieldRequiredChange(idx, e.target.checked)}
                        className="accent-primary-600"
                      />
                      Required
                    </label>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveExtraField(idx)}
                      aria-label="Remove field"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddSubcategoryDialogOpen(false)}
              disabled={isAddingSubcategory}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSubcategory} disabled={isAddingSubcategory}>
              {isAddingSubcategory && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditSubcategoryDialogOpen} onOpenChange={setIsEditSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>
              Update the subcategory details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="editSubcategoryName">Subcategory Name</Label>
              <Input
                id="editSubcategoryName"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Enter subcategory name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="editCategorySelect">Parent Category</Label>
              <Select
                value={selectedCategoryId?.toString()}
                onValueChange={value => setSelectedCategoryId(Number(value))}
              >
                <SelectTrigger id="editCategorySelect" className="mt-1" />
                <SelectContent
                  className="hide-scrollbar"
                  style={{
                    maxHeight: 240,
                    overflowY: 'auto',
                    touchAction: 'pan-y',
                    WebkitOverflowScrolling: 'touch',
                  }}
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
                onClientUploadComplete={res => {
                  if (res && res[0]?.url) setSubcategoryImageUrl(res[0].url);
                }}
                onUploadError={error => {
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Extra Fields</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddExtraField}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>
              {extraFields.length === 0 && (
                <div className="text-sm text-slate-400">No extra fields. Click "Add Field" to add.</div>
              )}
              <div className="space-y-3">
                {extraFields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={field.name}
                      onChange={e => handleExtraFieldNameChange(idx, e.target.value)}
                      placeholder="Field name (e.g. Mileage)"
                      className="flex-1"
                    />
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => handleExtraFieldRequiredChange(idx, e.target.checked)}
                        className="accent-primary-600"
                      />
                      Required
                    </label>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveExtraField(idx)}
                      aria-label="Remove field"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditSubcategoryDialogOpen(false)}
              disabled={isUpdatingSubcategory}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateSubcategory} disabled={isUpdatingSubcategory}>
              {isUpdatingSubcategory && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subcategory Dialog */}
      <Dialog open={isDeleteSubcategoryDialogOpen} onOpenChange={setIsDeleteSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subcategory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the subcategory "{selectedSubcategory?.subcategory_name}"?
              This may affect items assigned to this subcategory.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteSubcategoryDialogOpen(false)}
              disabled={isDeletingSubcategory}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubcategory}
              disabled={isDeletingSubcategory}
            >
              {isDeletingSubcategory && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategoriesPage; 