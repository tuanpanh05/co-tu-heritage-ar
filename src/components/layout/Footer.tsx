import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 bg-white/80 backdrop-blur-xl text-heritage-wood pt-12 pb-8 border-t border-heritage-sand/80 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: About Project */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-heritage-clay to-heritage-forest flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif font-semibold text-lg text-heritage-wood tracking-wide">
                Cơ Tu Heritage AR
              </span>
            </div>
            <p className="text-sm text-heritage-woodMuted leading-relaxed max-w-xl">
              {t(
                'Không gian WebAR tích hợp học liệu song ngữ Việt – Anh nhằm số hóa hiện vật, hỗ trợ học tiếng Anh theo phương pháp CLIL (Content and Language Integrated Learning) và lan tỏa vẻ đẹp di sản văn hóa Cơ Tu tại núi rừng Tây Giang.',
                'An interactive WebAR space integrated with Vietnamese–English learning materials to digitize cultural artifacts, support English acquisition through CLIL (Content and Language Integrated Learning), and promote Cơ Tu heritage in Tây Giang.'
              )}
            </p>
            <div className="inline-flex items-center space-x-2 text-xs text-heritage-clay bg-heritage-cream px-3.5 py-1.5 rounded-full border border-heritage-sand">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {t(
                  '100% Mở công khai · Không đăng nhập · Bảo mật riêng tư',
                  '100% Public Access · No Login Required · Privacy First'
                )}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-serif font-semibold text-heritage-wood text-sm tracking-wider uppercase mb-3.5">
              {t('Hành trình khám phá', 'Explore Heritage')}
            </h4>
            <ul className="space-y-2.5 text-sm text-heritage-woodLight">
              <li>
                <Link to="/" className="hover:text-heritage-clay transition-colors">
                  {t('Trang chủ (Home)', 'Home')}
                </Link>
              </li>
              <li>
                <Link to="/artifacts" className="hover:text-heritage-clay transition-colors">
                  {t('Bộ sưu tập hiện vật (Artifacts)', 'Artifact Collection')}
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-heritage-clay transition-colors">
                  {t('Trung tâm học tập CLIL', 'CLIL Learning Hub')}
                </Link>
              </li>
              <li>
                <Link to="/learn/notebook" className="hover:text-heritage-clay transition-colors">
                  {t('Sổ tay từ vựng cá nhân', 'Personal Vocabulary Notebook')}
                </Link>
              </li>
              <li>
                <Link to="/qr-codes" className="hover:text-heritage-clay transition-colors">
                  {t('In nhãn mã QR hiện vật', 'Printable QR Exhibit Labels')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-heritage-clay transition-colors">
                  {t('Thống kê & Lịch sử truy cập', 'Analytics & Activity Dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Educational Notice */}
          <div>
            <h4 className="font-serif font-semibold text-heritage-wood text-sm tracking-wider uppercase mb-3.5">
              {t('Thông tin học thuật', 'Academic Notice')}
            </h4>
            <div className="p-4 rounded-2xl bg-heritage-cream/70 border border-heritage-sand space-y-2 text-xs text-heritage-woodLight leading-relaxed">
              <div className="flex items-start space-x-1.5 text-heritage-clay font-semibold">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t('Ghi chú minh họa:', 'Illustrative Note:')}</span>
              </div>
              <p className="text-heritage-woodMuted">
                {t(
                  'Dữ liệu và mô hình 3D trên hệ thống phục vụ vòng thi và thử nghiệm sư phạm. Các hiện vật được gắn nhãn minh họa cho đến khi được già làng và chuyên gia bảo tàng Tây Giang thẩm định.',
                  'Data and 3D models on this platform serve educational pilots and competition demos. Artifacts are labeled as illustrative until formally verified by Tây Giang village elders and museum specialists.'
                )}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 mt-6 border-t border-heritage-sand/60 flex flex-col sm:flex-row items-center justify-between text-xs text-heritage-woodMuted space-y-3 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} CO TU HERITAGE AR · {t('Dự án nghiên cứu thực nghiệm sư phạm Tây Giang.', 'Tây Giang Pedagogical & Cultural Heritage Project.')}
          </div>
          <div className="flex items-center space-x-1.5 text-heritage-clay font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('Nền tảng WebXR & @google/model-viewer', 'Powered by WebXR & @google/model-viewer')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
