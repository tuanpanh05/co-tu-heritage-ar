import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { InteractiveBackground } from './InteractiveBackground';
import { LiveFeedbackFloatingTicker } from '../feedback/LiveFeedbackFloatingTicker';
import { SpotlightTour } from '../common/SpotlightTour';
import { analyticsService } from '../../services/analyticsService';

export const Layout: React.FC = () => {
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    analyticsService.syncGlobalVisitorCounter();
  }, []);

  useEffect(() => {
    analyticsService.trackPageView(location.pathname);
    setMobileDrawerOpen(false);
  }, [location.pathname]);

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
    </div>
  );
};
