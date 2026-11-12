import React from 'react';
import { artifactService } from '../services/artifactService';
import { qrService } from '../services/qrService';
import { QRLabelItem } from '../components/qr/QRLabelItem';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Printer, 
  QrCode, 
  AlertTriangle, 
  Info, 
  Sparkles
} from 'lucide-react';

export const QRCodesPage: React.FC = () => {
  const artifacts = artifactService.getAll();
  const isLocalhost = qrService.isLocalhost();
  const baseUrl = qrService.getBaseUrl();
  const { t } = useLanguage();

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header (No-print) */}
      <div className="no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-heritage-sand/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-heritage-ochre/15 border border-heritage-ochre/30 text-heritage-ochre text-xs font-semibold">
              <QrCode className="w-3.5 h-3.5" />
              <span>{t('Nhãn trưng bày bảo tàng số', 'Digital Museum Exhibit Labels')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
              {t('Trình Tạo & In Mã QR Hiện Vật', 'Artifact QR Label Generator & Printer')}
            </h1>
            <p className="text-xs sm:text-sm text-heritage-woodMuted max-w-2xl leading-relaxed">
              {t(
                'Mã QR được gắn cạnh hiện vật thật tại không gian trưng bày hoặc trường học. Khi khách tham quan hoặc học sinh dùng điện thoại quét mã, trình duyệt sẽ tự động mở đúng trang chi tiết của hiện vật đó.',
                'Attach these QR labels next to physical exhibits at museums or schools. Visitors and students can scan the code with their phone camera to open the artifact’s 3D/AR and bilingual page immediately.'
              )}
            </p>
          </div>

          <button
            onClick={handlePrintAll}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-bold shadow-heritage hover:shadow-lg transition-all min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>{t('In toàn bộ nhãn trưng bày', 'Print All Exhibit Labels')}</span>
          </button>
        </div>

        {/* Localhost Warning Banner */}
        {isLocalhost ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                {t(
                  'CẢNH BÁO: ĐANG TẠO MÃ QR VỚI ĐỊA CHỈ NỘI BỘ (LOCALHOST)',
                  'WARNING: QR CODES ARE USING A LOCALHOST ADDRESS'
                )}
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-amber-800">
              {t('Hệ thống đang chạy trên', 'The app is currently running on')}{' '}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900">{baseUrl}</code>.{' '}
              {t(
                'Mã QR này chỉ có thể mở trên chính máy tính hiện tại, điện thoại di động khác quét vào sẽ KHÔNG truy cập được.',
                'These QR codes will only work on this computer—mobile phones scanning them will NOT be able to connect.'
              )}
            </p>
            <div className="text-xs text-amber-800 space-y-1 pt-1">
              <p className="font-semibold">
                {t('Cách xử lý để in mã QR demo thực tế:', 'How to generate scannable QR codes for mobile devices:')}
              </p>
              <ul className="list-disc list-inside space-y-0.5 pl-1">
                <li>
                  <strong>{t('Cách 1 (Khuyến nghị):', 'Option 1 (Recommended):')}</strong>{' '}
                  {t(
                    'Truy cập trang web đã deploy trên Vercel',
                    'Open your live Vercel deployment'
                  )} (<code className="bg-amber-100 px-1 py-0.5 rounded">https://cotuheritage.vercel.app/qr-codes</code>){' '}
                  {t('để in nhãn QR chuẩn.', 'to print production QR labels.')}
                </li>
                <li>
                  <strong>{t('Cách 2 (Thử nghiệm mạng LAN):', 'Option 2 (Local Wi-Fi LAN):')}</strong>{' '}
                  {t('Chạy', 'Run')}{' '}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">npm run dev -- --host</code>{' '}
                  {t('và truy cập qua địa chỉ IP LAN của máy tính.', 'and open via your computer’s LAN IP address.')}
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#0D1813] border border-heritage-ochre/40 text-heritage-wood text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-heritage-ochre shrink-0" />
            <span>
              {t(
                'Mã QR đang sử dụng tên miền trực tuyến chuẩn:',
                'QR codes are using the live production domain:'
              )}{' '}
              <code className="font-mono font-bold text-heritage-ochre ml-1">{baseUrl}</code>.{' '}
              {t(
                'Khách tham quan có thể quét từ mọi điện thoại có kết nối Internet!',
                'Visitors can scan from any smartphone with Internet access!'
              )}
            </span>
          </div>
        )}

        {/* Guidance for Exhibition Setup */}
        <div className="bg-[#0D1813]/80 rounded-xl border border-[#1E3029] p-4 text-xs text-heritage-wood/80 flex items-start space-x-2">
          <Info className="w-4 h-4 text-heritage-ochre shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>{t('Mẹo in ấn:', 'Printing Tip:')}</strong>{' '}
            {t(
              'Bấm nút "In toàn bộ nhãn trưng bày" ở trên, trình duyệt sẽ tự động kích hoạt giao diện in trang A4 chuẩn. Mọi thanh điều hướng, nút bấm sẽ được ẩn tự động để chỉ in nội dung tem nhãn trang nhã.',
              'Click "Print All Exhibit Labels" above to open the A4 print dialog. Navigation bars and action buttons are automatically hidden so only clean museum labels are printed.'
            )}
          </p>
        </div>
      </div>

      {/* Printable Grid of Labels */}
      <div className="printable-qr-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {artifacts.map((artifact) => (
          <QRLabelItem key={artifact.id} artifact={artifact} />
        ))}
      </div>

    </div>
  );
};
