import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { InteractiveBackground } from './InteractiveBackground';

export const Layout: React.FC = () => {
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
