import { secureApiClient } from '@/@core/utils/apiClient';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

// --- INTERFACES (Consider moving to a dedicated types file e.g., src/types/admin.ts) ---

export interface UserAdminView {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  date_joined: string;
  role?: 'Client' | 'Vendor' | 'Admin' | null;
  contact?: string | null;
  address?: string | null;
  profile_picture?: string | null;
}

export interface ItemAdminSerializer {
  id: number;
  item_name: string;
  item_price: number;
  item_location: string;
  item_negotiable: boolean;
  item_status: string;
  item_description: string;
  subcategory: string;
  category: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  rejection_reason?: string | null;
  approved_by: string | null;
  item_promoted: boolean;
  images?: Array<{
    id: number;
    image: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface AdminDashboardStatsData {
  total_users: number;
  total_admins: number;
  total_vendors: number;
  total_clients: number;
  total_items: number;
  total_approved_items: number;
  total_likes: number;
  total_views: number;
  total_shares: number;
  total_wishlist_actions: number;
  total_reports: number;
  total_subscribers: number;
  status: number;
}

export interface UpdateItemApprovalStatusProps {
  item_id: number | string;
  approval_status: 'Approved' | 'Rejected';
  rejection_reason?: string;
}

export interface ChangeUserRoleProps {
  user_id: number | string;
  role: 'Client' | 'Vendor' | 'Admin';
}

export interface DeleteUserProps {
  user_id: number | string;
}

export interface UpdateUserAdminProps {
  user_id: number | string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  contact?: string;
  address?: string;
  profile_picture?: File | null;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface SimpleMessageResponse {
  message: string;
  status: number;
}

// --- CATEGORY INTERFACES ---

export interface CategoryData {
  id: number;
  category_name: string;
  subcategory_count?: number;
  item_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface SubcategoryData {
  id: number;
  subcategory_name: string;
  category: {
    id: number;
    category_name: string;
  };
  item_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface AddCategoryProps {
  category_name: string;
}

export interface UpdateCategoryProps {
  category_id: number | string;
  category_name: string;
}

export interface DeleteCategoryProps {
  category_id: number | string;
}

export interface AddSubcategoryProps {
  subcategory_name: string;
  category_id: number | string;
}

export interface UpdateSubcategoryProps {
  subcategory_id: number | string;
  subcategory_name: string;
  category_id?: number | string;
}

export interface DeleteSubcategoryProps {
  subcategory_id: number | string;
}

export interface UpdateItemPromotedStatusProps {
  item_id: number | string;
  promoted_status: boolean;
}

// --- API FUNCTIONS ---

/**
 * Fetch all items for admin
 * @returns Promise with all items data
 */
export const getAllItemsAdmin = async (): Promise<ApiResponse<ItemAdminSerializer[]>> => {
  try {
    const response = await secureApiClient.get('/getallitemsadmin/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all items for admin:', error);
    throw error;
  }
};

/**
 * Fetch item details for admin
 * @param itemId - ID of the item to fetch
 * @returns Promise with item details
 */
export const getItemDetailsAdmin = async (itemId: number | string): Promise<ApiResponse<ItemAdminSerializer>> => {
  try {
    if (!itemId) {
      throw new Error('Item ID is required');
    }
    
    const response = await secureApiClient.get('/getitemdetailsadmin/', {
      params: { item_id: itemId },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching item details for admin (item ID: ${itemId}):`, error);
    throw error;
  }
};

/**
 * Update item approval status
 * @param arg - Object containing item_id, approval_status, and optional rejection_reason
 * @returns Promise with response message
 */
export const updateItemApprovalStatus = async (
  { arg }: { arg: UpdateItemApprovalStatusProps }
): Promise<SimpleMessageResponse> => {
  try {
    if (!arg.item_id) {
      throw new Error('Item ID is required');
    }
    
    if (!arg.approval_status || !['Approved', 'Rejected'].includes(arg.approval_status)) {
      throw new Error("Valid approval_status ('Approved' or 'Rejected') is required");
    }
    
    if (arg.approval_status === 'Rejected' && !arg.rejection_reason) {
      throw new Error('Rejection reason is required when rejecting an item');
    }
    
    const response = await secureApiClient.post('/updateitemapprovalstatus/', arg);
    return response.data;
  } catch (error) {
    console.error('Error updating item approval status:', error);
    throw error;
  }
};

/**
 * Fetch all users for admin
 * @returns Promise with all users data
 */
export const getAllUsersAdmin = async (): Promise<ApiResponse<UserAdminView[]>> => {
  try {
    const response = await secureApiClient.get('/getallusersadmin/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users for admin:', error);
    throw error;
  }
};

/**
 * Change user role
 * @param arg - Object containing user_id and new role
 * @returns Promise with response message
 */
export const changeUserRoleAdmin = async (
  { arg }: { arg: ChangeUserRoleProps }
): Promise<SimpleMessageResponse> => {
  try {
    if (!arg.user_id) {
      throw new Error('User ID is required');
    }
    
    if (!arg.role || !['Client', 'Vendor', 'Admin'].includes(arg.role)) {
      throw new Error("Valid role ('Client', 'Vendor', or 'Admin') is required");
    }
    
    const response = await secureApiClient.post('/changeuserroleadmin/', arg);
    return response.data;
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param arg - Object containing user_id
 * @returns Promise with response message
 */
export const deleteUserAdmin = async (
  { arg }: { arg: DeleteUserProps }
): Promise<SimpleMessageResponse> => {
  try {
    if (!arg.user_id) {
      throw new Error('User ID is required');
    }
    
    const response = await secureApiClient.delete('/deleteuseradmin/', { data: arg });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Update user details by admin
 * @param arg - Object containing user_id and fields to update
 * @returns Promise with response message
 */
export const updateUserAdmin = async (
  { arg }: { arg: UpdateUserAdminProps }
): Promise<SimpleMessageResponse> => {
  try {
    if (!arg.user_id) {
      throw new Error('User ID is required');
    }
    
    // Handle file upload if profile_picture is a File
    if (arg.profile_picture instanceof File) {
      const formData = new FormData();
      formData.append('user_id', String(arg.user_id));
      formData.append('profile_picture', arg.profile_picture);
      
      // Add other fields to formData
      Object.entries(arg).forEach(([key, value]) => {
        if (key !== 'user_id' && key !== 'profile_picture' && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      const response = await secureApiClient.patch('/updateuseradmin/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    
    const response = await secureApiClient.patch('/updateuseradmin/', arg);
    return response.data;
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};

/**
 * Fetch admin dashboard statistics
 * @returns Promise with dashboard statistics
 */
export const getAdminDashboardStats = async (): Promise<AdminDashboardStatsData> => {
  try {
    const response = await secureApiClient.get('/admindashboardstats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    throw error;
  }
};

/**
 * Update item promotion status
 * @param arg - Object containing item_id and promoted_status
 * @returns Promise with response message
 */
export const updateItemPromotedStatus = async (
  { arg }: { arg: UpdateItemPromotedStatusProps }
): Promise<SimpleMessageResponse> => {
  try {
    if (!arg.item_id) {
      throw new Error('Item ID is required');
    }
    
    if (arg.promoted_status === undefined) {
      throw new Error('Promoted status is required');
    }
    
    const response = await secureApiClient.post('/updateItemPromotedStatus/', arg);
    return response.data;
  } catch (error) {
    console.error('Error updating item promotion status:', error);
    throw error;
  }
};

// --- SWR HOOKS ---

/**
 * Hook to fetch all items for admin
 * @returns Object with items data, loading state, error info, and mutate function
 */
export const useAdminItems = () => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ItemAdminSerializer[]>>(
    '/getallitemsadmin/', 
    getAllItemsAdmin
  );
  
  return {
    items: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook to fetch item details for admin
 * @param itemId - ID of the item to fetch
 * @returns Object with item details, loading state, error info, and mutate function
 */
export const useAdminItemDetails = (itemId: number | string | null) => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ItemAdminSerializer>>(
    itemId ? ['/getitemdetailsadmin/', itemId] : null,
    itemId ? () => getItemDetailsAdmin(itemId) : null
  );
  
  return {
    item: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook to update item approval status
 * @returns Object with update function, loading state, and error info
 */
export const useUpdateItemApprovalStatus = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    SimpleMessageResponse,
    Error,
    string,
    UpdateItemApprovalStatusProps
  >('/updateitemapprovalstatus/', (url, { arg }) => updateItemApprovalStatus({ arg }));
  
  return {
    updateApprovalStatus: trigger,
    isUpdating: isMutating,
    error,
  };
};

/**
 * Hook to fetch all users for admin
 * @returns Object with users data, loading state, error info, and mutate function
 */
export const useAdminUsers = () => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<UserAdminView[]>>(
    '/getallusersadmin/', 
    getAllUsersAdmin
  );
  
  return {
    users: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook to change user role
 * @returns Object with change role function, loading state, and error info
 */
export const useChangeUserRole = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    SimpleMessageResponse,
    Error,
    string,
    ChangeUserRoleProps
  >('/changeuserroleadmin/', (url, { arg }) => changeUserRoleAdmin({ arg }));
  
  return {
    changeRole: trigger,
    isChangingRole: isMutating,
    error,
  };
};

/**
 * Hook to delete a user
 * @returns Object with delete function, loading state, and error info
 */
export const useDeleteUser = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    SimpleMessageResponse,
    Error,
    string,
    DeleteUserProps
  >('/deleteuseradmin/', (url, { arg }) => deleteUserAdmin({ arg }));
  
  return {
    deleteUser: trigger,
    isDeleting: isMutating,
    error,
  };
};

/**
 * Hook to update user details
 * @returns Object with update function, loading state, and error info
 */
export const useUpdateUser = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    SimpleMessageResponse,
    Error,
    string,
    UpdateUserAdminProps
  >('/updateuseradmin/', (url, { arg }) => updateUserAdmin({ arg }));
  
  return {
    updateUser: trigger,
    isUpdating: isMutating,
    error,
  };
};

/**
 * Hook to fetch admin dashboard statistics
 * @returns Object with dashboard stats, loading state, error info, and mutate function
 */
export const useAdminDashboardStats = () => {
  const { data, error, isLoading, mutate } = useSWR<AdminDashboardStatsData>(
    '/admindashboardstats/', 
    getAdminDashboardStats
  );
  
  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook to update item promotion status
 * @returns Object with update function, loading state, and error info
 */
export const useUpdateItemPromotedStatus = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    SimpleMessageResponse,
    Error,
    string,
    UpdateItemPromotedStatusProps
  >('/updateItemPromotedStatus/', (url, { arg }) => updateItemPromotedStatus({ arg }));
  
  return {
    updatePromotedStatus: trigger,
    isUpdating: isMutating,
    error,
  };
};

// --- CATEGORY API FUNCTIONS ---

/**
 * Fetch all categories for admin
 * @returns Promise with all categories data
 */
export const getAllCategoriesAdmin = async (): Promise<ApiResponse<CategoryData[]>> => {
  try {
    const response = await secureApiClient.get('/categoryAdminGetAll/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all categories for admin:', error);
    throw error;
  }
};

/**
 * Add a new category
 * @param arg - Object containing category_name
 * @returns Promise with response message and created category
 */
export const addCategoryAdmin = async (
  { arg }: { arg: AddCategoryProps }
): Promise<ApiResponse<CategoryData>> => {
  try {
    if (!arg.category_name?.trim()) {
      throw new Error('Category name is required');
    }
    
    const response = await secureApiClient.post('/categoryAdminAdd/', arg);
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

/**
 * Update a category
 * @param arg - Object containing category_id and category_name
 * @returns Promise with response message and updated category
 */
export const updateCategoryAdmin = async (
  { arg }: { arg: UpdateCategoryProps }
): Promise<ApiResponse<CategoryData>> => {
  try {
    if (!arg.category_id) {
      throw new Error('Category ID is required');
    }
    
    if (!arg.category_name?.trim()) {
      throw new Error('Category name is required');
    }
    
    const response = await secureApiClient.put('/categoryAdminUpdate/', arg);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Delete a category
 * @param arg - Object containing category_id
 * @returns Promise with response message
 */
export const deleteCategoryAdmin = async (
  { arg }: { arg: DeleteCategoryProps }
): Promise<SimpleMessageResponse> => {
  try {
    if (!arg.category_id) {
      throw new Error('Category ID is required');
    }
    
    const response = await secureApiClient.delete('/categoryAdminDelete/', { data: arg });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

/**
 * Fetch all subcategories for admin
 * @param categoryId - Optional category ID to filter subcategories
 * @returns Promise with all subcategories data
 */
export const getAllSubcategoriesAdmin = async (categoryId?: number | string): Promise<ApiResponse<SubcategoryData[]>> => {
  try {
    const params = categoryId ? { category_id: categoryId } : undefined;
    const response = await secureApiClient.get('/subcategoryAdminGetAll/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching all subcategories for admin:', error);
    throw error;
  }
};

/**
 * Add a new subcategory
 * @param arg - Object containing subcategory_name and category_id
 * @returns Promise with response message and created subcategory
 */
export const addSubcategoryAdmin = async (
  { arg }: { arg: AddSubcategoryProps }
): Promise<ApiResponse<SubcategoryData>> => {
  try {
    if (!arg.subcategory_name?.trim()) {
      throw new Error('Subcategory name is required');
    }
    
    if (!arg.category_id) {
      throw new Error('Category ID is required');
    }
    
    const response = await secureApiClient.post('/subcategoryAdminAdd/', arg);
    return response.data;
  } catch (error) {
    console.error('Error adding subcategory:', error);
    throw error;
  }
};

/**
 * Update a subcategory
 * @param arg - Object containing subcategory_id, subcategory_name, and optional category_id
 * @returns Promise with response message and updated subcategory
 */
export const updateSubcategoryAdmin = async (
  { arg }: { arg: UpdateSubcategoryProps }
): Promise<ApiResponse<SubcategoryData>> => {
  try {
    if (!arg.subcategory_id) {
      throw new Error('Subcategory ID is required');
    }
    
    if (!arg.subcategory_name?.trim()) {
      throw new Error('Subcategory name is required');
    }
    
    const response = await secureApiClient.put('/subcategoryAdminUpdate/', arg);
    return response.data;
  } catch (error) {
    console.error('Error updating subcategory:', error);
    throw error;
  }
};

/**
 * Delete a subcategory
 * @param arg - Object containing subcategory_id
 * @returns Promise with response message
 */
export const deleteSubcategoryAdmin = async (
  { arg }: { arg: DeleteSubcategoryProps }
): Promise<SimpleMessageResponse> => {
  try {
    if (!arg.subcategory_id) {
      throw new Error('Subcategory ID is required');
    }
    
    const response = await secureApiClient.delete('/subcategoryAdminDelete/', { data: arg });
    return response.data;
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    throw error;
  }
};

// --- CATEGORY SWR HOOKS ---

/**
 * Hook to fetch all categories for admin
 * @returns Object with categories data, loading state, error info, and mutate function
 */
export const useAdminCategories = () => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<CategoryData[]>>(
    '/categoryAdminGetAll/', 
    getAllCategoriesAdmin
  );
  
  return {
    categories: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook to add a new category
 * @returns Object with add function, loading state, and error info
 */
export const useAddCategory = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    ApiResponse<CategoryData>,
    Error,
    string,
    AddCategoryProps
  >('/categoryAdminAdd/', (url, { arg }) => addCategoryAdmin({ arg }));
  
  return {
    addCategory: trigger,
    isAdding: isMutating,
    error,
  };
};

/**
 * Hook to update a category
 * @returns Object with update function, loading state, and error info
 */
export const useUpdateCategory = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    ApiResponse<CategoryData>,
    Error,
    string,
    UpdateCategoryProps
  >('/categoryAdminUpdate/', (url, { arg }) => updateCategoryAdmin({ arg }));
  
  return {
    updateCategory: trigger,
    isUpdating: isMutating,
    error,
  };
};

/**
 * Hook to delete a category
 * @returns Object with delete function, loading state, and error info
 */
export const useDeleteCategory = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    SimpleMessageResponse,
    Error,
    string,
    DeleteCategoryProps
  >('/categoryAdminDelete/', (url, { arg }) => deleteCategoryAdmin({ arg }));
  
  return {
    deleteCategory: trigger,
    isDeleting: isMutating,
    error,
  };
};

/**
 * Hook to fetch all subcategories for admin
 * @param categoryId - Optional category ID to filter subcategories
 * @returns Object with subcategories data, loading state, error info, and mutate function
 */
export const useAdminSubcategories = (categoryId?: number | string) => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<SubcategoryData[]>>(
    categoryId ? ['/subcategoryAdminGetAll/', categoryId] : '/subcategoryAdminGetAll/',
    () => getAllSubcategoriesAdmin(categoryId)
  );
  
  return {
    subcategories: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Hook to add a new subcategory
 * @returns Object with add function, loading state, and error info
 */
export const useAddSubcategory = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    ApiResponse<SubcategoryData>,
    Error,
    string,
    AddSubcategoryProps
  >('/subcategoryAdminAdd/', (url, { arg }) => addSubcategoryAdmin({ arg }));
  
  return {
    addSubcategory: trigger,
    isAdding: isMutating,
    error,
  };
};

/**
 * Hook to update a subcategory
 * @returns Object with update function, loading state, and error info
 */
export const useUpdateSubcategory = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    ApiResponse<SubcategoryData>,
    Error,
    string,
    UpdateSubcategoryProps
  >('/subcategoryAdminUpdate/', (url, { arg }) => updateSubcategoryAdmin({ arg }));
  
  return {
    updateSubcategory: trigger,
    isUpdating: isMutating,
    error,
  };
};

/**
 * Hook to delete a subcategory
 * @returns Object with delete function, loading state, and error info
 */
export const useDeleteSubcategory = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    SimpleMessageResponse,
    Error,
    string,
    DeleteSubcategoryProps
  >('/subcategoryAdminDelete/', (url, { arg }) => deleteSubcategoryAdmin({ arg }));
  
  return {
    deleteSubcategory: trigger,
    isDeleting: isMutating,
    error,
  };
};