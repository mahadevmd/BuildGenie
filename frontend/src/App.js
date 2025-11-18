import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { isNativeMobile, getMobileSafeArea, getPlatformClass } from './utils/mobile';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Builder from './pages/Builder';
import SavedBuilds from './pages/SavedBuilds';
import SavedBuildDetail from './pages/SavedBuildDetail';
import GamingBuild from './pages/GamingBuild';
import BudgetBuild from './pages/BudgetBuild';
import OfficeBuild from './pages/OfficeBuild';
import WorkstationBuild from './pages/WorkstationBuild';
import ComponentInsert from './pages/ComponentInsert';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import './styles/mobile.css';

function App() {
  useEffect(() => {
    const initializeMobile = async () => {
      if (isNativeMobile()) {
        try {
          // Hide splash screen
          await SplashScreen.hide();

          // Configure status bar for dark theme
          await StatusBar.setStyle({ style: Style.Dark });

          // Set status bar background color
          await StatusBar.setBackgroundColor({ color: '#1a1a1a' });
        } catch (error) {
          console.warn('Capacitor plugins not available:', error);
        }
      }
    };

    initializeMobile();
  }, []);

  const safeAreaStyles = getMobileSafeArea();
  const platformClass = getPlatformClass();

  return (
    <AuthProvider>
      <Router>
        <div className={`flex flex-col min-h-screen ${isNativeMobile() ? 'mobile-safe-area' : ''} ${platformClass}`}
             style={{
               paddingTop: safeAreaStyles.paddingTop,
               paddingBottom: safeAreaStyles.paddingBottom
             }}>
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/builder" element={
                <ProtectedRoute>
                  <Builder />
                </ProtectedRoute>
              } />
              <Route path="/gaming-build" element={
                <ProtectedRoute>
                  <GamingBuild />
                </ProtectedRoute>
              } />
              <Route path="/budget-build" element={
                <ProtectedRoute>
                  <BudgetBuild />
                </ProtectedRoute>
              } />
              <Route path="/office-build" element={
                <ProtectedRoute>
                  <OfficeBuild />
                </ProtectedRoute>
              } />
              <Route path="/workstation-build" element={
                <ProtectedRoute>
                  <WorkstationBuild />
                </ProtectedRoute>
              } />
              <Route path="/saved-builds" element={
                <ProtectedRoute>
                  <SavedBuilds />
                </ProtectedRoute>
              } />
              <Route path="/saved-builds/:id" element={
                <ProtectedRoute>
                  <SavedBuildDetail />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Admin-only route, no navigation link */}
              <Route path="/admin/component-insert" element={
                <ProtectedRoute>
                  <ComponentInsert />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;