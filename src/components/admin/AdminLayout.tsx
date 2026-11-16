import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
  LayoutDashboard,
  Box,
  FolderTree,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Crown,
  GraduationCap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { profile, logout, isSuperAdmin, isEditor } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Tổng Quan',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/admin/artifacts',
      label: 'Quản Lý Hiện Vật 3D',
      icon: Box,
      badge: '7'
    },
    {
      to: '/admin/categories',
      label: 'Danh Mục Di Sản',
      icon: FolderTree,
      badge: null
    },
    {
      to: '/admin/reviews',
      label: 'Kiểm Duyệt Đánh Giá',
      icon: MessageSquare,
      badge: isSuperAdmin ? 'Cần duyệt' : 'Chỉ xem',
      highlight: isSuperAdmin
    },
    {
      to: '/admin/website-content',
      label: 'Nội Dung Website',
      icon: FileText,
      badge: null
    },
    {
      to: '/admin/media',
      label: 'Thư Viện Media & Storage',
      icon: ImageIcon,
      badge: null
    },
    {
      to: '/admin/settings',
      label: 'Cài Đặt & Tài Khoản',
      icon: Settings,
      badge: null
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/artifacts/create')) return 'Thêm Hiện Vật Mới';
    if (path.includes('/artifacts/') && path.includes('/edit')) return 'Chỉnh Sửa Hiện Vật';
    if (path.includes('/artifacts')) return 'Quản Lý Hiện Vật 3D';
    if (path.includes('/categories')) return 'Danh Mục Di Sản';
    if (path.includes('/reviews')) return 'Kiểm Duyệt Đánh Giá Cộng Đồng';
    if (path.includes('/website-content')) return 'Nội Dung Website & Trang Chủ';
    if (path.includes('/media')) return 'Thư Viện Media & Storage';
    if (path.includes('/settings')) return 'Cài Đặt Quản Trị';
    return 'Bảng Điều Khiển Tổng Quan';
  };

  return (
    <div className="min-h-screen bg-[#0a110e] text-[#f4efe6] flex flex-col md:flex-row antialiased selection:bg-amber-600/30 selection:text-amber-200">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#101b15] border-b border-emerald-800/30 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1b3b2b] to-[#2d5a3e] border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-serif font-bold text-amber-100 text-sm tracking-wide">
            CƠ TU CMS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-700/40 text-emerald-300">
            {isSuperAdmin ? 'Admin' : 'Học sinh'}
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#17251e] text-emerald-200 border border-emerald-800/40"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#0e1813] border-r border-emerald-900/30 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-emerald-900/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1b3b2b] to-[#2e5d42] border border-amber-500/30 flex items-center justify-center shadow-md shadow-emerald-950/60">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-base text-amber-100 leading-tight">
                  CO-TU HERITAGE
                </h1>
                <p className="text-[11px] font-mono text-emerald-400/60 uppercase tracking-widest mt-0.5">
                  Quản Trị Nội Dung
                </p>
              </div>
            </div>

            {/* Current user role card */}
            <div className="mt-4 p-3 rounded-xl bg-[#14231b] border border-emerald-800/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center shrink-0">
                  {isSuperAdmin ? (
                    <Crown className="w-4 h-4 text-amber-400" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-emerald-300" />
                  )}
                </div>
                <div className="truncate">
                  <div className="text-xs font-medium text-emerald-100 truncate">
                    {profile?.display_name || 'Quản trị viên'}
                  </div>
                  <div className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider">
                    {isSuperAdmin ? 'Super Admin' : 'Biên Tập Viên Học Sinh'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600/20 to-emerald-800/20 text-amber-200 border border-amber-500/40 shadow-sm'
                        : 'text-emerald-300/70 hover:text-emerald-100 hover:bg-[#15231c]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        item.highlight
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-950 text-emerald-400/70 border border-emerald-800/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-900/30 space-y-2">
          {/* Link to public website */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-emerald-300/80 hover:text-amber-200 hover:bg-[#14231b] border border-transparent hover:border-emerald-800/30 transition-all font-mono"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Xem Website Du Khách
            </span>
            <ChevronRight className="w-3 h-3 text-emerald-600" />
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400/80 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all font-mono"
          >
            <LogOut className="w-3.5 h-3.5" />
            Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#0d1612]/70 backdrop-blur-md border-b border-emerald-900/20 sticky top-0 z-30">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-500/60">
              <Link to="/admin/dashboard" className="hover:text-emerald-300">CMS</Link>
              <ChevronRight className="w-3 h-3 text-emerald-700" />
              <span className="text-amber-300/80">{getPageTitle()}</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-amber-100 tracking-wide mt-0.5">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Notice Indicator */}
            {isEditor && (
              <div className="hidden lg:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-700/40 text-emerald-300 font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chế độ Biên tập viên Học sinh: Quyền chỉnh sửa nội dung</span>
              </div>
            )}
            {isSuperAdmin && (
              <div className="hidden lg:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-600/40 text-amber-300 font-mono">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Super Admin: Toàn quyền quản trị & duyệt</span>
              </div>
            )}

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 px-3 py-1.5 rounded-lg bg-[#14231b] border border-emerald-800/40 hover:border-amber-500/40 transition-all font-mono"
            >
              <span>Xem Web</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Inner Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121c17] border border-emerald-800/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-700/40 flex items-center justify-center mx-auto mb-4 text-red-400">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-amber-100">
              Xác Nhận Đăng Xuất
            </h3>
            <p className="text-xs text-emerald-200/60 mt-2 leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc quản trị CO-TU HERITAGE CMS không?
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#17251e] border border-emerald-800/40 text-emerald-200 text-xs font-mono hover:bg-[#1f3329] transition-all"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2 px-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-medium transition-all shadow-lg shadow-red-950/40"
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
