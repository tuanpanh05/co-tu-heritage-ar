import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Loader2, ShieldCheck } from 'lucide-react';

export const AdminProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, profile } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1612] flex flex-col items-center justify-center text-white px-4">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1b3b2b] to-[#2d5a3e] border border-amber-600/30 flex items-center justify-center shadow-xl shadow-emerald-950/40 animate-pulse">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin absolute -bottom-2 -right-2" />
        </div>
        <h2 className="text-xl font-serif text-amber-100 font-medium tracking-wide">
          CO-TU HERITAGE CMS
        </h2>
        <p className="text-sm text-emerald-300/60 mt-1 font-mono">
          Đang xác thực thông tin quyền quản trị...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};
