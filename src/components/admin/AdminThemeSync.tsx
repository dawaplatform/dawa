'use client';

import { useEffect } from 'react';

/** Admin follows the system colour scheme; the classes are removed on exit so the public site is untouched. */
export default function AdminThemeSync() {
  useEffect(() => {
    const root = document.documentElement;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => root.classList.toggle('dark', query.matches);

    root.classList.add('admin-theme');
    apply();
    query.addEventListener('change', apply);
    return () => {
      query.removeEventListener('change', apply);
      root.classList.remove('admin-theme', 'dark');
    };
  }, []);

  return null;
}
