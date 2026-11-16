import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authService, AdminProfile } from '../services/authService';
import { getSupabase } from '../lib/supabase';

interface AdminAuthContextType {
  user: User | null;
  profile: AdminProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isEditor: boolean;
  canModerateReviews: boolean;
  canDeleteArtifacts: boolean;
  canManageCategories: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const session = await authService.getSession();
      if (session?.user) {
        setUser(session.user);
        const adminProfile = await authService.getAdminProfile(session.user.id);
        if (adminProfile) {
          setProfile(adminProfile);
        } else {
          // Authenticated but not an admin!
          setUser(null);
          setProfile(null);
          await authService.signOut();
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error('[AdminAuthProvider] Auth initialization error:', err);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const supabase = getSupabase();
    if (!supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const adminProfile = await authService.getAdminProfile(session.user.id);
        setProfile(adminProfile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const { user: loggedInUser, profile: loggedInProfile, error } = await authService.signIn(email, password);
    setIsLoading(false);

    if (error || !loggedInUser || !loggedInProfile) {
      return { success: false, error: error?.message || 'Đăng nhập không thành công.' };
    }

    setUser(loggedInUser);
    setProfile(loggedInProfile);
    return { success: true };
  };

  const logout = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await authService.getAdminProfile(user.id);
      setProfile(p);
    }
  };

  const isSuperAdmin = profile?.role === 'super_admin';
  const isEditor = profile?.role === 'admin'; // admin is assigned to editor/student role in this RBAC setup

  const value: AdminAuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: Boolean(user && profile),
    isSuperAdmin,
    isEditor,
    // Permissions matrix
    canModerateReviews: isSuperAdmin, // Only Super Admin can approve/reject/delete reviews
    canDeleteArtifacts: isSuperAdmin, // Only Super Admin can permanently delete artifacts
    canManageCategories: isSuperAdmin, // Only Super Admin can delete/reorder core categories
    login,
    logout,
    refreshProfile
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
