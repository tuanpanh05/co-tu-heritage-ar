import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Public Layout & Pages
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ArtifactsPage } from './pages/ArtifactsPage';
import { ArtifactDetailPage } from './pages/ArtifactDetailPage';
import { LearningPage } from './pages/LearningPage';
import { QRCodesPage } from './pages/QRCodesPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin CMS Components & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminArtifactsPage } from './pages/admin/AdminArtifactsPage';
import { AdminArtifactEditorPage } from './pages/admin/AdminArtifactEditorPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminWebsiteContentPage } from './pages/admin/AdminWebsiteContentPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC WEBSITE ROUTES (Wrapped in Public Layout) */}
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

            {/* ADMIN LOGIN (Independent minimal luxury layout) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* PROTECTED ADMIN CMS ROUTES */}
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="artifacts" element={<AdminArtifactsPage />} />
                <Route path="artifacts/create" element={<AdminArtifactEditorPage />} />
                <Route path="artifacts/:id/edit" element={<AdminArtifactEditorPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="website-content" element={<AdminWebsiteContentPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
      <Analytics />
    </LanguageProvider>
  );
};

export default App;
