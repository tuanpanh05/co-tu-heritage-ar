import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '@google/model-viewer';
import { 
  Box, 
  Rotate3d, 
  Smartphone, 
  Maximize2, 
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const modelViewerRef = useRef<any>(null);
  const fullscreenViewerRef = useRef<any>(null);
  const { t } = useLanguage();

  const directArtifactUrl = qrService.getArtifactUrl(artifactSlug);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const getActiveViewer = () => {
    return isFullscreen ? (fullscreenViewerRef.current || modelViewerRef.current) : modelViewerRef.current;
  };

  // Tự động nhận diện và thích ứng góc nhìn/khoảng cách camera theo tỷ lệ màn hình điện thoại
  const getAdaptiveCameraOrbit = (orbit?: string) => {
    if (!orbit) {
      return 'auto 75deg auto';
    }
    // Trên điện thoại (màn hình hẹp hơn theo chiều ngang), tự động nới thêm bán kính
    // để các hiện vật bề ngang rộng (như Nhà Gươi) không bao giờ bị cắt xén hay tràn viền
    if (isMobileDevice) {
      const parts = orbit.trim().split(/\s+/);
      if (parts.length === 3) {
        const theta = parts[0];
        const phi = parts[1];
        const radiusStr = parts[2];
        const radiusVal = parseFloat(radiusStr);
        if (!isNaN(radiusVal) && radiusStr.endsWith('%')) {
          const safeRadius = Math.max(110, radiusVal + 25);
          return `${theta} ${phi} ${safeRadius}%`;
        }
      }
    }
    return orbit;
  };

  const handleZoomIn = () => {
    const viewer = getActiveViewer();
    if (!viewer) return;
    if (typeof viewer.zoom === 'function') {
      viewer.zoom(1);
    }
    try {
      const fov = parseFloat(viewer.fieldOfView || '45');
      if (!isNaN(fov)) {
        viewer.fieldOfView = `${Math.max(12, fov - 8)}deg`;
      }
    } catch {
      // ignore
    }
  };

  const handleZoomOut = () => {
    const viewer = getActiveViewer();
    if (!viewer) return;
    if (typeof viewer.zoom === 'function') {
      viewer.zoom(-1);
    }
    try {
      const fov = parseFloat(viewer.fieldOfView || '45');
      if (!isNaN(fov)) {
        viewer.fieldOfView = `${Math.min(75, fov + 8)}deg`;
      }
    } catch {
      // ignore
    }
  };

  const handleResetView = () => {
    const viewer = getActiveViewer();
    if (!viewer) return;
    viewer.cameraOrbit = cameraOrbit ? getAdaptiveCameraOrbit(cameraOrbit) : 'auto 75deg auto';
    viewer.fieldOfView = 'auto';
    if (typeof viewer.updateFraming === 'function') {
      viewer.updateFraming();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Tự động phát hiện kích thước và hướng xoay của điện thoại để tự co giãn khung nhìn 3D
  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobileDevice(isMobile);

      // Khi xoay ngang/dọc điện thoại hoặc đổi kích thước, gọi updateFraming để căn lại 3D vừa khít
      if (modelViewerRef.current && typeof modelViewerRef.current.updateFraming === 'function') {
        modelViewerRef.current.updateFraming();
      }
      if (fullscreenViewerRef.current && typeof fullscreenViewerRef.current.updateFraming === 'function') {
        fullscreenViewerRef.current.updateFraming();
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (modelViewerRef.current) {
      if (cameraOrbit) {
        modelViewerRef.current.cameraOrbit = getAdaptiveCameraOrbit(cameraOrbit);
      } else {
        modelViewerRef.current.cameraOrbit = 'auto 75deg auto';
      }
      if (typeof modelViewerRef.current.updateFraming === 'function') {
        modelViewerRef.current.updateFraming();
      }
    }
  }, [cameraOrbit, isMobileDevice]);

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
      if (typeof viewer.updateFraming === 'function') {
        viewer.updateFraming();
      }
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
      <div className="relative w-full h-[52dvh] min-h-[320px] max-h-[560px] sm:h-auto sm:aspect-[16/10] bg-gradient-to-br from-[#0A120E] via-[#0E1A14] to-[#0A120E] rounded-2xl sm:rounded-3xl overflow-hidden shadow-heritage-lg border border-[#1E3029] flex flex-col items-center justify-center p-4 sm:p-6 text-center text-heritage-wood max-w-full">
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
    <>
      {/* Normal Embedded 3D Viewer Card: Co giãn thích ứng với chiều cao mọi thiết bị di động */}
      <div className="relative w-full h-[52dvh] min-h-[320px] max-h-[560px] sm:h-auto sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-heritage-lg border border-[#1E3029] group bg-[#0A120E] max-w-full">
        <model-viewer
          ref={modelViewerRef}
          src={modelUrl}
          poster={posterUrl}
          alt={altText}
          camera-controls
          auto-rotate
          bounds="tight"
          camera-orbit={getAdaptiveCameraOrbit(cameraOrbit)}
          field-of-view="auto"
          ar
          ar-modes="webxr scene-viewer quick-look"
          shadow-intensity="1.0"
          shadow-softness="0.8"
          exposure="1.05"
          interaction-prompt="auto"
          touch-action="pan-y"
          min-camera-orbit="auto auto 5%"
          max-camera-orbit="auto auto 400%"
          min-field-of-view="8deg"
          max-field-of-view="85deg"
          interpolation-decay="200"
          style={{ width: '100%', height: '100%', display: 'block' }}
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

        {/* Top Banner Guide (in embedded mode) */}
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

        {/* Bottom AR & 3D Interactive Control Toolbar */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2 z-10">
          <button
            onClick={handleArClick}
            className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-bold shadow-lg transition-all transform active:scale-95 min-h-[40px] sm:min-h-[44px] shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
            <span className="hidden sm:inline">
              {isMobileDevice
                ? t('Đặt vào không gian thực (AR)', 'Place in Real Space (AR)')
                : t('Trải nghiệm AR trên điện thoại', 'Experience AR on Mobile')}
            </span>
            <span className="sm:hidden font-semibold">
              {isMobileDevice ? t('Bật AR thực', 'Launch AR') : t('Quét AR', 'AR Mobile')}
            </span>
          </button>

          {/* Professional 3D Zoom & Fullscreen Toolbar */}
          <div className="flex items-center space-x-0.5 sm:space-x-1 bg-[#0D1813]/90 backdrop-blur-md p-1 rounded-full border border-[#23352C] shadow-lg shrink-0">
            {/* Zoom In (+) */}
            <button
              onClick={handleZoomIn}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-heritage-wood hover:text-heritage-ochre transition-colors min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
              title={t('Phóng to mô hình (+)', 'Zoom In (+)')}
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Zoom Out (-) */}
            <button
              onClick={handleZoomOut}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-heritage-wood hover:text-heritage-ochre transition-colors min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
              title={t('Thu nhỏ mô hình (-)', 'Zoom Out (-)')}
            >
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Reset Camera Orbit (🔄) */}
            <button
              onClick={handleResetView}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-heritage-wood hover:text-heritage-ochre transition-colors min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
              title={t('Đặt lại góc nhìn ban đầu', 'Reset Camera Orbit')}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Open Fullscreen (⛶) */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-heritage-ochre transition-colors min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
              title={t('Phóng to toàn màn hình', 'View Fullscreen')}
            >
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

      {/* Fullscreen Modal rendered through Portal into document.body to bypass any CSS container traps */}
      {isFullscreen &&
        createPortal(
          <div
            className="fixed inset-0 w-full h-[100dvh] bg-[#060D09] z-[999999] flex flex-col select-none overflow-hidden max-w-full"
            style={{ margin: 0, padding: 0 }}
          >
            {/* 1. Fullscreen Top Header with Safe Area support */}
            <header className="px-3 sm:px-6 py-2.5 sm:py-3.5 pt-[max(env(safe-area-inset-top),0.75rem)] bg-[#0A140F]/95 backdrop-blur-md border-b border-[#1E3029] flex items-center justify-between shrink-0 z-30">
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 pr-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-heritage-ochre/15 border border-heritage-ochre/30 flex items-center justify-center text-heritage-ochre shrink-0">
                  <Rotate3d className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif font-bold text-xs sm:text-base text-heritage-wood truncate max-w-[170px] xs:max-w-[240px] sm:max-w-md">
                    {artifactName}
                  </h2>
                  <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-heritage-ochre font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-heritage-ochre animate-ping" />
                    <span className="truncate">
                      {t('3D Toàn màn hình · Phóng to chi tiết', 'Fullscreen 3D · Macro Zoom')}
                    </span>
                  </div>
                </div>
              </div>

              {/* UNMISSABLE Close/Exit Button at Top-Right */}
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-xl transition-all transform active:scale-95 shrink-0"
                title={t('Thu nhỏ màn hình (Esc)', 'Exit Fullscreen (Esc)')}
              >
                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
                <span>{t('Thu nhỏ', 'Exit')}</span>
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0 hidden sm:inline" />
              </button>
            </header>

            {/* 2. Fullscreen 3D Model Canvas - 100% viewport space */}
            <div className="relative flex-1 w-full h-full overflow-hidden bg-[#060D09]">
              <model-viewer
                ref={fullscreenViewerRef}
                src={modelUrl}
                poster={posterUrl}
                alt={altText}
                camera-controls
                auto-rotate
                bounds="tight"
                camera-orbit={getAdaptiveCameraOrbit(cameraOrbit)}
                field-of-view="auto"
                ar
                ar-modes="webxr scene-viewer quick-look"
                shadow-intensity="1.2"
                shadow-softness="0.7"
                exposure="1.1"
                interaction-prompt="auto"
                touch-action="none"
                min-camera-orbit="auto auto 5%"
                max-camera-orbit="auto auto 450%"
                min-field-of-view="8deg"
                max-field-of-view="85deg"
                interpolation-decay="200"
                style={{ width: '100%', height: '100%', display: 'block' }}
              />

              {/* Center Floating Guide Tip */}
              <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-20 px-3 w-full max-w-sm sm:max-w-md text-center">
                <div className="inline-flex bg-[#0D1813]/90 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-heritage-ochre/30 shadow-lg text-[10px] sm:text-xs text-heritage-wood items-center space-x-1.5 sm:space-x-2">
                  <Rotate3d className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-heritage-ochre shrink-0" />
                  <span className="truncate">
                    {t(
                      'Chụm 2 ngón tay hoặc cuộn để zoom sát vân gỗ',
                      'Pinch or scroll to zoom in close to wood grain'
                    )}
                  </span>
                </div>
              </div>

              {/* Bottom Fullscreen Controls Toolbar */}
              <div className="absolute bottom-[max(env(safe-area-inset-bottom),1rem)] sm:bottom-6 left-3 right-3 sm:left-8 sm:right-8 flex items-center justify-between gap-2 z-20 pointer-events-none">
                {/* Left: AR Button */}
                <button
                  onClick={handleArClick}
                  className="pointer-events-auto flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-bold shadow-2xl transition-all transform active:scale-95 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
                  <span className="hidden sm:inline">
                    {isMobileDevice
                      ? t('Đặt vào không gian thực (AR)', 'Place in Real Space (AR)')
                      : t('Trải nghiệm AR trên điện thoại', 'Experience AR on Mobile')}
                  </span>
                  <span className="sm:hidden font-semibold">
                    {isMobileDevice ? t('Bật AR', 'AR') : t('Quét AR', 'AR')}
                  </span>
                </button>

                {/* Right: Zoom In, Zoom Out, Reset, and Quick Exit */}
                <div className="pointer-events-auto flex items-center space-x-0.5 sm:space-x-1.5 bg-[#0D1813]/95 backdrop-blur-xl p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-heritage-ochre/30 shadow-2xl shrink-0">
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/10 text-heritage-wood hover:text-heritage-ochre transition-all flex items-center space-x-1 text-xs"
                    title={t('Phóng to (+)', 'Zoom In (+)')}
                  >
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-heritage-ochre" />
                    <span className="hidden md:inline font-mono font-medium">{t('Phóng to', 'Zoom')}</span>
                  </button>

                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/10 text-heritage-wood hover:text-heritage-ochre transition-all flex items-center space-x-1 text-xs"
                    title={t('Thu nhỏ (-)', 'Zoom Out (-)')}
                  >
                    <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-heritage-ochre" />
                    <span className="hidden md:inline font-mono font-medium">{t('Thu nhỏ', 'Zoom out')}</span>
                  </button>

                  <div className="h-4 sm:h-5 w-px bg-white/10" />

                  <button
                    onClick={handleResetView}
                    className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-white/10 text-heritage-wood hover:text-heritage-ochre transition-all flex items-center space-x-1 text-xs"
                    title={t('Đặt lại góc nhìn ban đầu', 'Reset Camera')}
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-heritage-ochre" />
                    <span className="hidden md:inline font-mono font-medium">{t('Đặt lại', 'Reset')}</span>
                  </button>

                  <div className="h-4 sm:h-5 w-px bg-white/10" />

                  <button
                    onClick={toggleFullscreen}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-heritage-ochre text-slate-950 font-bold hover:bg-heritage-ochreLight transition-all flex items-center space-x-1 text-xs shadow-md"
                    title={t('Thoát toàn màn hình (Esc)', 'Exit Fullscreen (Esc)')}
                  >
                    <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">{t('Thu bé', 'Exit')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
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
