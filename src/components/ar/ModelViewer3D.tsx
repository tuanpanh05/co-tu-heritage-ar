import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '@google/model-viewer';
import { 
  Box, 
  Rotate3d, 
  Smartphone, 
  Maximize2, 
  Sparkles, 
  AlertCircle, 
  QrCode, 
  Check, 
  X,
  RefreshCw
} from 'lucide-react';
import { qrService } from '../../services/qrService';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsService } from '../../services/analyticsService';

interface ModelViewer3DProps {
  modelUrl?: string;
  posterUrl?: string;
  altText: string;
  artifactSlug: string;
  artifactName: string;
  modelStatus: 'available' | 'coming_soon' | 'missing';
  cameraOrbit?: string;
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  modelUrl,
  posterUrl,
  altText,
  artifactSlug,
  artifactName,
  modelStatus,
  cameraOrbit
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [showDesktopArModal, setShowDesktopArModal] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const modelViewerRef = useRef<any>(null);
  const { t } = useLanguage();

  const directArtifactUrl = qrService.getArtifactUrl(artifactSlug);

  useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsMobileDevice(checkMobile);
  }, []);

  useEffect(() => {
    if (cameraOrbit && modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = cameraOrbit;
    }
  }, [cameraOrbit]);

  useEffect(() => {
    setLoadError(false);
    setLoading(true);

    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleProgress = (event: any) => {
      if (event.detail.totalProgress === 1) {
        setLoading(false);
      }
    };

    const handleError = (event: any) => {
      console.error('model-viewer load error:', event);
      setLoadError(true);
      setLoading(false);
    };

    const handleLoad = () => {
      setLoading(false);
      setLoadError(false);
    };

    viewer.addEventListener('progress', handleProgress);
    viewer.addEventListener('error', handleError);
    viewer.addEventListener('load', handleLoad);

    return () => {
      viewer.removeEventListener('progress', handleProgress);
      viewer.removeEventListener('error', handleError);
      viewer.removeEventListener('load', handleLoad);
    };
  }, [modelUrl]);

  const handleArClick = () => {
    if (modelViewerRef.current && isMobileDevice) {
      try {
        if (typeof modelViewerRef.current.activateAR === 'function') {
          analyticsService.trackArLaunch(artifactSlug, artifactName, artifactName, 'mobile_ar');
          modelViewerRef.current.activateAR();
          return;
        }
      } catch (err) {
        console.warn('Lỗi khi kích hoạt activateAR:', err);
      }
    }
    analyticsService.trackArLaunch(artifactSlug, artifactName, artifactName, 'qr_modal');
    setShowDesktopArModal(true);
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(directArtifactUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  if (modelStatus === 'coming_soon' || modelStatus === 'missing' || !modelUrl) {
    return (
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-br from-[#0A120E] via-[#0E1A14] to-[#0A120E] rounded-3xl overflow-hidden shadow-heritage-lg border border-[#1E3029] flex flex-col items-center justify-center p-6 text-center text-heritage-wood">
        {posterUrl && (
          <img 
            src={posterUrl} 
            alt={altText} 
            className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-[2px]"
          />
        )}
        <div className="relative z-10 max-w-md space-y-4 bg-[#0D1813]/90 backdrop-blur-md p-6 rounded-3xl border border-heritage-ochre/25 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#14221A] border border-heritage-ochre/30 flex items-center justify-center text-heritage-ochre">
            <Rotate3d className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-heritage-ochre/15 border border-heritage-ochre/30 text-heritage-ochre mb-2">
              {t('Trạng thái 3D / AR', '3D / AR Status')}
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-heritage-wood">
              {t('Mô hình 3D đang được tái tạo', '3D Model Under Reconstruction')}
            </h3>
            <p className="text-xs sm:text-sm text-heritage-woodMuted mt-1">
              {t(
                '3D model coming soon · Hiện vật đang trong lộ trình số hóa 3D từ tư liệu thực địa Tây Giang.',
                '3D model coming soon · This artifact is currently in our 3D digitization pipeline from Tây Giang field documentation.'
              )}
            </p>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowDesktopArModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-all min-h-[44px]"
            >
              <QrCode className="w-4 h-4" />
              <span>{t('Xem QR quét di động', 'View Mobile QR Code')}</span>
            </button>
          </div>
        </div>

        {showDesktopArModal && (
          <ArGuidanceModal
            onClose={() => setShowDesktopArModal(false)}
            artifactUrl={directArtifactUrl}
            artifactName={artifactName}
            copiedUrl={copiedUrl}
            onCopy={copyUrlToClipboard}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-heritage-lg border border-[#1E3029] group">
      
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        poster={posterUrl}
        alt={altText}
        camera-controls
        auto-rotate
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1.0"
        shadow-softness="0.8"
        exposure="1.05"
        interaction-prompt="auto"
        touch-action="pan-y"
      >
        {loading && (
          <div slot="progress-bar" className="absolute inset-0 bg-[#060A08]/85 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-heritage-wood">
            <RefreshCw className="w-8 h-8 animate-spin text-heritage-ochre mb-2" />
            <span className="text-xs font-medium tracking-wide">
              {t('Đang tải không gian 3D...', 'Loading 3D Space...')}
            </span>
          </div>
        )}
      </model-viewer>

      {loadError && (
        <div className="absolute inset-0 bg-[#060A08] flex flex-col items-center justify-center p-6 text-center text-heritage-wood z-30">
          <AlertCircle className="w-12 h-12 text-heritage-ochre mb-2" />
          <h4 className="font-serif font-bold text-base text-heritage-wood">
            {t('Không tải được tệp mô hình 3D (.glb)', 'Failed to load 3D model file (.glb)')}
          </h4>
          <p className="text-xs text-heritage-woodMuted max-w-sm mt-1">
            {t('Vui lòng kiểm tra đường dẫn tệp trong', 'Please check the file path in')}{' '}
            <code className="bg-[#0D1813] border border-[#1E3029] px-1.5 py-0.5 rounded text-heritage-ochre">public/models/</code>.
          </p>
        </div>
      )}

      {/* Top Banner Guide */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-[#0D1813]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-heritage-ochre/25 shadow-xs text-[11px] sm:text-xs text-heritage-wood font-medium flex items-center space-x-1.5">
          <Rotate3d className="w-3.5 h-3.5 text-heritage-ochre" />
          <span>{t('Kéo để xoay 360° · Cuộn để phóng to', 'Drag to rotate 360° · Scroll to zoom')}</span>
        </div>
        <div className="hidden sm:flex bg-[#0D1813]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-heritage-ochre/25 shadow-xs text-[11px] text-heritage-ochre font-semibold items-center space-x-1">
          <Box className="w-3.5 h-3.5" />
          <span>{t('Mô hình 3D minh họa', 'Illustrative 3D Model')}</span>
        </div>
      </div>

      {/* Bottom AR Action Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
        <button
          onClick={handleArClick}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-bold shadow-lg transition-all transform active:scale-95 min-h-[44px]"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>
            {isMobileDevice
              ? t('Đặt vào không gian thực (AR)', 'Place in Real Space (AR)')
              : t('Trải nghiệm AR trên điện thoại', 'Experience AR on Mobile')}
          </span>
        </button>

        <button
          onClick={() => {
            if (modelViewerRef.current) {
              modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
            }
          }}
          className="p-2.5 rounded-full bg-[#0D1813]/85 hover:bg-[#14221A] text-heritage-wood hover:text-heritage-ochre border border-[#1E3029] shadow-sm transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          title={t('Đặt lại góc nhìn', 'Reset camera view')}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {showDesktopArModal && (
        <ArGuidanceModal
          onClose={() => setShowDesktopArModal(false)}
          artifactUrl={directArtifactUrl}
          artifactName={artifactName}
          copiedUrl={copiedUrl}
          onCopy={copyUrlToClipboard}
        />
      )}
    </div>
  );
};

const ArGuidanceModal: React.FC<{
  onClose: () => void;
  artifactUrl: string;
  artifactName: string;
  copiedUrl: boolean;
  onCopy: () => void;
}> = ({ onClose, artifactUrl, artifactName, copiedUrl, onCopy }) => {
  const { t } = useLanguage();

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-[#0D1813] rounded-3xl max-w-md w-full p-6 text-heritage-wood shadow-2xl border border-heritage-ochre/30 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-heritage-woodMuted hover:text-heritage-wood rounded-full hover:bg-[#14221A] transition-colors"
          aria-label={t('Đóng', 'Close')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#14221A] border border-heritage-ochre/30 text-heritage-ochre flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-heritage-wood">
            {t('Trải nghiệm AR trên Thiết bị Di động', 'Experience AR on Mobile Device')}
          </h3>
          <p className="text-xs sm:text-sm text-heritage-woodMuted leading-relaxed">
            {t(
              'Tính năng đặt mô hình 3D',
              'Placing the 3D model of'
            )}{' '}
            <span className="font-semibold text-heritage-ochre">{artifactName}</span>{' '}
            {t(
              'vào không gian thực sử dụng camera và cảm biến AR trên điện thoại thông minh.',
              'into your real environment uses the camera and AR sensors on your smartphone.'
            )}
          </p>

          <div className="p-4 bg-white rounded-2xl border border-[#1E3029] inline-block shadow-inner my-2">
            <QRCodeSVG
              value={artifactUrl}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>

          <p className="text-xs text-heritage-woodMuted">
            {t(
              'Dùng máy ảnh điện thoại quét mã QR trên để mở trực tiếp trang hiện vật.',
              'Scan the QR code above with your phone camera to open the artifact page directly.'
            )}
          </p>

          <div className="pt-2 flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={artifactUrl}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-full bg-[#0A120E] border border-[#1E3029] text-heritage-wood font-mono select-all truncate"
            />
            <button
              onClick={onCopy}
              className="px-4 py-2.5 rounded-full bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs font-bold transition-colors flex items-center space-x-1 shrink-0 min-h-[38px]"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('Đã chép', 'Copied')}</span>
                </>
              ) : (
                <span>{t('Sao chép', 'Copy')}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
