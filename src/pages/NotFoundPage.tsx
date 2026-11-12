import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-[#0D1813] border border-heritage-ochre/30 flex items-center justify-center text-heritage-ochre">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-heritage-ochre">
          {t('Lỗi 404', 'Error 404')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-heritage-wood">
          {t('Trang không tồn tại', 'Page Not Found')}
        </h1>
        <p className="text-xs sm:text-sm text-heritage-woodMuted">
          {t(
            'Địa chỉ bạn đang tìm kiếm có thể đã bị thay đổi hoặc không tồn tại trên hệ thống Di sản Cơ Tu.',
            'The page you are looking for may have been moved or does not exist on the Cơ Tu Heritage platform.'
          )}
        </p>
      </div>

      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-bold transition-colors shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Về trang chủ', 'Back to Home')}</span>
        </Link>
      </div>
    </div>
  );
};
