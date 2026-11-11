import React from 'react';
import { artifactService } from '../services/artifactService';
import { qrService } from '../services/qrService';
import { QRLabelItem } from '../components/qr/QRLabelItem';
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

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header (No-print) */}
      <div className="no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-heritage-sand/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-heritage-clay/10 text-heritage-clay text-xs font-semibold">
              <QrCode className="w-3.5 h-3.5" />
              <span>Nhãn trưng bày bảo tàng số</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
              Trình Tạo & In Mã QR Hiện Vật
            </h1>
            <p className="text-xs sm:text-sm text-heritage-woodMuted max-w-2xl leading-relaxed">
              Mã QR được gắn cạnh hiện vật thật tại không gian trưng bày hoặc trường học. Khi khách tham quan hoặc học sinh dùng điện thoại quét mã, trình duyệt sẽ tự động mở đúng trang chi tiết của hiện vật đó.
            </p>
          </div>

          <button
            onClick={handlePrintAll}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-heritage-clay hover:bg-heritage-clayDark text-white text-xs sm:text-sm font-semibold shadow-heritage hover:shadow-lg transition-all min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>In toàn bộ nhãn trưng bày</span>
          </button>
        </div>

        {/* Localhost Warning Banner (Important P0 requirement) */}
        {isLocalhost ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>CẢNH BÁO: ĐANG TẠO MÃ QR VỚI ĐỊA CHỈ NỘI BỘ (LOCALHOST)</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-amber-800">
              Hệ thống đang chạy trên <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900">{baseUrl}</code>. Mã QR này <strong>chỉ có thể mở trên chính máy tính hiện tại</strong>, điện thoại di động khác quét vào sẽ <strong>KHÔNG</strong> truy cập được.
            </p>
            <div className="text-xs text-amber-800 space-y-1 pt-1">
              <p className="font-semibold">Cách xử lý để in mã QR demo thực tế:</p>
              <ul className="list-disc list-inside space-y-0.5 pl-1">
                <li>
                  <strong>Cách 1 (Khuyến nghị):</strong> Deploy website lên <strong>Vercel</strong> (miễn phí), sau đó cấu hình biến môi trường <code className="bg-amber-100 px-1 py-0.5 rounded">VITE_PUBLIC_BASE_URL=https://your-app.vercel.app</code>.
                </li>
                <li>
                  <strong>Cách 2 (Thử nghiệm mạng LAN):</strong> Chạy <code className="bg-amber-100 px-1 py-0.5 rounded">npm run dev -- --host</code> và truy cập qua địa chỉ IP LAN của máy tính (ví dụ: <code className="bg-amber-100 px-1 py-0.5 rounded">http://192.168.1.x:3000</code>).
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Mã QR đang sử dụng tên miền trực tuyến chuẩn: <code className="font-mono font-bold text-emerald-800 ml-1">{baseUrl}</code>. Khách tham quan có thể quét từ mọi điện thoại có kết nối Internet!
            </span>
          </div>
        )}

        {/* Guidance for Exhibition Setup */}
        <div className="bg-heritage-cream/60 rounded-xl border border-heritage-sand p-4 text-xs text-heritage-woodMuted flex items-start space-x-2">
          <Info className="w-4 h-4 text-heritage-clay shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Mẹo in ấn:</strong> Bấm nút "In toàn bộ nhãn trưng bày" ở trên, trình duyệt sẽ tự động kích hoạt giao diện in trang A4 chuẩn. Mọi thanh điều hướng, nút bấm sẽ được ẩn tự động để chỉ in nội dung tem nhãn trang nhã.
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
