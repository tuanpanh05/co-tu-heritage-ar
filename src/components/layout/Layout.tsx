import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { InteractiveBackground } from './InteractiveBackground';
import { analyticsService } from '../../services/analyticsService';

export const Layout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    analyticsService.syncGlobalVisitorCounter();
  }, []);

  useEffect(() => {
    analyticsService.trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-heritage-wood selection:bg-heritage-clay/20">
      {/* Nền hạt bay tương tác (Rừng sương Tây Giang) */}
      <InteractiveBackground />

      <Header />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
