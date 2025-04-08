import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthDialogState {
  isOpen: boolean;
}

const initialState: AuthDialogState = {
  isOpen: false,
};

const authDialogSlice = createSlice({
  name: 'authDialog',
  initialState,
  reducers: {
    openAuthDialog: (state) => {
      state.isOpen = true;
    },
    closeAuthDialog: (state) => {
      state.isOpen = false;
    },
    setAuthDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { openAuthDialog, closeAuthDialog, setAuthDialogOpen } =
  authDialogSlice.actions;
export default authDialogSlice.reducer;
