import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { InteractiveBackground } from './InteractiveBackground';
import { LiveFeedbackFloatingTicker } from '../feedback/LiveFeedbackFloatingTicker';
import { SpotlightTour } from '../common/SpotlightTour';
import { ContemplationModal } from '../common/ContemplationModal';
import { artifactService } from '../../services/artifactService';
import { analyticsService } from '../../services/analyticsService';

export const Layout: React.FC = () => {
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [contemplationOpen, setContemplationOpen] = useState(false);
  const [contemplationSlug, setContemplationSlug] = useState('guol-communal-house');
  const allArtifacts = artifactService.getAll();

  useEffect(() => {
    analyticsService.syncGlobalVisitorCounter();
  }, []);

  useEffect(() => {
    analyticsService.trackPageView(location.pathname);
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOpenContemplation = (e: any) => {
      if (e.detail?.slug) {
        setContemplationSlug(e.detail.slug);
      }
      setContemplationOpen(true);
    };
    window.addEventListener('cotu_open_contemplation', handleOpenContemplation);
    return () => window.removeEventListener('cotu_open_contemplation', handleOpenContemplation);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-heritage-wood selection:bg-heritage-clay/20 pb-20 md:pb-0">
      {/* Nền hạt bay tương tác (Rừng sương Tây Giang) */}
      <InteractiveBackground />

      <Header />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Live Community Feedback Floating Ticker & Drawer */}
      <LiveFeedbackFloatingTicker
        externalDrawerOpen={mobileDrawerOpen}
        onCloseExternalDrawer={() => setMobileDrawerOpen(false)}
      />

      {/* Modern iOS App-Style Mobile Bottom Dock */}
      <MobileBottomNav
        onOpenFeedbackDrawer={() => setMobileDrawerOpen(true)}
      />

      {/* Interactive Spotlight Tour (Points to UI buttons step-by-step) */}
      <SpotlightTour />

      {/* Chế độ Lắng Nghe · Nhìn & Cảm tĩnh lặng trong sương rừng */}
      <ContemplationModal
        isOpen={contemplationOpen}
        onClose={() => setContemplationOpen(false)}
        artifacts={allArtifacts}
        initialSlug={contemplationSlug}
      />
    </div>
  );
};
