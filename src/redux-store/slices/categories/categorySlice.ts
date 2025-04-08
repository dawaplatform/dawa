import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../';
import type {
  Category,
  Subcategory,
} from '@/views/pages/category/types/category';

interface SelectedCategory {
  id: string;
  slug: string;
  name: string;
}

interface SelectedSubcategory {
  id: string;
  slug: string;
  name: string;
}

interface CategoryState {
  selectedCategory: SelectedCategory | null;
  selectedSubcategory: SelectedSubcategory | null;
}

const initialState: CategoryState = {
  selectedCategory: null,
  selectedSubcategory: null,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      if (action.payload) {
        state.selectedCategory = {
          id: action.payload.id,
          slug: action.payload.category_name.toLowerCase().replace(/ /g, '-'),
          name: action.payload.category_name,
        };
        // Reset subcategory when changing category
        state.selectedSubcategory = null;
      } else {
        state.selectedCategory = null;
        state.selectedSubcategory = null;
      }
    },
    setSelectedSubcategory: (
      state,
      action: PayloadAction<Subcategory | null>,
    ) => {
      if (action.payload) {
        state.selectedSubcategory = {
          id: action.payload.id,
          slug: action.payload.subcategory_name
            .toLowerCase()
            .replace(/ /g, '-'),
          name: action.payload.subcategory_name,
        };
      } else {
        state.selectedSubcategory = null;
      }
    },
    clearSelections: (state) => {
      state.selectedCategory = null;
      state.selectedSubcategory = null;
    },
  },
});

export const { setSelectedCategory, setSelectedSubcategory, clearSelections } =
  categorySlice.actions;

// Selectors to retrieve selected category and subcategory from state
export const selectCategory = (state: RootState) =>
  state.category.selectedCategory;
export const selectSubcategory = (state: RootState) =>
  state.category.selectedSubcategory;

export default categorySlice.reducer;
