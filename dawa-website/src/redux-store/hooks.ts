'use client';

import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = useAppDispatch<AppDispatch>;
export const useSelector = useAppSelector<RootState>;
