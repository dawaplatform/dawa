import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authDialogReducer from './slices/authDialog/authDialogSlice';
import categoriesReducer from './slices/categories/categories';
import categoryReducer from './slices/categories/categorySlice';
import productReducer from './slices/products/productSlice';
import myShopReducer from './slices/myshop/selectedUserSlice';

const rootReducer = combineReducers({
  authDialog: authDialogReducer,
  categories: categoriesReducer,
  category: categoryReducer,
  product: productReducer,
  myShop: myShopReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function initializeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export const store = initializeStore();
export type AppDispatch = typeof store.dispatch;
