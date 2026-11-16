import { getSupabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AdminProfile {
  id: string;
  display_name: string | null;
  role: 'super_admin' | 'admin';
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: AdminProfile | null;
  isLoading: boolean;
}

export const authService = {
  async getSession(): Promise<Session | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getCurrentUser(): Promise<User | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  async getAdminProfile(userId: string): Promise<AdminProfile | null> {
    const supabase = getSupabase();
    if (!supabase || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.warn('[authService] Admin profile not found or unauthorized:', error?.message);
        return null;
      }

      return data as AdminProfile;
    } catch (err) {
      console.error('[authService] Error fetching admin profile:', err);
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<{
    user: User | null;
    profile: AdminProfile | null;
    error: Error | null;
  }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { user: null, profile: null, error: new Error('Supabase client is not configured.') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { user: null, profile: null, error };
      }

      if (!data.user) {
        return { user: null, profile: null, error: new Error('Đăng nhập không thành công.') };
      }

      // Verify that this user actually has an authorized admin profile
      const profile = await this.getAdminProfile(data.user.id);
      if (!profile) {
        // User logged in via Auth but is NOT in admin_profiles! Deny access and sign out
        await supabase.auth.signOut();
        return {
          user: null,
          profile: null,
          error: new Error('Tài khoản này không có quyền truy cập khu vực Quản trị (Chưa được cấp phép trong admin_profiles).')
        };
      }

      return { user: data.user, profile, error: null };
    } catch (err: any) {
      return { user: null, profile: null, error: err };
    }
  },

  async signOut(): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  async changePassword(newPassword: string): Promise<{ error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error('Supabase client is not configured.') };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { error: error ? new Error(error.message) : null };
  },

  async updateDisplayName(displayName: string): Promise<{ error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error('Supabase client is not configured.') };
    }

    const user = await this.getCurrentUser();
    if (!user) {
      return { error: new Error('Chưa đăng nhập.') };
    }

    const { error: profileError } = await supabase
      .from('admin_profiles')
      .update({ display_name: displayName.trim() })
      .eq('id', user.id);

    if (profileError) {
      return { error: new Error(profileError.message) };
    }

    await supabase.auth.updateUser({
      data: { display_name: displayName.trim() }
    });

    return { error: null };
  }
};
