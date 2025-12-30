"use client"

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store';
import { checkAuth } from '@/lib/features/auth/authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <>{children}</>;
}