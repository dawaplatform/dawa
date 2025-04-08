import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedUserState {
  userId: any | null;
}

const initialState: SelectedUserState = {
  userId: null,
};

const selectedUserSlice = createSlice({
  name: 'selectedUser',
  initialState,
  reducers: {
    setSelectedUserId(state, action: PayloadAction<any>) {
      state.userId = action.payload;
    },
    clearSelectedUserId(state) {
      state.userId = null;
    },
  },
});

export const { setSelectedUserId, clearSelectedUserId } =
  selectedUserSlice.actions;

export default selectedUserSlice.reducer;
