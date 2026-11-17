import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  KeyRound,
  GraduationCap,
  Crown,
  CheckCircle2
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quickFillStatus, setQuickFillStatus] = useState<string | null>(null);

  const redirectPath = (location.state as any)?.from || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản.');
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi hệ thống khi đăng nhập.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string, label: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
    setQuickFillStatus(`Đã điền tài khoản ${label}`);
    setTimeout(() => setQuickFillStatus(null), 2500);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a110e] text-[#f4efe6] flex flex-col justify-between selection:bg-amber-600/30 selection:text-amber-200 relative overflow-x-hidden overflow-y-auto">
      {/* Ambient forest-luxury background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[700px] h-[400px] sm:h-[500px] bg-gradient-to-b from-[#1b3b2b]/40 via-[#14291f]/20 to-transparent blur-3xl pointer-events-none rounded-full max-w-full" />
      <div className="absolute -bottom-40 -right-40 w-80 sm:w-96 h-80 sm:h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none max-w-full" />

      {/* Top Header / Back button */}
      <header className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-200/75 hover:text-amber-300 transition-colors py-2 px-3 rounded-xl hover:bg-emerald-950/40 border border-transparent hover:border-emerald-800/40 touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ WebAR</span>
        </Link>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-emerald-400/60 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cơ Tu CMS</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Card Frame */}
          <div className="bg-[#121c17]/95 backdrop-blur-xl border border-emerald-800/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-black/60 relative">
            
            {/* Header Badge & Title */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#1b3b2b] to-[#28533b] border border-amber-500/30 shadow-lg shadow-emerald-950/50 mb-3 sm:mb-4">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-semibold text-amber-100 tracking-wide">
                Hệ Thống Quản Trị Di Sản
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/60 mt-1.5 font-light">
                Đăng nhập để quản lý hiện vật 3D, từ vựng và nội dung
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-red-200 text-xs sm:text-sm animate-shake">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Quick Fill Feedback */}
            {quickFillStatus && (
              <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/40 flex items-center gap-2 text-emerald-300 text-xs font-mono animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{quickFillStatus}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-emerald-300/80 mb-2 font-mono">
                  Email Quản Trị
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    autoComplete="email"
                    placeholder="admin@cotuheritage.vn"
                    className="w-full pl-10 pr-4 py-3 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500/80 rounded-xl text-white placeholder-emerald-700/50 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-emerald-300/80 mb-2 font-mono">
                  Mật Khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500/80 rounded-xl text-white placeholder-emerald-700/50 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 pl-2 flex items-center justify-center text-emerald-500/60 hover:text-amber-400 transition-colors touch-manipulation min-w-[44px] min-h-[44px]"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 sm:w-4 sm:h-4" /> : <Eye className="w-5 h-5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-emerald-950 font-semibold text-sm tracking-wide shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 touch-manipulation"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Đăng Nhập Vào Quản Trị</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick-Fill Demo Accounts for Fast Testing */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-emerald-800/20">
              <p className="text-xs text-center font-mono text-emerald-400/60 mb-3 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Tài khoản kiểm thử nhanh (1-Click Fill)
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@cotuheritage.vn', 'Admin@123456', 'Super Admin')}
                  className="p-2.5 sm:p-3 rounded-xl bg-[#17251e] hover:bg-[#1f3329] active:scale-[0.98] border border-amber-600/20 hover:border-amber-500/40 text-left transition-all group touch-manipulation"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Super Admin</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-emerald-200/50 mt-0.5 truncate font-mono">
                    Toàn quyền hệ thống
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('hocsinh@cotuheritage.vn', 'Student@123456', 'Học Sinh')}
                  className="p-2.5 sm:p-3 rounded-xl bg-[#17251e] hover:bg-[#1f3329] active:scale-[0.98] border border-emerald-700/30 hover:border-emerald-500/40 text-left transition-all group touch-manipulation"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Học Sinh</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-emerald-200/50 mt-0.5 truncate font-mono">
                    Biên tập nội dung
                  </div>
                </button>
              </div>
            </div>

          </div>

          <p className="text-center text-[11px] sm:text-xs text-emerald-400/40 mt-5 sm:mt-6 font-mono px-2">
            Bảo mật cơ sở dữ liệu Supabase RLS được thực thi ở cấp độ truy vấn PostgreSQL.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[11px] sm:text-xs text-emerald-500/40 font-mono px-4">
        © 2026 CO-TU HERITAGE AR — Dự Án Số Hóa Di Sản Văn Hóa Cơ Tu Tây Giang
      </footer>
    </div>
  );
};
