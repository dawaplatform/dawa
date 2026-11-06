import { RootState } from '@/redux-store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Category {
  id: string;
  category_name: string;
  image_url?: string | null;
  cover_image_url?: string | null;
  cover_image_urls?: string[] | null;
  subcategories?: {
    id: string;
    subcategory_name: string;
    subcategory_item_count: number;
  }[];
}

export interface CategoriesState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  fetchedAt: number | null;
}

const initialState: CategoriesState = {
  categories: [],
  status: 'idle',
  error: null,
  fetchedAt: null,
};

const FRESH_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15000;

// Fetch once per few minutes; the sidebar and grid can both ask without duplicating the request.
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string; state: { categories: CategoriesState } }
>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/getcategories/`,
        { timeout: REQUEST_TIMEOUT_MS },
      );
      const data: Category[] = response.data?.data ?? [];
      if (data.length) return data;
      throw new Error('Empty categories response');
    } catch (error: any) {
      // Bundled copy keeps the menu usable when the API is slow or down.
      try {
        const res = await fetch('/categories.json');
        const fallback: Category[] = await res.json();
        if (Array.isArray(fallback) && fallback.length) return fallback;
      } catch {
        // fall through to reject
      }
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  },
  {
    condition: (_, { getState }) => {
      const { status, categories, fetchedAt } = getState().categories;
      if (status === 'loading') return false;
      return !(
        categories.length &&
        fetchedAt &&
        Date.now() - fetchedAt < FRESH_MS
      );
    },
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.status = 'succeeded';
      state.error = null;
      state.fetchedAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.status = 'succeeded';
        state.fetchedAt = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch categories';
      });
  },
});

// Selector to access categories state
export const selectCategories = (state: RootState) =>
  state.categories.categories;

export default categoriesSlice.reducer;
