import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/auth/AuthContext';
import { I18nProvider } from './i18n/I18nContext';
import { ThemeProvider } from './theme/ThemeContext';
import { ProtectedRoute, PublicRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import { SplashPage } from './pages/SplashPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PublicVerificationPage } from './pages/PublicVerificationPage';
import { TrainingViewer } from './features/training/TrainingViewer';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <I18nProvider>
        <Router>
          <Routes>
            {/* Splash Route */}
            <Route path="/" element={<SplashPage />} />

            {/* Public Authentication Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Public Blockchain Verification Routes (No login required) */}
            <Route path="/verify" element={<PublicVerificationPage />} />
            <Route path="/verify/:certificateId" element={<PublicVerificationPage />} />

            {/* Protected Application Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <HomePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CoursesPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CourseDetailPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/training/:scenarioId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TrainingViewer />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 Route */}
            <Route
              path="/404"
              element={
                <AppLayout>
                  <NotFoundPage />
                </AppLayout>
              }
            />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </I18nProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
