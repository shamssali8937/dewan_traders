'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/endpoints';

export default function AuthInitializer() {
  const { isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      authApi.me()
        .then((res) => {
          if (res.data?.data) {
            setUser(res.data.data);
          }
        })
        .catch(() => {
          // If session validation fails, log out and clear stale local state
          logout();
        });
    }
  }, [isAuthenticated, setUser, logout]);

  return null;
}
