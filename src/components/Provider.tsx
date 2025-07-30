'use client';

import type { RootState } from '@/redux-store';
import { store } from '@/redux-store';
import { NextAuthProvider } from '@contexts/nextAuthProvider';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

interface ProviderProps {
  children: React.ReactNode;
  preloadedState?: Partial<RootState>;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {

  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </NextAuthProvider>
  );
};

export default Provider;
