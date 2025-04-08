'use client';

import React from 'react';
import { NextAuthProvider } from '@contexts/nextAuthProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { initializeStore } from '@/redux-store';
import type { RootState } from '@/redux-store';

interface ProviderProps {
  children: React.ReactNode;
  preloadedState?: Partial<RootState>;
}

const Provider: React.FC<ProviderProps> = ({ children, preloadedState }) => {
  const store = initializeStore(preloadedState);

  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </NextAuthProvider>
  );
};

export default Provider;
