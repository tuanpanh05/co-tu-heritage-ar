import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ArtifactsPage } from './pages/ArtifactsPage';
import { ArtifactDetailPage } from './pages/ArtifactDetailPage';
import { LearningPage } from './pages/LearningPage';
import { NotebookPage } from './pages/NotebookPage';
import { QRCodesPage } from './pages/QRCodesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="artifacts" element={<ArtifactsPage />} />
          <Route path="artifacts/:slug" element={<ArtifactDetailPage />} />
          <Route path="learn" element={<LearningPage />} />
          <Route path="learn/notebook" element={<NotebookPage />} />
          <Route path="qr-codes" element={<QRCodesPage />} />
          
          {/* Legacy redirect or aliases if any */}
          <Route path="notebook" element={<Navigate to="/learn/notebook" replace />} />
          
          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

