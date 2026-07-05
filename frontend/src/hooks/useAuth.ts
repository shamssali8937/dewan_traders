'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi, LoginInput, RegisterInput } from '@/services/endpoints';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, isAuthenticated, login, logout: storeLogout, setLoading } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      login(user, accessToken);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin' || user.role === 'manager') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      login(user, accessToken);
      toast.success('Account created successfully!');
      router.push('/user');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Registration failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      storeLogout();
      qc.clear();
      toast.success('Logged out successfully');
      router.push('/');
    },
    onError: () => {
      // Even if API fails, clear local state
      storeLogout();
      qc.clear();
      router.push('/');
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
}

export function useUpdateProfile() {
  const { login } = useAuthStore();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => authApi.updateProfile(data),
    onSuccess: (res) => {
      const updatedUser = res.data.data;
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '';
      login(updatedUser, token);
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Profile updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    },
  });
}

