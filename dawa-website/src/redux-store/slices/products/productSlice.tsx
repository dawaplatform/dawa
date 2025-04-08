import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state type
interface SelectedProductState {
  selectedProductId: string | null;
  lastSelectedAt: string | null;
}

// Helper function to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
};

// Retrieve the initial state from localStorage if available
const getInitialState = (): SelectedProductState => {
  if (isLocalStorageAvailable()) {
    const storedState = localStorage.getItem('selectedProduct');
    if (storedState) {
      try {
        return JSON.parse(storedState) as SelectedProductState;
      } catch (error) {
        console.error(
          'Failed to parse selectedProduct from localStorage:',
          error,
        );
      }
    }
  }
  return { selectedProductId: null, lastSelectedAt: null };
};

// Initialize the slice's state
const initialState: SelectedProductState = getInitialState();

const selectedProductSlice = createSlice({
  name: 'selectedProduct',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload;
      state.lastSelectedAt = new Date().toISOString();

      // Store the updated state in localStorage
      if (isLocalStorageAvailable()) {
        localStorage.setItem('selectedProduct', JSON.stringify(state));
      }
    },
    clearSelectedProduct: (state) => {
      state.selectedProductId = null;
      state.lastSelectedAt = null;

      // Remove the item from localStorage
      if (isLocalStorageAvailable()) {
        localStorage.removeItem('selectedProduct');
      }
    },
  },
});

// Export actions
export const { setSelectedProduct, clearSelectedProduct } =
  selectedProductSlice.actions;

// Export reducer
export default selectedProductSlice.reducer;
