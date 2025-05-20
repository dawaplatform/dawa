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
  SelectTrigger,
  SelectValue,
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
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
      });
      
      toast({
        title: 'Success',
        description: 'Category added successfully.',
      });
      
      setNewCategoryName('');
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
      });
      
      toast({
        title: 'Success',
        description: 'Category updated successfully.',
      });
      
      setNewCategoryName('');
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
    setIsEditCategoryDialogOpen(true);
  };

  const openDeleteCategoryDialog = (category: CategoryData) => {
    setSelectedCategory(category);
    setIsDeleteCategoryDialogOpen(true);
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
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
      await addSubcategory({
        subcategory_name: newSubcategoryName.trim(),
        category_id: selectedCategoryId,
      });
      
      toast({
        title: 'Success',
        description: 'Subcategory added successfully.',
      });
      
      setNewSubcategoryName('');
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

    try {
      await updateSubcategory({
        subcategory_id: selectedSubcategory.id,
        subcategory_name: newSubcategoryName.trim(),
        category_id: selectedCategoryId || undefined,
      });
      
      toast({
        title: 'Success',
        description: 'Subcategory updated successfully.',
      });
      
      setNewSubcategoryName('');
      setIsEditSubcategoryDialogOpen(false);
      mutateSubcategories();
      mutateCategories(); // Also refresh categories if subcategory was moved
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
      mutateCategories(); // Also refresh categories to update subcategory counts
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
    setIsAddSubcategoryDialogOpen(true);
  };

  const openEditSubcategoryDialog = (subcategory: SubcategoryData) => {
    setSelectedSubcategory(subcategory);
    setNewSubcategoryName(subcategory.subcategory_name);
    setSelectedCategoryId(subcategory.category.id);
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
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No categories found. Add your first category to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.category_name}</TableCell>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No subcategories found. Add your first subcategory to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  subcategories.map((subcategory) => (
                    <TableRow key={subcategory.id}>
                      <TableCell className="font-medium">{subcategory.subcategory_name}</TableCell>
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
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for your items.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="mt-1"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCategoryDialogOpen(false)}
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
                onValueChange={(value) => setSelectedCategoryId(Number(value))}
              >
                <SelectTrigger id="categorySelect" className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                onValueChange={(value) => setSelectedCategoryId(Number(value))}
              >
                <SelectTrigger id="editCategorySelect" className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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