import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { HospitalProvider } from './context/HospitalContext.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <LanguageProvider>
          <AuthProvider>
            <HospitalProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </HospitalProvider>
          </AuthProvider>
        </LanguageProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
