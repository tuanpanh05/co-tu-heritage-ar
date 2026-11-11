import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Artifact } from '../../types';
import { Download, Printer, ExternalLink, AlertTriangle } from 'lucide-react';
import { qrService } from '../../services/qrService';
import { useLanguage } from '../../contexts/LanguageContext';

interface QRLabelItemProps {
  artifact: Artifact;
  onPrintSingle?: (artifact: Artifact) => void;
}

export const QRLabelItem: React.FC<QRLabelItemProps> = ({
  artifact,
  onPrintSingle
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const targetUrl = qrService.getArtifactUrl(artifact.slug);
  const isLocalhost = qrService.isLocalhost();
  const { t } = useLanguage();

  const handleDownloadSVG = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `QR_${artifact.slug}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 512, 512);
        ctx.drawImage(img, 0, 0, 512, 512);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_${artifact.slug}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="qr-label-card bg-white rounded-2xl border-2 border-heritage-sand p-6 shadow-heritage flex flex-col items-center justify-between space-y-4">
      
      {/* Label Header */}
      <div className="text-center w-full border-b pb-3 border-heritage-sand/60">
        <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-heritage-clay font-serif">
          CO TU HERITAGE AR · TÂY GIANG
        </div>
        <h3 className="text-base sm:text-lg font-serif font-semibold text-heritage-wood mt-0.5">
          {t(artifact.name.vi, artifact.name.en)}
        </h3>
        <p className="text-xs text-heritage-woodMuted italic">
          {t(artifact.name.en, artifact.name.vi)}
        </p>
      </div>

      {/* QR Code Graphic Frame */}
      <div ref={qrRef} className="p-3 bg-white rounded-xl border border-heritage-sand shadow-inner flex items-center justify-center">
        <QRCodeSVG
          value={targetUrl}
          size={160}
          level="H"
          includeMargin={true}
        />
      </div>

      {/* Instructions */}
      <div className="text-center space-y-1">
        <p className="text-xs font-medium text-heritage-wood">
          Quét mã để khám phá mô hình 3D và học liệu song ngữ
        </p>
        <p className="text-[11px] text-heritage-woodMuted italic">
          Scan to explore the 3D model and bilingual learning materials
        </p>
      </div>

      {/* Absolute URL text */}
      <div className="w-full text-center">
        <span className="text-[10px] text-heritage-woodMuted font-mono break-all px-2 py-1 rounded bg-heritage-cream block">
          {targetUrl}
        </span>
      </div>

      {/* Localhost Warning if applicable */}
      {isLocalhost && (
        <div className="w-full flex items-start space-x-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            <strong>{t('Lưu ý:', 'Note:')}</strong>{' '}
            {t(
              'QR đang dùng địa chỉ localhost. Cần mở trên URL Vercel HTTPS để điện thoại quét được!',
              'QR uses localhost. Open on your HTTPS Vercel URL for mobile scanning!'
            )}
          </span>
        </div>
      )}

      {/* Action Buttons (Hidden when printing via CSS) */}
      <div className="no-print w-full pt-3 border-t border-heritage-sand/60 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={handleDownloadPNG}
          className="px-3 py-1.5 rounded-lg bg-heritage-sand/50 hover:bg-heritage-sand text-heritage-wood text-xs font-medium transition-colors flex items-center space-x-1 min-h-[36px]"
          title={t('Tải ảnh PNG', 'Download PNG image')}
        >
          <Download className="w-3.5 h-3.5" />
          <span>PNG</span>
        </button>

        <button
          onClick={handleDownloadSVG}
          className="px-3 py-1.5 rounded-lg bg-heritage-sand/50 hover:bg-heritage-sand text-heritage-wood text-xs font-medium transition-colors flex items-center space-x-1 min-h-[36px]"
          title={t('Tải file Vector SVG', 'Download Vector SVG')}
        >
          <Download className="w-3.5 h-3.5" />
          <span>SVG</span>
        </button>

        <button
          onClick={() => {
            if (onPrintSingle) {
              onPrintSingle(artifact);
            } else {
              window.print();
            }
          }}
          className="px-3 py-1.5 rounded-lg bg-heritage-sand/50 hover:bg-heritage-sand text-heritage-wood text-xs font-medium transition-colors flex items-center space-x-1 min-h-[36px]"
          title={t('In nhãn hiện vật này', 'Print this label')}
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t('In nhãn', 'Print')}</span>
        </button>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-heritage-sand/50 hover:bg-heritage-sand text-heritage-wood text-xs font-medium transition-colors flex items-center space-x-1 min-h-[36px]"
          title={t('Mở thử liên kết', 'Test link')}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{t('Mở thử', 'Open')}</span>
        </a>
      </div>

    </div>
  );
};
