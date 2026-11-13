import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, QrCode, Compass } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 bg-[#070D0A]/95 backdrop-blur-xl text-heritage-wood pt-12 pb-8 border-t border-[#23352C] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Traditional Brocade Accent */}
        <div className="cotu-pattern-divider mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Col 1: Brand & Mountain Heritage Spirit */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-heritage-ochre/40 shadow-lg bg-[#0A1611] flex items-center justify-center shrink-0">
                <img
                  src="/images/logo-emblem.png"
                  alt="Cơ Tu Heritage Emblem"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="font-serif font-bold text-xl text-heritage-wood tracking-wide">
                Cơ Tu Heritage <span className="text-xs font-mono text-heritage-ochre font-normal">AR</span>
              </span>
            </div>
            
            <p className="text-sm text-heritage-woodLight/80 leading-relaxed max-w-lg">
              {t(
                'Không gian Bảo tàng Số 3D/AR lưu giữ và lan tỏa vẻ đẹp kiến trúc, nhạc cụ và nghề thủ công truyền thống của đồng bào Cơ Tu giữa đại ngàn Trường Sơn – Tây Giang, Quảng Nam.',
                'An interactive 3D/AR Digital Museum preserving and celebrating the architecture, musical instruments, and traditional crafts of the Cơ Tu people in the Trường Sơn – Tây Giang highlands.'
              )}
            </p>

            <div className="inline-flex items-center space-x-2 text-xs text-heritage-ochre bg-[#101A15] px-3.5 py-1.5 rounded-lg border border-[#23352C]">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>
                {t(
                  'Trải nghiệm 3D & WebAR trực tiếp trên trình duyệt · Song ngữ Việt – Anh',
                  'Browser-based 3D & WebAR Experience · Bilingual Vietnamese – English'
                )}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold text-heritage-ochre uppercase tracking-wider">
              {t('Không gian bảo tàng', 'Exhibition Spaces')}
            </h4>
            <ul className="space-y-2 text-sm text-heritage-woodLight">
              <li>
                <Link to="/" className="hover:text-heritage-ochre transition-colors">
                  {t('Trang chủ Đại ngàn', 'Home Stage')}
                </Link>
              </li>
              <li>
                <Link to="/artifacts" className="hover:text-heritage-ochre transition-colors">
                  {t('5 Hiện vật Văn hóa Cơ Tu', '5 Cultural Artifacts')}
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-heritage-ochre transition-colors">
                  {t('Kho từ vựng & Thẻ lật 3D', 'Vocabulary Hub & 3D Cards')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Exhibition Tools */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold text-heritage-ochre uppercase tracking-wider">
              {t('Trưng bày & Dữ liệu', 'Exhibit & Insights')}
            </h4>
            <ul className="space-y-2 text-sm text-heritage-woodLight">
              <li>
                <Link
                  to="/qr-codes"
                  className="hover:text-heritage-ochre transition-colors inline-flex items-center space-x-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-heritage-ochre" />
                  <span>{t('In nhãn mã QR hiện vật', 'Print Exhibit QR Labels')}</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-heritage-ochre transition-colors">
                  {t('Nhịp đập & Lịch sử tương tác', 'Live Engagement Pulse')}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#23352C] flex flex-col sm:flex-row items-center justify-between text-xs text-heritage-woodMuted space-y-2 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} CO TU HERITAGE AR ·{' '}
            {t('Không gian Di sản Văn hóa Cơ Tu Tây Giang.', 'Tây Giang Cơ Tu Cultural Heritage Space.')}
          </div>
          <div className="flex items-center space-x-1.5 text-heritage-ochre font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-heritage-ochre" />
            <span>WebXR 3D/AR Digital Museum</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
