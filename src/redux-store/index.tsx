import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authDialogReducer from './slices/authDialog/authDialogSlice';
import categoriesReducer from './slices/categories/categories';
import categoryReducer from './slices/categories/categorySlice';
import myShopReducer from './slices/myshop/selectedUserSlice';
import productReducer from './slices/products/productSlice';

const rootReducer = combineReducers({
  authDialog: authDialogReducer,
  categories: categoriesReducer,
  category: categoryReducer,
  product: productReducer,
  myShop: myShopReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function initializeStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export const store = initializeStore();
export type AppDispatch = typeof store.dispatch;
