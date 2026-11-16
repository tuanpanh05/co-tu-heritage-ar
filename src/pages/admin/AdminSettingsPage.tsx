import React, { useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { authService } from '../../services/authService';
import {
  Settings,
  KeyRound,
  User,
  CheckCircle2,
  AlertCircle,
  Crown,
  GraduationCap
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user, profile, isSuperAdmin, refreshProfile } = useAdminAuth();

  // Profile Form
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);

  // Password Form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      alert('Vui lòng nhập tên hiển thị.');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await authService.updateDisplayName(displayName);
      if (res.error) throw res.error;
      await refreshProfile();
      setProfileFeedback('Đã cập nhật tên hiển thị thành công!');
      setTimeout(() => setProfileFeedback(null), 3000);
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);

    if (newPassword.length < 6) {
      setPassFeedback({ type: 'error', message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassFeedback({ type: 'error', message: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    try {
      setIsChangingPass(true);
      const res = await authService.changePassword(newPassword);
      if (res.error) throw res.error;
      setPassFeedback({ type: 'success', message: 'Đã đổi mật khẩu thành công qua Supabase Auth!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassFeedback({ type: 'error', message: err.message || 'Lỗi khi đổi mật khẩu.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-amber-100 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-amber-400" />
          Cài Đặt Quản Trị & Tài Khoản
        </h1>
        <p className="text-xs text-emerald-300/70 mt-1">
          Quản lý hồ sơ định danh, đổi mật khẩu bảo mật và thông tin phân quyền phiên làm việc.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-2xl bg-[#121c17] border border-emerald-900/40 space-y-4">
        <h2 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-400" />
          Thông Tin Phiên Đăng Nhập
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#0a120e] border border-emerald-900/30">
            <span className="text-emerald-500/70 block uppercase text-[10px]">Email Tài Khoản</span>
            <span className="text-white font-bold text-sm mt-0.5 block">{user?.email}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0a120e] border border-emerald-900/30">
            <span className="text-emerald-500/70 block uppercase text-[10px]">Vai Trò Phân Quyền (RBAC)</span>
            <div className="flex items-center gap-2 mt-1">
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/40 text-xs font-semibold">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  Super Admin (Toàn quyền)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-xs font-semibold">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  Biên Tập Viên Học Sinh (Editor)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 rounded-2xl bg-[#121c17] border border-emerald-900/40 space-y-4">
        <h2 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
          <User className="w-4 h-4 text-amber-400" />
          Hồ Sơ Định Danh
        </h2>

        {profileFeedback && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{profileFeedback}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-emerald-400/80 mb-1">Tên Hiển Thị</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full max-w-md px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold transition-all disabled:opacity-50"
          >
            {isUpdatingProfile ? 'Đang cập nhật...' : 'Cập Nhật Tên Hiển Thị'}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="p-6 rounded-2xl bg-[#121c17] border border-emerald-900/40 space-y-4">
        <h2 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-400" />
          Đổi Mật Khẩu Đăng Nhập
        </h2>

        {passFeedback && (
          <div
            className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              passFeedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                : 'bg-red-950/80 border-red-700 text-red-200'
            }`}
          >
            {passFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{passFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono max-w-md">
          <div>
            <label className="block text-emerald-400/80 mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-emerald-400/80 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPass}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold transition-all disabled:opacity-50"
          >
            {isChangingPass ? 'Đang đổi mật khẩu...' : 'Xác Nhận Đổi Mật Khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};
