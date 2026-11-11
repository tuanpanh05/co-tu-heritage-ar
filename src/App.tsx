import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ArtifactsPage } from './pages/ArtifactsPage';
import { ArtifactDetailPage } from './pages/ArtifactDetailPage';
import { LearningPage } from './pages/LearningPage';
import { QRCodesPage } from './pages/QRCodesPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="artifacts" element={<ArtifactsPage />} />
            <Route path="artifacts/:slug" element={<ArtifactDetailPage />} />
            <Route path="learn" element={<LearningPage />} />
            <Route path="qr-codes" element={<QRCodesPage />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Legacy redirects */}
            <Route path="learn/notebook" element={<Navigate to="/learn" replace />} />
            <Route path="notebook" element={<Navigate to="/learn" replace />} />
            <Route path="analytics" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Analytics />
    </LanguageProvider>
  );
};

export default App;
